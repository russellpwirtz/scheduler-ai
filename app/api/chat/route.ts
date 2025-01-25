import { NextResponse } from 'next/server';
import { OpenAIService } from '@/lib/openai.service';

const openaiService = new OpenAIService();

export async function POST(req: Request) {
  const body = await req.json();
//   console.log('Received messages:', body.messages);
  
  try {
    const { messages } = body;
    const response = await openaiService.createChatCompletion(messages);
    
    return NextResponse.json({ response });
    
  } catch (error) {
    console.error('Processing error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process message' },
      { status: 500 }
    );
  }
}