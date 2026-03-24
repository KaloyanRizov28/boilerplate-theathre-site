
import HeroSection from "../components/homePage/hero-section";
import ShowsSection from "../components/homePage/show-selection";
import AboutTheaterSection from "@/components/homePage/about-theathre";
import CastSection from "../components/homePage/cast-section";
import { createClient } from '@/services/supabase/server';

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const supabase = await createClient();

  // 1. Fetch Configuration
  const { data: configData } = await supabase.from('content_config').select('*');
  const heroConfig = configData?.find(c => c.key === 'home_hero')?.value || {};
  const showsConfig = configData?.find(c => c.key === 'home_shows')?.value || {};

  // 2. Fetch Shows
  let showsData = [];
  if (showsConfig.mode === 'manual' && showsConfig.selection?.length > 0) {
    const { data } = await supabase
      .from('shows')
      .select('*')
      .in('id', showsConfig.selection);

    if (data) {
      // Maintain selection order
      const showMap = new Map(data.map(s => [s.id, s]));
      showsData = showsConfig.selection
        .map(id => showMap.get(id))
        .filter(Boolean);
    }
  } else {
    const { data } = await supabase.from("shows").select("*").limit(6);
    showsData = data;
  }

  // 3. Fetch Cast
  const { data: castMembersData } = await supabase
    .from("employees")
    .select("id, name, role, profile_picture_URL")
    .order("id")
    .limit(8);

  // 4. Hero Logic
  let heroItems = [];
  if (heroConfig.mode === 'manual' && heroConfig.items?.length > 0) {
    heroItems = heroConfig.items.map(item => ({
      title: item.title,
      href: item.link || '#',
      date: item.subtitle || '',
      image: item.image,
      time: '',
      venue: ''
    }));
  } else {
    // Existing Logic: Fetch upcoming performances
    const nowIso = new Date().toISOString();
    const { data: perfData } = await supabase
      .from('performances')
      .select('id, time, venue, shows(title, slug, image_URL, poster_URL)')
      .gte('time', nowIso)
      .order('time', { ascending: true })
      .limit(12);

    const heroCandidates = (perfData || []).map((p) => {
      const dt = new Date(p.time)
      const date = dt.toLocaleDateString('bg-BG', { day: '2-digit', month: '2-digit', timeZone: 'Europe/Sofia' })
      const time = dt.toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Sofia' })
      return {
        title: p.shows?.title || 'Представление',
        href: p.shows?.slug ? `/repertoar/${p.shows.slug}` : '#',
        venue: p.venue || '',
        date,
        time,
        image: p.shows?.image_URL || p.shows?.poster_URL || '/hero.jpg',
      }
    }).filter((h) => h.title && h.image)

    // Deduplicate
    const seen = new Set()
    const uniqueByPlay = []
    for (const h of heroCandidates) {
      const key = h.href && h.href.startsWith('/repertoar/') ? h.href : (h.title || h.image)
      if (seen.has(key)) continue
      seen.add(key)
      uniqueByPlay.push(h)
    }
    heroItems = uniqueByPlay.slice(0, 8)
  }

  return (
    <>
      <HeroSection items={heroItems} />
      <ShowsSection shows={showsData ?? []} />
      <AboutTheaterSection />
      <CastSection castMembers={castMembersData ?? []} />
    </>
  );
}
