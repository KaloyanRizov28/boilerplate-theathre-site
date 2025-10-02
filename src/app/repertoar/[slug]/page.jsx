import PlayPresentation from "@/components/playsIndividual/playPresentation";
import { createClient } from "../../../../lib/supabase/server";
import ActorFilterWithData from "@/components/playsIndividual/employeesIndividual";
import FullScreenWidthImage from "@/components/playsIndividual/imageFull";
import { notFound } from 'next/navigation'
async function fetchShow(slug) {
  
  const supabase = await createClient();
  const { data: show, error } = await supabase.from("shows").select("*").eq("slug", slug);
  return show
  }

async function fetchEmployees(showId) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('cast_members') // Start by querying the cast_members table
      .select('employees(id, name, role, profile_picture_URL)') // Select the 'employees' relationship and specify desired columns
      .eq('idShow', showId)
      return data;
}

export default async function SinglePlayPage({ params }) {
  const { slug } = await params;
  // 
  let show = await fetchShow(slug);
  const showRecord = show?.[0]

  if (!showRecord) {
    notFound()
  }

  const cleanSlug = showRecord.slug ? showRecord.slug.replace(/^[-]+/, '') : null
  const ticketLink = cleanSlug ? `https://www.entase.com/kalo/productions/${cleanSlug}?lc=bg` : null
  let employees = await fetchEmployees(showRecord.id)
  return (
    <main> {/* Or your main layout component */}
      <PlayPresentation
        playName={showRecord.title}
        backgroundImage={showRecord.image_URL}
        
        synopsis={showRecord.information}
        ticketLink={ticketLink}
      />
      <ActorFilterWithData
      employees={employees}
      />
    </main>
  );
}
