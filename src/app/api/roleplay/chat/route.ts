/* eslint-disable @typescript-eslint/no-explicit-any */
import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { getSystemPrompt, PersonaId } from '@/lib/ai/prompts';
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export const maxDuration = 30; // Allow max 30 seconds for streaming

export async function POST(req: NextRequest) {
  try {
    // 1. Origin Check
    const fetchSite = req.headers.get('sec-fetch-site');

    if (fetchSite && fetchSite !== 'same-origin' && fetchSite !== 'same-site') {
      return new Response('Forbidden: Cross-site request blocked', { status: 403 });
    }

    const ip = getClientIp(req);

    // 2. Rate Limiting durable (Supabase) : 10 req/min par IP
    const perMinute = await checkRateLimit(`roleplay:ip:${ip}`, 10, 60 * 1000);
    if (!perMinute.allowed) {
      return new Response('Too Many Requests', { status: 429 });
    }

    // 3. Auth & Quota Check
    const authHeader = req.headers.get('Authorization');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (authHeader && authHeader.startsWith('Bearer ') && authHeader.length > 10) {
      // Utilisateur connecté avec session Supabase
      const supabase = createClient(supabaseUrl, supabaseKey, {
        global: { headers: { Authorization: authHeader } }
      });

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (!authError && user) {
        const { data: quotaOk, error: quotaError } = await supabase.rpc('consume_ai_quota');
        if (quotaError) {
          console.error('[Supabase Quota Error]:', quotaError);
        }
        if (!quotaOk) {
          return new Response(JSON.stringify({
            error: 'QUOTA_EXCEEDED',
            message: 'Quota quotidien de 8 messages atteint. Passez à Kenza Pro pour des conversations illimitées !'
          }), 
{ status: 403, headers: { 'Content-Type': 'application/json' } });
        }
      }
    } else {
      // Mode Invité : quota de découverte 3 messages par IP et par jour (durable)
      const guestQuota = await checkRateLimit(`roleplay:guest:${ip}`, 3, 24 * 60 * 60 * 1000);
      if (!guestQuota.allowed) {
        return new Response(JSON.stringify({
          error: 'QUOTA_EXCEEDED',
          guest: true,
          message: 'Votre session d\'essai gratuite de 3 messages est terminée. Connectez-vous ou débloquez Kenza Pro pour continuer !'
        }), { status: 403, headers: { 'Content-Type': 'application/json' } });
      }
    }

    const { messages, personaId } = await req.json();

    // 4. Payload Validation
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
