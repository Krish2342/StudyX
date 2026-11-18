import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

/*
 * The browser Supabase client.
 *
 * `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are public values: they identify
 * the project, they do not grant access. Every table is protected by row-level
 * security, so a visitor who copies these keys still cannot read or write rows
 * their role does not allow.
 *
 * The service-role key is deliberately absent — it bypasses RLS and must only ever
 * exist inside server-side code.
 */

const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

/** True when both values are present, so the app may talk to the database. */
export const isSupabaseConfigured = Boolean(url && anonKey)

/**
 * The project host, e.g. `abcdefgh.supabase.co`.
 *
 * Public information (it is in the bundle anyway) — shown in the admin console
 * so the operator can confirm at a glance which project is connected.
 */
export const supabaseProjectHost = url ? url.replace(/^https?:\/\//, '').replace(/\/+$/, '') : null

/**
 * `null` until the project is configured. Callers must handle that instead of
 * crashing — the admin gate shows a setup state rather than a blank page.
 */
export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : null
