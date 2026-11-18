import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const requiredFiles = [
  'vercel.json',
  'index.html',
  'public/robots.txt',
  'public/sitemap.xml',
  'public/favicon.svg',
  'src/main.tsx',
  'supabase/migrations/20261117220000_admin_controls_and_analytics.sql',
]

const failures = []

for (const relativePath of requiredFiles) {
  if (!existsSync(resolve(root, relativePath))) failures.push(`Missing required file: ${relativePath}`)
}

const index = readFileSync(resolve(root, 'index.html'), 'utf8')
for (const marker of ['<title>', 'name="description"', 'rel="canonical"', 'property="og:image"']) {
  if (!index.includes(marker)) failures.push(`Missing metadata marker in index.html: ${marker}`)
}

const vercel = readFileSync(resolve(root, 'vercel.json'), 'utf8')
if (!vercel.includes('"destination": "/index.html"')) failures.push('SPA rewrite to /index.html is missing')

const main = readFileSync(resolve(root, 'src/main.tsx'), 'utf8')
if (!main.includes('reducedMotion="user"')) failures.push('Motion reduced-motion configuration is missing')

const trackedFiles = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean)
for (const relativePath of trackedFiles) {
  if (/^\.env(?:\..*)?$/.test(relativePath) && relativePath !== '.env.example') {
    failures.push(`Environment file is tracked: ${relativePath}`)
  }
}

function readFiles(directory) {
  if (!existsSync(directory)) return []
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name)
    return entry.isDirectory() ? readFiles(path) : [readFileSync(path, 'utf8')]
  })
}

const builtAssets = readFiles(resolve(root, 'dist')).join('\n')
if (/GEMINI_API_KEY|GROQ_API_KEY|SUPABASE_SERVICE_ROLE_KEY/.test(builtAssets)) {
  failures.push('Server-only secret name found in dist output')
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'))
  process.exitCode = 1
} else {
  console.log('Quality checks passed: deployment files, metadata, reduced motion, and secret exclusions.')
}
