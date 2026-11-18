type ProviderResult = { provider: string; text: string }

const providerTimeoutMs = 20_000

async function requestWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), providerTimeoutMs)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timeout)
  }
}

async function callGemini(prompt: string): Promise<ProviderResult> {
  const key = Deno.env.get('GEMINI_API_KEY')
  if (!key) throw new Error('GEMINI_NOT_CONFIGURED')
  const response = await requestWithTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(key)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    },
  )
  if (!response.ok) throw new Error(`GEMINI_HTTP_${response.status}`)
  const payload = await response.json()
  const text = payload.candidates?.[0]?.content?.parts?.[0]?.text
  if (typeof text !== 'string' || !text.trim()) throw new Error('GEMINI_EMPTY_RESPONSE')
  return { provider: 'gemini', text: text.trim() }
}

async function callGroq(prompt: string): Promise<ProviderResult> {
  const key = Deno.env.get('GROQ_API_KEY')
  if (!key) throw new Error('GROQ_NOT_CONFIGURED')
  const response = await requestWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: Deno.env.get('GROQ_MODEL') ?? 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 1200,
    }),
  })
  if (!response.ok) throw new Error(`GROQ_HTTP_${response.status}`)
  const payload = await response.json()
  const text = payload.choices?.[0]?.message?.content
  if (typeof text !== 'string' || !text.trim()) throw new Error('GROQ_EMPTY_RESPONSE')
  return { provider: 'groq', text: text.trim() }
}

export async function generateText(prompt: string): Promise<ProviderResult> {
  const errors: string[] = []
  for (const provider of [callGemini, callGroq]) {
    try {
      return await provider(prompt)
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'PROVIDER_FAILED')
    }
  }
  throw new Error(errors.join(','))
}
