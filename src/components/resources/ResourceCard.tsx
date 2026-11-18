import { Bookmark, ExternalLink, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ResourceRecord } from '@/services/resourceService'

export function ResourceCard({
  resource,
  onBookmark,
}: {
  resource: ResourceRecord
  onBookmark: (resource: ResourceRecord) => void
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card border border-white/8 bg-ink-raised transition-colors hover:border-sky/40">
      <div className="flex h-36 items-end justify-between bg-linear-to-br from-sky-wash to-ink-raised-2 p-4">
        <span className="rounded-full border border-sky/30 bg-ink/60 px-3 py-1 text-[11px] font-semibold text-sky">
          {resource.resource_type}
        </span>
        <button
          type="button"
          onClick={() => onBookmark(resource)}
          aria-label={resource.is_bookmarked ? 'Remove from saved resources' : 'Save resource'}
          className="grid size-9 place-items-center rounded-full border border-white/10 bg-ink/60 text-paper-dim transition-colors hover:border-sky/50 hover:text-sky"
        >
          <Bookmark className={`size-4 ${resource.is_bookmarked ? 'fill-sky text-sky' : ''}`} aria-hidden="true" />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h2 className="line-clamp-2 font-display text-lg font-semibold text-paper">{resource.title}</h2>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-paper-dim">
          {resource.description || 'Academic resource shared with the StudyX community.'}
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-paper-faint">
          <span>{resource.college?.name ?? 'College'}</span>
          <span aria-hidden="true">Ãƒâ€šÃ‚Â·</span>
          <span>{resource.subject?.name ?? 'Subject'}</span>
          <span aria-hidden="true">Ãƒâ€šÃ‚Â·</span>
          <span>{resource.semester?.label ?? 'Semester'}</span>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="inline-flex items-center gap-1 text-xs text-paper-dim">
            <Star className="size-3.5 fill-sky text-sky" aria-hidden="true" />
            {resource.rating ? resource.rating.toFixed(1) : 'New'}
          </span>
          <Link
            to={`/app/explore/${resource.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky hover:text-sky-bright"
          >
            View resource <ExternalLink className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}
