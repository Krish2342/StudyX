import { useState } from 'react'
import { Sparkles, Languages } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Textarea } from '@/components/ui/Input'
import { useAuth } from '@/features/auth/useAuth'
import { generateAiText, type AiTool } from '@/services/aiService'
import { supabase } from '@/lib/supabase'

export function AiTools() {
  const { user } = useAuth()
  const [tool, setTool] = useState<AiTool>('explain')
  const [input, setInput] = useState('')
  const [sourceLanguage, setSourceLanguage] = useState('English')
  const [targetLanguage, setTargetLanguage] = useState('Hindi')
  const [answer, setAnswer] = useState('')
  const [provider, setProvider] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit() {
    if (!supabase || !user) {
      setError('Sign in is required before using AI tools.')
      return
    }
    setBusy(true)
    setError(null)
    setAnswer('')
    try {
      const result = await generateAiText(supabase, { tool, input, sourceLanguage, targetLanguage })
      setAnswer(result.text)
      setProvider(result.provider)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to generate an answer.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8">
      <header>
        <p className="text-xs font-semibold tracking-[0.16em] text-sky uppercase">AI study tools</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-paper sm:text-4xl">Understand more, faster</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-paper-dim">Use a focused explanation or translation. Requests are authenticated, rate-limited, and stored privately in your AI history.</p>
      </header>
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card interactive={false} className="p-6">
          <div className="flex gap-2">
            <Button variant={tool === 'explain' ? 'primary' : 'secondary'} icon={<Sparkles className="size-4" />} onClick={() => setTool('explain')}>Explain</Button>
            <Button variant={tool === 'translate' ? 'primary' : 'secondary'} icon={<Languages className="size-4" />} onClick={() => setTool('translate')}>Translate</Button>
          </div>
          <div className="mt-6 grid gap-4">
            {tool === 'translate' && <div className="grid grid-cols-2 gap-3"><label className="text-sm text-paper">From<select value={sourceLanguage} onChange={(event) => setSourceLanguage(event.target.value)} className="mt-1 h-11 w-full rounded-control border border-white/12 bg-white/4 px-3 text-paper"><option>English</option><option>Hindi</option><option>Gujarati</option><option>Marathi</option><option>Bengali</option></select></label><label className="text-sm text-paper">To<select value={targetLanguage} onChange={(event) => setTargetLanguage(event.target.value)} className="mt-1 h-11 w-full rounded-control border border-white/12 bg-white/4 px-3 text-paper"><option>Hindi</option><option>English</option><option>Gujarati</option><option>Marathi</option><option>Bengali</option></select></label></div>}
            <Textarea label={tool === 'explain' ? 'What should StudyX explain?' : 'Text to translate'} value={input} onChange={(event) => setInput(event.target.value)} maxLength={4000} placeholder={tool === 'explain' ? 'Example: Explain binary search trees with a simple example.' : 'Paste the text you want translated.'} />
            <p className="text-xs text-paper-faint">{input.length}/4000 characters Ã‚Â· 20 requests per day</p>
            <Button onClick={() => void submit()} disabled={busy || input.trim().length < 3}>{busy ? 'Working securely...' : tool === 'explain' ? 'Explain this topic' : 'Translate text'}</Button>
            {error && <p className="text-sm text-sky" role="alert">{error}</p>}
          </div>
        </Card>
        <Card interactive={false} className="min-h-72 p-6">
          <div className="flex items-center justify-between gap-3"><h2 className="font-display text-xl font-semibold text-paper">Your answer</h2>{provider && <span className="text-xs text-paper-faint">Provider: {provider}</span>}</div>
          {answer ? <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-paper-dim">{answer}</p> : <p className="mt-5 text-sm leading-6 text-paper-faint">Your result will appear here after a successful request.</p>}
        </Card>
      </div>
    </div>
  )
}
