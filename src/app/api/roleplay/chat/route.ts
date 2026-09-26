import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { getSystemPrompt, PersonaId } from '@/lib/ai/prompts';
import { NextRequest } from 'next/server';

export const maxDuration = 30; // Allow max 30 seconds for streaming

export async function POST(req: NextRequest) {
  try {
    const { messages, personaId } = await req.json();

    if (!messages) {
      return new Response('Messages array is required', { status: 400 });
    }

    const systemPrompt = getSystemPrompt(personaId as PersonaId);

    // Call the Gemini model using Vercel AI SDK
    const result = await streamText({
      model: google('gemini-1.5-flash'),
      system: systemPrompt,
      messages,
      temperature: 0.7,
      maxOutputTokens: 300, // Short responses
    });

    // Return the streaming response
    return result.toTextStreamResponse();
  } catch (error) {
    console.error('API Roleplay Chat Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
