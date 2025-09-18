
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const modelResponse = [
        'Hello! ',
        'This is a streamed response ',
        'from a placeholder API. ',
        'I am mimicking the behavior ',
        'of a large language model. ',
        'How can I help you today?'
      ];

      for (const chunk of modelResponse) {
        controller.enqueue(encoder.encode(chunk));
        await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate delay
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
