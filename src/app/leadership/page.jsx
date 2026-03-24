import TeamAccordionClient from '@/features/team/components/team-accordion-client'
import { getTeamGroups } from '@/features/team/lib/get-team-groups'

export const metadata = {
  title: 'Състав',
}

export default async function TeamPage() {
  const { creative, technical, administrative } = await getTeamGroups()

  return (
    <main className="bg-theater-dark text-white">
      <section className="px-6 py-14 sm:py-18 md:py-20">
        <div className="mx-auto max-w-6xl space-y-5">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light">Състав</h1>
          <p className="text-gray-300 max-w-2xl text-base sm:text-lg">
            Изберете категория, за да видите хората в нея. Клик върху реда отваря списъка с профили.
          </p>
        </div>
      </section>

      <TeamAccordionClient creative={creative} technical={technical} administrative={administrative} />
    </main>
  )
}
