import MonthlyProgramGuide from "@/components/calendarPage/program"
import { createClient } from "../../../lib/supabase/server";


async function getShowsWithPerformances() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('shows')
    .select(`
      id,
      title,
      author,
      slug,
      image_URL,
      poster_URL,
      category,
      performances!inner (
        id,
        time,
        venue
      )
    `);
  if (error) {
    
    return [];
  }

  return (
    data?.map(({ performances, ...show }) => {
      const perf = performances?.[0];
      if (!perf) return { ...show, performances };
      const dt = new Date(perf.time);

      const date = `${dt.getUTCDate().toString().padStart(2, '0')}.${(dt.getUTCMonth() + 1)
        .toString()
        .padStart(2, '0')}`;
      const time = `${dt.getUTCHours().toString().padStart(2, '0')}:${dt.getUTCMinutes()
        .toString()
        .padStart(2, '0')}`;
      return { ...show, performances, date, time, venue: perf.venue };
    }) ?? []
  );
}



export default async function ProgramPage() {
  const dataShows = await getShowsWithPerformances();
  return <MonthlyProgramGuide shows={dataShows} />
}
