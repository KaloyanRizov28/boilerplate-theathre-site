
import HeroSection from "../components/homePage/hero-section";
import ShowsSection from "../components/homePage/show-selection";
import AboutTheaterSection from "@/components/homePage/about-theathre";
import CastSection from "../components/homePage/cast-section";
import { createClient } from "../../lib/supabase/server";

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const supabase = await createClient();

  const { data: showsData } = await supabase.from("shows").select("*").limit(6);

  const { data: castMembersData } = await supabase
    .from("employees")
    .select("id, name, role, profile_picture_URL")
    .order("id")
    .limit(8);

  // Fetch upcoming performances with their associated show to power a dynamic hero
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

  // Deduplicate by play (slug/href) so we never show the same play twice in a row due to data ordering
  const seen = new Set()
  const uniqueByPlay = []
  for (const h of heroCandidates) {
    const key = h.href && h.href.startsWith('/repertoar/') ? h.href : (h.title || h.image)
    if (seen.has(key)) continue
    seen.add(key)
    uniqueByPlay.push(h)
  }

  const heroItems = uniqueByPlay.slice(0, 8)

  return (
    <>
      <HeroSection items={heroItems} />
      <ShowsSection shows={showsData ?? []} />
      <AboutTheaterSection />
      <CastSection castMembers={castMembersData ?? []} />
    </>
  );
}
