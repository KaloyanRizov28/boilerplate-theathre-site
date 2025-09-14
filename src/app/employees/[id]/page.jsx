import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

async function fetchEmployee(id) {
  const supabase = await createClient();
  const { data } = await supabase.from('employees').select('*').eq('id', id).single();
  return data;
}

async function fetchShows(employeeId) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('cast_members')
    .select('shows(id, title, image_URL, slug)')
    .eq('employeeId', employeeId);
  return data;
}

export default async function EmployeePage({ params }) {
  const { id } = await params;
  const employee = await fetchEmployee(id);
  const showsData = await fetchShows(id);

  const formattedDate = employee?.dateOfBirth
    ? new Date(employee.dateOfBirth).toLocaleDateString('bg-BG')
    : null;

  return (
    <main>
      <section className="bg-theater-dark px-16 py-16">
        <h1 className="text-white text-4xl sm:text-5xl font-light mb-2">{employee?.name}</h1>
        {employee?.role && <p className="text-gray-300 text-xl mb-2 capitalize">{employee.role}</p>}
        {formattedDate && <p className="text-gray-400 text-sm mb-8">{formattedDate}</p>}
        {employee?.bio && (
          <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-3xl">{employee.bio}</p>
        )}
      </section>

      <section className="bg-theater-dark px-16 pb-16">
        <h2 className="text-white text-2xl font-light mb-8">Участие в:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {showsData?.map(({ shows }) => (
            <div key={shows.id} className="bg-theater-grey rounded-lg overflow-hidden flex flex-col">
              {shows.image_URL && (
                <Image
                  src={shows.image_URL}
                  alt={shows.title}
                  width={300}
                  height={400}
                  className="w-full h-64 object-cover"
                />
              )}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-white text-lg mb-4">{shows.title}</h3>
                <div className="mt-auto">
                  <Link
                    href={`/repertoar/${shows.slug}`}
                    className="inline-block text-white border border-white px-4 py-2 rounded hover:bg-white hover:text-theater-dark transition-colors"
                  >
                    Билети
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {employee?.profile_picture_URL && (
        <section className="bg-theater-dark">
          <div className="relative w-full h-96">
            <Image
              src={employee.profile_picture_URL}
              alt={employee.name}
              fill
              className="object-cover"
            />
          </div>
        </section>
      )}
    </main>
  );
}
