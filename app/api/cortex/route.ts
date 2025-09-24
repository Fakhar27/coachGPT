import { NextRequest, NextResponse } from 'next/server';

// Get Lambda URL from environment or use a default
const CORTEX_LAMBDA_URL = process.env.CORTEX_LAMBDA_URL || 
  'https://your-lambda-endpoint.amazonaws.com/default/cortex';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, coachId, coachInstructions, model, conversationId } = body;

    if (!message || !model) {
      return NextResponse.json(
        { error: 'Message and model are required' },
        { status: 400 }
      );
    }

    // Prepare the request for Cortex Lambda
    const cortexRequest = {
      input: message,
      model: model,
      instructions: coachInstructions || "You are a helpful assistant.",
      store: true, // Always store for persistence
      temperature: 0.7,
      db_url: process.env.db_url, // PostgreSQL connection for Cortex
      ...(conversationId && { previous_response_id: conversationId })
    };

    console.log('Calling Cortex Lambda with:', {
      model: cortexRequest.model,
      hasInstructions: !!cortexRequest.instructions,
      hasPreviousId: !!conversationId,
      hasDbUrl: !!cortexRequest.db_url
    });

    // Call the Lambda function with extended timeout for cold starts
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
    
    try {
      const response = await fetch(CORTEX_LAMBDA_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cortexRequest),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Lambda error:', errorText);
        throw new Error(`Lambda returned ${response.status}: ${errorText}`);
      }

      const lambdaResponse = await response.json();
      console.log('Raw Lambda response:', JSON.stringify(lambdaResponse, null, 2));
      
      // Parse the Lambda response body if it's stringified
      const responseData = typeof lambdaResponse.body === 'string' 
        ? JSON.parse(lambdaResponse.body)
        : lambdaResponse;

      console.log('Parsed response data:', JSON.stringify(responseData, null, 2));

      // Extract the assistant's message from Cortex's response structure
      let message = "No response from model";
      
      // Cortex returns message in: output[0].content[0].text
      if (responseData.output && responseData.output.length > 0) {
        const outputMessage = responseData.output[0];
        if (outputMessage.content && outputMessage.content.length > 0) {
          message = outputMessage.content[0].text || message;
        }
      }
      
      const result = {
        message: message,
        conversationId: responseData.id, // Cortex uses 'id' for response_id
        model: responseData.model || model,
        usage: responseData.usage || null,
        execution_time: responseData.execution_time || null
      };

      return NextResponse.json(result);
      
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error('Lambda request timed out after 60 seconds');
        throw new Error('Lambda request timed out (cold start). Please try again.');
      }
      throw fetchError;
    }

  } catch (error) {
    console.error('Error in Cortex API route:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get response from Cortex',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}