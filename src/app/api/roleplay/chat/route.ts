import { streamText, type CoreMessage } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { getSystemPrompt, PersonaId } from '@/lib/ai/prompts';
import { sanitizeHistory } from '@/lib/ai/sanitizeHistory';
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { isAllowedOrigin } from '@/lib/allowedOrigins';
import crypto from 'crypto';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    // 1. Contrôle d'origine
    const origin = req.headers.get('origin');
    const referer = req.headers.get('referer');
    const fetchSite = req.headers.get('sec-fetch-site');

    if (!origin && !referer && !fetchSite) {
      return new Response('Forbidden: Missing origin headers', { status: 403 });
    }
    // Bloquer uniquement les requêtes explicitement cross-site.
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

    // 2. Rate limiting anti-abus
    const perMinute = await checkRateLimit(`roleplay:ip:${ip}`, 15, 60 * 1000);
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

    // 4. Clé API Groq
    const apiKey =
      process.env.GROQ_API_KEY?.trim() ||
      (process.env.NODE_ENV === 'test' ? 'test-groq-key' : '');
    if (!apiKey) {
      console.error('[Groq Roleplay] Missing GROQ_API_KEY');
      return new Response(JSON.stringify({
        error: 'CONFIG_ERROR',
        message: 'Clé GROQ_API_KEY non configurée sur le serveur Vercel.'
      }), { status: 503, headers: { 'Content-Type': 'application/json' } });
    }

    const body = await req.json();
    const messages = body?.messages;
    const personaParam = (body?.personaId || body?.persona) as PersonaId;
    const userLanguage = (body?.userLanguage || 'fr').toLowerCase();

    // 5. Payload Validation & History Sanitization
    if (!messages || !Array.isArray(messages)) {
      return new Response('Messages array is required', { status: 400 });
    }

    if (messages.length > 15) {
      return new Response('Maximum context length exceeded', { status: 400 });
    }

    const systemPrompt = getSystemPrompt(personaParam);
    if (!systemPrompt) {
      return new Response(JSON.stringify({ error: 'INVALID_PERSONA', message: 'Persona inconnu' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const normalizedHistory = sanitizeHistory(messages);
    if (!normalizedHistory) {
      return new Response(JSON.stringify({
        error: 'INVALID_HISTORY',
        message: "Le dernier message doit provenir de l'utilisateur."
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const lastMessage = normalizedHistory[normalizedHistory.length - 1];
    if (lastMessage?.content && lastMessage.content.length > 500) {
      return new Response('Message exceeds maximum length of 500 characters', { status: 400 });
    }

    const totalChars = normalizedHistory.reduce(
      (sum: number, m) => sum + m.content.length,
      0
    );
    if (totalChars > 4000) return new Response('Payload too large', { status: 400 });

    // 6. Streaming ultra-rapide avec Groq (Modèle validé + repli automatique)
    const groq = createOpenAI({
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey,
    });

    const CANDIDATE_MODELS = [
      'qwen/qwen3.8-27b',
      'allam-2-7b',
      'openai/gpt-oss-120b',
    ];

    let targetLanguageLabel = 'Français';
    let isArabicImmersion = false;
    if (userLanguage === 'en') {
      targetLanguageLabel = 'Anglais (English)';
    } else if (userLanguage === 'es') {
      targetLanguageLabel = 'Espagnol (Español)';
    } else if (userLanguage === 'ar') {
      isArabicImmersion = true;
    }

    const linguisticRule = isArabicImmersion
      ? `RÈGLE LINGUISTIQUE STRICTE :
1. Réponds UNIQUEMENT en Darija marocaine authentique avec le chakl (vocalisation complète). Ne commence jamais par une voyelle ou un caractère invisible.
2. Immersion arabe totale : ne fournis AUCUNE traduction dans une langue étrangère.
Format attendu :
[AR] phrase en Darija vocalisée [/AR]`
      : `RÈGLE LINGUISTIQUE STRICTE :
1. Réponds UNIQUEMENT en Darija marocaine authentique avec chakl (vocalisation complète). Ne commence jamais par une voyelle ou un caractère invisible.
2. Fournis UNIQUEMENT la traduction en ${targetLanguageLabel}.
3. Ne génère JAMAIS d'autres langues simultanément (pas d'anglais si l'utilisateur est en français, pas de mélange).
Format attendu :
[AR] phrase en Darija vocalisée [/AR]
[TR] traduction unique en ${targetLanguageLabel} [/TR]`;

    const systemInstruction = `${systemPrompt}\n\n${linguisticRule}`;

    let lastError: unknown = null;
    for (const modelId of CANDIDATE_MODELS) {
      try {
        const result = await streamText({
          model: groq(modelId),
          system: systemInstruction,
          messages: normalizedHistory as CoreMessage[],
          temperature: 0.35,
          maxTokens: 120,
          maxRetries: 0,
        });

        return result.toDataStreamResponse();
      } catch (err: unknown) {
        lastError = err;
        const errStatus =
          (err as { status?: number; statusCode?: number } | undefined)?.status ??
          (err as { status?: number; statusCode?: number } | undefined)?.statusCode;
        const errStr = err instanceof Error ? err.message : String(err);

        // Si l'erreur est liée aux droits ou aux quotas (401, 403, 429), inutile de boucler sur les autres modèles
        if (
          errStatus === 401 ||
          errStatus === 403 ||
          errStatus === 429 ||
          errStr.includes('429') ||
          errStr.includes('Resource exhausted') ||
          errStr.includes('rate_limit')
        ) {
          throw err;
        }

        console.warn(`[Groq Model Warning] Échec avec ${modelId}, tentative sur modèle de repli...`, err);
      }
    }

    throw lastError;
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    const status =
      (error as { status?: number; statusCode?: number } | undefined)?.status ??
      (error as { status?: number; statusCode?: number } | undefined)?.statusCode;

    console.error('[Groq Roleplay Error]:', {
      status,
      message: errMsg,
      cause: (error as Error)?.cause,
    });

    // Gestion du Rate-Limit OpenAI (429 / Insufficient quota)
    if (
      status === 429 ||
      errMsg.includes('429') ||
      errMsg.includes('RESOURCE_EXHAUSTED') ||
      errMsg.includes('Resource exhausted') ||
      errMsg.includes('rate_limit') ||
      errMsg.includes('insufficient_quota')
    ) {
      return new Response(JSON.stringify({
        error: 'RATE_LIMIT_EXCEEDED',
        message: "L'agent reprend son souffle ! Veuillez patienter quelques secondes avant d'envoyer votre prochain message.",
      }), { status: 429, headers: { 'Content-Type': 'application/json' } });
    }

    const isAuth =
      status === 401 ||
      status === 403 ||
      errMsg.includes('API key') ||
      errMsg.includes('invalid_api_key') ||
      errMsg.includes('authentication') ||
      errMsg.includes('credentials') ||
      errMsg.includes('Permission denied');

    if (isAuth || (status !== undefined && status >= 500)) {
      return new Response(JSON.stringify({
        error: 'AI_SERVICE_UNAVAILABLE',
        message: isAuth
          ? 'Configuration API en cours sur le serveur.'
          : 'Service IA temporairement indisponible. Veuillez réessayer dans un instant.'
      }), { status: 503, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({
      error: 'AI_ERROR',
      message: errMsg || 'Erreur lors de la génération de réponse.'
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
