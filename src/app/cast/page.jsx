import TeamAccordionClient from '@/features/team/components/team-accordion-client'
import { getTeamGroups } from '@/features/team/lib/get-team-groups'

export const metadata = {
  title: 'Състав',
}

export default async function CastPage() {
  const { creative, technical, administrative } = await getTeamGroups()

  return (
    <main className="bg-theater-dark text-white">
      <section className="px-4 sm:px-8 py-8 sm:py-16">
        <div className="max-w-[1474px] mx-auto w-full">
          <TeamAccordionClient creative={creative} technical={technical} administrative={administrative} />
        </div>
      </section>
    </main>
  )
}
