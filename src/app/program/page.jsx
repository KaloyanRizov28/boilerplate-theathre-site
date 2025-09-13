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
        time,
        venues(name)
      )
    `);

  if (error) {
    console.error('Error fetching shows with performances:', error);
    return null;
  }

  console.log('Shows and their performance times:', data);
  return data;
}



export default async function ProgramPage() {

  let dataShows = await getShowsWithPerformances();

  return (
    <MonthlyProgramGuide shows={dataShows} />
  )

}