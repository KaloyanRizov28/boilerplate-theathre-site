import AboutTheaterSection from '@/features/home/components/about-theater-section'
import CastSection from '@/features/home/components/cast-section'
import HeroSection from '@/features/home/components/hero-section'
import ShowsSection from '@/features/home/components/show-selection'
import { getHomePageData } from '@/features/home/lib/get-home-page-data'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const { heroItems, shows, castMembers } = await getHomePageData()

  return (
    <>
      <HeroSection items={heroItems} />
      <ShowsSection shows={shows} />
      <AboutTheaterSection />
      <CastSection castMembers={castMembers} />
    </>
  )
}
