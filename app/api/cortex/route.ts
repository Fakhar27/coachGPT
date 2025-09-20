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
      ...(conversationId && { previous_response_id: conversationId })
    };

    console.log('Calling Cortex Lambda with:', {
      model: cortexRequest.model,
      hasInstructions: !!cortexRequest.instructions,
      hasPreviousId: !!conversationId
    });

    // Call the Lambda function
    const response = await fetch(CORTEX_LAMBDA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cortexRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lambda error:', errorText);
      throw new Error(`Lambda returned ${response.status}: ${errorText}`);
    }

    const lambdaResponse = await response.json();
    
    // Parse the Lambda response body if it's stringified
    const responseData = typeof lambdaResponse.body === 'string' 
      ? JSON.parse(lambdaResponse.body)
      : lambdaResponse;

    // Extract the assistant's message and response ID
    const result = {
      message: responseData.response || responseData.message || "No response from model",
      conversationId: responseData.response_id || responseData.id,
      model: responseData.model || model,
      usage: responseData.usage || null,
      execution_time: responseData.execution_time || null
    };

    return NextResponse.json(result);

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