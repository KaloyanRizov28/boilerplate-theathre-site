
import HeroSection from "../components/sections/hero-section";
import ShowsSection from "../components/sections/show-selection"; // Corrected typo: show-selection -> ShowsSection
import AboutTheaterSection from "../components/sections/about-theathre"; // Corrected typo: about-theathre -> AboutTheaterSection
import CastSection from "../components/sections/cast-section";
import { createClient } from "../../lib/supabase/server";


async function fetchShows() {
  
  const supabase = await createClient();
  const { data: shows, error } = await supabase.from("shows").select("*");
  return shows
  
}

export default async function HomePage() {
   let dataShows = await fetchShows()

  return (
    <>
      <HeroSection/>
      <ShowsSection shows={dataShows}/>
      <AboutTheaterSection/>
      <CastSection/>
    </>
  );
}