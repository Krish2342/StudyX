import { createClient } from 'npm:@supabase/supabase-js@2.49.1'
import { corsHeaders, jsonResponse } from '../_shared/cors.ts'
import { generateText } from '../_shared/providers.ts'

const maxInputCharacters = 4_000
const maxRequestsPerDay = 20
const allowedTools = new Set(['explain', 'translate'])

function cleanText(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return jsonResponse({ error: 'METHOD_NOT_ALLOWED' }, 405)

  const authorization = request.headers.get('Authorization')
  if (!authorization?.startsWith('Bearer ')) return jsonResponse({ error: 'AUTH_REQUIRED' }, 401)

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !anonKey || !serviceRoleKey) return jsonResponse({ error: 'FUNCTION_NOT_CONFIGURED' }, 500)

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const { data: userData, error: userError } = await userClient.auth.getUser()
  if (userError || !userData.user) return jsonResponse({ error: 'AUTH_REQUIRED' }, 401)

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  let payload: { tool?: unknown; input?: unknown; sourceLanguage?: unknown; targetLanguage?: unknown }
  try {
    payload = await request.json()
  } catch {
    return jsonResponse({ error: 'INVALID_JSON' }, 400)
  }

  const tool = cleanText(payload.tool, 30)
  const input = cleanText(payload.input, maxInputCharacters)
  const sourceLanguage = cleanText(payload.sourceLanguage, 40)
  const targetLanguage = cleanText(payload.targetLanguage, 40)
  if (!allowedTools.has(tool) || input.length < 3 || input.length > maxInputCharacters) {
    return jsonResponse({ error: 'INVALID_INPUT' }, 400)
  }
  if (tool === 'translate' && (!sourceLanguage || !targetLanguage || sourceLanguage === targetLanguage)) {
    return jsonResponse({ error: 'INVALID_LANGUAGES' }, 400)
  }

  const { error: usageError } = await userClient.rpc('consume_ai_request', {
    requested_characters: input.length,
    max_requests: maxRequestsPerDay,
    max_input_characters: maxInputCharacters,
  })
  if (usageError) {
    const status = usageError.message.includes('limit') ? 429 : 400
    return jsonResponse({ error: status === 429 ? 'DAILY_LIMIT_REACHED' : 'USAGE_NOT_AVAILABLE' }, status)
  }

  const prompt = tool === 'translate'
    ? `Translate the following student text from ${sourceLanguage} to ${targetLanguage}. Preserve meaning and formatting. Return only the translation.\n\n${input}`
    : `Explain the following academic topic to a college student. Use a short definition, intuitive explanation, one example, and three key takeaways. Do not invent citations. Return plain text with clear headings.\n\n${input}`

  try {
    const result = await generateText(prompt)
    const { error: historyError } = await adminClient.from('ai_history').insert({
      user_id: userData.user.id,
      tool,
      input_text: input,
      output_text: result.text,
      source_language: sourceLanguage || null,
      target_language: targetLanguage || null,
      provider: result.provider,
      status: 'completed',
    })
    if (historyError) return jsonResponse({ error: 'HISTORY_WRITE_FAILED' }, 500)
    return jsonResponse({ text: result.text, provider: result.provider })
  } catch {
    await adminClient.from('ai_history').insert({
      user_id: userData.user.id,
      tool,
      input_text: input,
      output_text: null,
      source_language: sourceLanguage || null,
      target_language: targetLanguage || null,
      provider: null,
      status: 'failed',
      error_code: 'PROVIDER_UNAVAILABLE',
    })
    return jsonResponse({ error: 'PROVIDER_UNAVAILABLE' }, 503)
  }
})
