const configuredOrigin = Deno.env.get('APP_ORIGIN')?.trim()

export const corsHeaders = {
  'Access-Control-Allow-Origin': configuredOrigin ?? 'null',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
}

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders })
}
