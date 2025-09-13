
import HeroSection from "../components/homePage/hero-section";
import ShowsSection from "../components/homePage/show-selection"; 
import AboutTheaterSection from "@/components/homePage/about-theathre";
import CastSection from "../components/homePage/cast-section";
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