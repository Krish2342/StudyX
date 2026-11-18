import type { SupabaseClient } from '@supabase/supabase-js'

export type AiTool = 'explain' | 'translate'

export interface AiRequest {
  tool: AiTool
  input: string
  sourceLanguage?: string
  targetLanguage?: string
}

export async function generateAiText(client: SupabaseClient, request: AiRequest): Promise<{ text: string; provider: string }> {
  const { data, error } = await client.functions.invoke<{ text?: string; provider?: string; error?: string }>('ai-generate', {
    body: request,
  })
  if (error) throw new Error(error.message)
  if (!data?.text || !data.provider) throw new Error(data?.error ?? 'The AI service returned no answer.')
  return { text: data.text, provider: data.provider }
}
