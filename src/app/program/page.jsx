import MonthlyProgramGuide from '@/features/program/components/monthly-program-guide'
import { getProgramShows } from '@/features/program/lib/get-program-shows'

export default async function ProgramPage() {
  const shows = await getProgramShows()

  return <MonthlyProgramGuide shows={shows} />
}
