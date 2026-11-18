/// <reference types="vite/client" />

/**
 * Environment variables the browser is allowed to see.
 *
 * Both are public by design (Supabase hands them to every client). Anything
 * secret belongs in server-side storage — not in a VITE_ variable.
 */
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
