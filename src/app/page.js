import HeroSection from "./components/sections/hero-section"
import ShowsSection from "./components/sections/show-selection"
// import { AboutSection } from '@/components/sections/about-section'
// import { TeamSection } from '@/components/sections/team-section'
// import { PerformanceImage } from '@/components/sections/performance-image'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ShowsSection/>
      {/* <PerformanceImage />
      <AboutSection />
      <TeamSection /> */}
    </>
  )
}