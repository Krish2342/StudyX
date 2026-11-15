import { motion } from 'motion/react'
import { SocialIcon } from '@/components/ui/SocialIcons'
import { socialLinks } from '@/data/socialLinks'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * The footer's social row.
 *
 * Reads `src/data/socialLinks.ts` so the whole list is edited in one place.
 * Entries with an empty url are skipped, which means a profile that does not
 * exist yet can never ship as a link that goes nowhere.
 *
 * Every target is 44px (size-11) for touch, opens in a new tab with
 * rel="noopener noreferrer", and has a focus-visible ring for keyboard users.
 */
export function FooterSocialLinks() {
  const reduced = useReducedMotion()
  const links = socialLinks.filter((link) => link.url.trim().length > 0)

  return (
    <ul className="flex flex-wrap gap-2">
      {links.map((link) => (
        <li key={link.name}>
          <motion.a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`StudyX on ${link.name}`}
            whileHover={reduced ? undefined : { y: -2, scale: 1.06 }}
            whileTap={reduced ? undefined : { scale: 0.94, y: 0 }}
            transition={{ type: 'spring', stiffness: 480, damping: 26 }}
            className="grid size-11 place-items-center rounded-lg border border-white/10 text-paper-faint transition-colors duration-150 hover:border-sky/40 hover:bg-sky-wash hover:text-sky focus-visible:outline-2 focus-visible:outline-sky focus-visible:outline-offset-2"
          >
            <SocialIcon name={link.icon} />
          </motion.a>
        </li>
      ))}
    </ul>
  )
}
