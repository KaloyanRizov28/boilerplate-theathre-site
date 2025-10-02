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
      console.log(perf.time)
      const dt = new Date(perf.time);
      const sofiaTz = 'Europe/Sofia';
      const date = dt.toLocaleString('bg-BG', {
        day: '2-digit',
        month: '2-digit',
        timeZone: sofiaTz,
      });
      const time = dt.toLocaleTimeString('bg-BG', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: sofiaTz,
      });
      return { ...show, performances, date, time, venue: perf.venue };
    }) ?? []
  );
}



export default async function ProgramPage() {
  const dataShows = await getShowsWithPerformances();
  return <MonthlyProgramGuide shows={dataShows} />
}
