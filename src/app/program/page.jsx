import MonthlyProgramGuide from "@/components/calendarPage/program"
import { createClient } from "../../../lib/supabase/server";
async function getShowsWithPerformances({ page = 1, pageSize = 50 } = {}) {
  const supabase = await createClient();
  const now = new Date().toISOString();
  const start = (Math.max(page, 1) - 1) * pageSize;
  const end = start + pageSize - 1;

  const { data, error, count } = await supabase
    .from('performances')
    .select(`
      id,
      time,
      venue,
      shows:shows (
        id,
        title,
        author,
        slug,
        image_URL,
        poster_URL,
        category
      )
    `, { count: 'exact' })
    .gte('time', now)
    .order('time', { ascending: true })
    .range(start, end);

  if (error) {
    console.error('Error fetching performances', error);
    return { shows: [], pagination: { page, pageSize, total: 0 } };
  }

  const showsMap = new Map();

  (data ?? []).forEach(({ id, time, venue, shows }) => {
    if (!shows) return;

    const existing = showsMap.get(shows.id);
    if (!existing) {
      showsMap.set(shows.id, {
        id: shows.id,
        title: shows.title,
        author: shows.author,
        slug: shows.slug,
        image_URL: shows.image_URL,
        poster_URL: shows.poster_URL,
        category: shows.category,
        performances: [],
      });
    }

    const dt = time ? new Date(time) : null;
    const dateDisplay = dt && !Number.isNaN(dt.getTime())
      ? dt.toLocaleDateString('bg-BG', { day: '2-digit', month: '2-digit', timeZone: 'UTC' })
      : '';
    const timeDisplay = dt && !Number.isNaN(dt.getTime())
      ? dt.toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })
      : '';

    showsMap.get(shows.id).performances.push({
      id,
      time,
      dateDisplay,
      timeDisplay,
      venue: venue ?? '',
    });
  });

  const shows = Array.from(showsMap.values()).map((show) => ({
    ...show,
    performances: show.performances.sort((a, b) => new Date(a.time) - new Date(b.time)),
  }));

  return {
    shows,
    pagination: {
      page,
      pageSize,
      total: count ?? shows.length,
    },
  };
}



export default async function ProgramPage({ searchParams }) {
  const rawPage = Number(searchParams?.page ?? 1);
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
  const { shows: dataShows } = await getShowsWithPerformances({ page });
  return <MonthlyProgramGuide shows={dataShows} />
}
