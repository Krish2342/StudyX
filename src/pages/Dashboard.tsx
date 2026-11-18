import { ActivityCard } from '@/components/dashboard/ActivityCard'
import { AiToolsCard } from '@/components/dashboard/AiToolsCard'
import { ContinueCard } from '@/components/dashboard/ContinueCard'
import { GreetingCard } from '@/components/dashboard/GreetingCard'
import { QuickActionsCard } from '@/components/dashboard/QuickActionsCard'
import { RequestsCard } from '@/components/dashboard/RequestsCard'
import { ResourceListCard } from '@/components/dashboard/ResourceListCard'
import { GlobalSearch } from '@/components/layout/GlobalSearch'

/**
 * Student dashboard — a real bento grid.
 * Cards span different widths on lg so the layout never reads as identical boxes:
 *
 *   [ Greeting (3) ] [ Quick actions (2) ]
 *   [ Continue (2) ] [ AI tools (2) ]
 *   [ Recent (3)    ] [ Popular (3) ]
 *   [ Requests (2)  ] [ Activity (4) ]
 */
export function Dashboard() {

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* Mobile-first search: full width on small screens */}
      <div className="mb-5 lg:hidden">
        <GlobalSearch />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
        <GreetingCard />
        <QuickActionsCard className="lg:col-span-2" />

        <ContinueCard />
        <AiToolsCard />

        <ResourceListCard
          className="lg:col-span-3"
          title="Recently added"
          actionLabel="Explore"
          actionTo="/app/explore"
          resources={[]}
        />
        <ResourceListCard
          className="lg:col-span-3"
          title="Popular this week"
          actionLabel="See all"
          actionTo="/app/explore"
          resources={[]}
        />

        <RequestsCard className="lg:col-span-2" />
        <ActivityCard className="lg:col-span-4" />
      </div>
    </div>
  )
}
