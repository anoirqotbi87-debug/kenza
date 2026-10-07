import { streamText, type CoreMessage } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { getSystemPrompt, PersonaId } from '@/lib/ai/prompts';
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { isAllowedOrigin } from '@/lib/allowedOrigins';
import crypto from 'crypto';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get('origin');
    const referer = req.headers.get('referer');
    const fetchSite = req.headers.get('sec-fetch-site');

    if (!origin && !referer && !fetchSite) {
      return new Response('Forbidden: Missing origin headers', { status: 403 });
    }
    // Bloquer uniquement les requêtes explicitement cross-site.
    // Autoriser same-origin, same-site et 'none' (PWA standalone, WebView mobile, requêtes directes).
    if (fetchSite === 'cross-site') {
      return new Response('Forbidden: Cross-site request blocked', { status: 403 });
    }
    if (origin && !isAllowedOrigin(origin)) {
      return new Response('Forbidden: Origin not allowed', { status: 403 });
    }
    if (referer) {
      try {
        const refUrl = new URL(referer);
        if (!isAllowedOrigin(refUrl.origin)) return new Response('Forbidden: Referer not allowed', { status: 403 });
      } catch {
        return new Response('Forbidden: Invalid referer', { status: 403 });
      }
    }

    const ip = getClientIp(req);

    const perMinute = await checkRateLimit(`roleplay:ip:${ip}`, 10, 60 * 1000);
    if (perMinute.error) {
      return new Response('Service Unavailable (DB)', { status: 503 });
    }
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
          return new Response('Service Unavailable (DB)', { status: 503 });
        }
        if (!quotaOk) {
          return new Response(JSON.stringify({
            error: 'QUOTA_EXCEEDED',
            message: 'Quota quotidien de 8 messages atteint. Passez à Kenza Pro pour des conversations illimitées !'
          }), { status: 403, headers: { 'Content-Type': 'application/json' } });
        }
      }
    } else {
      const userAgent = req.headers.get('user-agent') || '';
      const fingerprint = crypto.createHash('sha256').update(`${userAgent}${ip}`).digest('hex');
      const guestQuota = await checkRateLimit(`roleplay:guest:${ip}:${fingerprint}`, 3, 24 * 60 * 60 * 1000);
      if (guestQuota.error) {
        return new Response('Service Unavailable (DB)', { status: 503 });
      }
      if (!guestQuota.allowed) {
        return new Response(JSON.stringify({
          error: 'QUOTA_EXCEEDED',
          guest: true,
          message: 'Votre session d\'essai gratuite de 3 messages est terminée. Connectez-vous ou débloquez Kenza Pro pour continuer !'
        }), { status: 403, headers: { 'Content-Type': 'application/json' } });
      }
    }

    const body = await req.json();
    const messages = body?.messages;
    const personaParam = (body?.personaId || body?.persona) as PersonaId;

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

    const totalChars = messages.reduce(
      (sum: number, m: CoreMessage) => sum + (typeof m.content === 'string' ? m.content.length : 0),
      0
    );
    if (totalChars > 4000) return new Response('Payload too large', { status: 400 });

    const systemPrompt = getSystemPrompt(personaParam);
    if (!systemPrompt) {
      return new Response('Invalid persona or personaId', { status: 400 });
    }

    const apiKey =
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      process.env.GEMINI_API_KEY ||
      (process.env.NODE_ENV === 'test' ? 'test-api-key' : '');
    if (!apiKey) {
      console.error('[Roleplay Chat] Missing Google Gemini API key');
      return new Response(JSON.stringify({
        error: 'AI_SERVICE_UNAVAILABLE',
        message: 'Service IA momentanément indisponible (clé API non configurée).'
      }), { status: 503, headers: { 'Content-Type': 'application/json' } });
    }

    const google = createGoogleGenerativeAI({ apiKey });
    const primaryModel = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    let result;
    try {
      result = await streamText({
        model: google(primaryModel),
        system: systemPrompt,
        messages,
        temperature: 0.7,
        maxTokens: 300, // Short responses
        maxRetries: 0, // Pas de retry long
      });
    } catch (primaryErr: unknown) {
      const primaryMsg = primaryErr instanceof Error ? primaryErr.message : String(primaryErr);
      const isNotFound = primaryMsg.includes('not found') || primaryMsg.includes('404');
      if (isNotFound && primaryModel !== 'gemini-2.0-flash') {
        console.warn(`[Roleplay Chat] Primary model ${primaryModel} failed with 404, falling back to gemini-2.0-flash`);
        result = await streamText({
          model: google('gemini-2.0-flash'),
          system: systemPrompt,
          messages,
          temperature: 0.7,
          maxTokens: 300,
          maxRetries: 0,
        });
      } else {
        throw primaryErr;
      }
    }

    // Return the streaming response
    return result.toDataStreamResponse();
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    const status =
      (error as { status?: number; statusCode?: number } | undefined)?.status ??
      (error as { status?: number; statusCode?: number } | undefined)?.statusCode;
    console.error('API Roleplay Chat Error:', errMsg, '| upstream status:', status);

    const isAuth =
      status === 401 ||
      status === 403 ||
      errMsg.includes('API key') ||
      errMsg.includes('authentication') ||
      errMsg.includes('credentials') ||
      errMsg.includes('Permission denied');

    const isNotFound =
      status === 404 ||
      errMsg.includes('not found') ||
      errMsg.includes('is not supported');

    const isQuota =
      status === 429 ||
      errMsg.includes('quota') ||
      errMsg.includes('Resource exhausted');

    // Sur erreur 401/403 (clé invalide / permission), 404 (modèle non supporté), 429 (quota) ou 5xx : renvoyer immédiatement HTTP 503
    if (
      isAuth ||
      isNotFound ||
      isQuota ||
      (status !== undefined && status >= 500)
    ) {
      let clientMsg = 'Service IA temporairement indisponible. Veuillez réessayer dans un instant.';
      if (isAuth) {
        clientMsg = 'Service IA momentanément indisponible : clé Google Gemini invalide ou expirée (doit commencer par AIzaSy...).';
      } else if (isQuota) {
        clientMsg = 'Quota Google Gemini temporairement atteint. Veuillez réessayer dans quelques instants.';
      } else if (isNotFound) {
        clientMsg = 'Modèle Google Gemini introuvable ou non supporté.';
      }

      return new Response(JSON.stringify({
        error: 'AI_SERVICE_UNAVAILABLE',
        message: clientMsg
      }), { status: 503, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'INTERNAL_ERROR', message: errMsg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
