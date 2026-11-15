import { AiShowcase } from '@/components/landing/AiShowcase'
import { BentoFeatures } from '@/components/landing/BentoFeatures'
import { FinalCta } from '@/components/landing/FinalCta'
import { Footer } from '@/components/landing/Footer'
import { Hero } from '@/components/landing/Hero'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { Navbar } from '@/components/landing/Navbar'
import { ResourceShowcase } from '@/components/landing/ResourceShowcase'

/**
 * Public landing page.
 * Sections are split into their own files so no single file grows past ~200 lines.
 */
export function Landing() {
  return (
    <div className="min-h-dvh bg-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-sky focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink"
      >
        Skip to content
      </a>

      <Navbar />

      <main id="main">
        <Hero />
        <AiShowcase />
        <ResourceShowcase />
        <BentoFeatures />
        <HowItWorks />
        <FinalCta />
      </main>

      <Footer />
    </div>
  )
}
