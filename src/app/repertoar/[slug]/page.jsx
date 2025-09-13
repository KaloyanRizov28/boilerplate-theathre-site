import PlayPresentation from "@/components/playsIndividual/playPresentation";
import { createClient } from "../../../../lib/supabase/server";
import ActorFilterWithData from "@/components/playsIndividual/employeesIndividual";
import FullScreenWidthImage from "@/components/playsIndividual/imageFull";
async function fetchShow(slug) {
  
  const supabase = await createClient();
  const { data: show, error } = await supabase.from("shows").select("*").eq("slug", slug);
  return show
  }

async function fetchEmployees(showId) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('cast_members') // Start by querying the cast_members table
      .select('employees(id, name, role)') // Select the 'employees' relationship and specify desired columns
      .eq('idShow', showId)
      return data;
}

export default async function SinglePlayPage({ params }) {
  const { slug } = await params;
  // 
  let show = await fetchShow(slug);
  console.log(show);
  let employees = await fetchEmployees(show[0].id)
  return (
    <main> {/* Or your main layout component */}
      <PlayPresentation
        playName={show[0].title}
        backgroundImage={show[0].image_URL}
        
        synopsis={show[0].information}
        ticketLink={show[0].slug}
      />
      <ActorFilterWithData
      employees={employees}
      />
      <FullScreenWidthImage
      src={show[0].picture_personalURL}
      />
    </main>
  );
}