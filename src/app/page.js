import HeroSection from "./components/sections/hero-section"
import ShowsSection from "./components/sections/show-selection"
import AboutTheaterSection from "./components/sections/about-theathre"
import CastSection from "./components/sections/cast-section"

// import { PerformanceImage } from '@/components/sections/performance-image'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ShowsSection/>
      <AboutTheaterSection/>
      <CastSection/>
    </>
  )
}