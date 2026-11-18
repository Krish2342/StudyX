import { useState } from 'react'
import type { FormEvent } from 'react'
import { LogOut, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useAuth } from '@/features/auth/useAuth'
import { supabase } from '@/lib/supabase'
import { updateProfile } from '@/services/profileService'

export function Settings() {
  const { user, profile, refreshProfile, signOut } = useAuth()
  const [language, setLanguage] = useState(profile?.preferred_language || 'English')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function save(event: FormEvent) {
    event.preventDefault()
    if (!supabase || !user || !profile) return
    setSaving(true)
    setMessage(null)
    try {
      await updateProfile(supabase, user.id, {
        full_name: profile.full_name || user.user_metadata.name || 'Student',
        college_id: profile.college_id || '',
        branch_id: profile.branch_id || '',
        semester_id: profile.semester_id || '',
        preferred_language: language as 'English' | 'Hindi' | 'Gujarati',
      })
      await refreshProfile()
      setMessage('Your preference was saved.')
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : 'Unable to save settings.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs font-semibold tracking-[0.16em] text-sky uppercase">Account</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-paper sm:text-4xl">Settings</h1>
      <p className="mt-2 text-sm leading-6 text-paper-dim">Manage account preferences and session access.</p>
      <Card interactive={false} className="mt-6 p-6 sm:p-8">
        <form onSubmit={(event) => void save(event)} className="grid gap-5">
          <label className="flex flex-col gap-1.5 text-sm font-medium text-paper">Preferred language
            <select value={language} onChange={(event) => setLanguage(event.target.value)} className="h-11 rounded-control border border-white/12 bg-ink-raised-2 px-3.5 text-sm text-paper focus:border-sky/70 focus:outline-none">
              <option>English</option><option>Hindi</option><option>Gujarati</option>
            </select>
          </label>
          {message && <p className="text-sm text-sky" role="status">{message}</p>}
          <div className="flex justify-end"><Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save preference'}</Button></div>
        </form>
      </Card>
      <Card interactive={false} className="mt-4 p-6 sm:p-8">
        <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 size-5 text-sky" /><div><h2 className="font-display text-lg font-semibold text-paper">Account session</h2><p className="mt-1 text-sm text-paper-dim">Sign out from this browser when you finish your study session.</p></div></div>
        <div className="mt-5 flex justify-end"><Button variant="secondary" icon={<LogOut className="size-4" />} onClick={() => void signOut().then(() => window.location.assign('/login'))}>Sign out</Button></div>
      </Card>
    </div>
  )
}
