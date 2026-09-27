import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { getSystemPrompt, PersonaId } from '@/lib/ai/prompts';
import { NextRequest } from 'next/server';

export const maxDuration = 30; // Allow max 30 seconds for streaming

// Simple in-memory rate limiter (Note: Instance-scoped in serverless environments)
const rateLimit = new Map<string, { count: number, resetAt: number }>();

export async function POST(req: NextRequest) {
  try {
    // 1. Origin Check
    const fetchSite = req.headers.get('sec-fetch-site');
    const origin = req.headers.get('origin') || req.headers.get('referer');
    
    // Allow same-origin or localhost for dev, but block external cross-site
    if (fetchSite && fetchSite !== 'same-origin' && fetchSite !== 'same-site') {
      return new Response('Forbidden: Cross-site request blocked', { status: 403 });
    }
    
    // 2. Rate Limiting (per IP, max 10 req/min)
    // In serverless, memory state is ephemeral per instance. Kept in memory as requested if no external Redis is available.
    const ip = req.headers.get('x-real-ip') ?? req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '127.0.0.1';
    const now = Date.now();
    const windowMs = 60 * 1000;
    
    let record = rateLimit.get(ip);
    if (!record || now > record.resetAt) {
      record = { count: 0, resetAt: now + windowMs };
    }
    record.count++;
    rateLimit.set(ip, record);
    
    if (record.count > 10) {
      return new Response('Too Many Requests', { status: 429 });
    }

    const { messages, personaId } = await req.json();

    // 3. Payload Validation
    if (!messages || !Array.isArray(messages)) {
      return new Response('Messages array is required', { status: 400 });
    }
    
    if (messages.length > 15) {
      return new Response('Maximum context length exceeded', { status: 400 });
    }
    
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.content && lastMessage.content.length > 500) {
      return new Response('Message exceeds maximum length of 500 characters', { status: 400 });
    }

    const totalChars = messages.reduce((sum: number, m: any) => sum + (m.content?.length || 0), 0);
    if (totalChars > 4000) return new Response('Payload too large', { status: 400 });

    const systemPrompt = getSystemPrompt(personaId as PersonaId);
    if (!systemPrompt) {
      return new Response('Invalid personaId', { status: 400 });
    }

    // Call the Gemini model using Vercel AI SDK
    const result = await streamText({
      model: google('gemini-1.5-flash'),
      system: systemPrompt,
      messages,
      temperature: 0.7,
      maxTokens: 300, // Short responses
    });

    // Return the streaming response
    return result.toDataStreamResponse();
  } catch (error) {
    console.error('API Roleplay Chat Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
