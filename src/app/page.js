
import HeroSection from "../components/homePage/hero-section";
import ShowsSection from "../components/homePage/show-selection";
import AboutTheaterSection from "@/components/homePage/about-theathre";
import CastSection from "../components/homePage/cast-section";
import { createClient } from "../../lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: showsData } = await supabase.from("shows").select("*").limit(6);

  const { data: castMembersData } = await supabase
    .from("employees")
    .select("id, name, role, profile_picture_URL")
    .order("id")
    .limit(8);

  return (
    <>
      <HeroSection />
      <ShowsSection shows={showsData ?? []} />
      <AboutTheaterSection />
      <CastSection castMembers={castMembersData ?? []} />
    </>
  );
}