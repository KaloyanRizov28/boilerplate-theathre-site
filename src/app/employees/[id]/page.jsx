import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '../../../../lib/supabase/server';

async function fetchEmployee(id) {
  const supabase = await createClient();
  const { data } = await supabase.from('employees').select('*').eq('id', id).single();
  return data;
}

async function fetchShows(employeeId) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('cast_members')
    .select('shows(id, title, image_URL, poster_URL, slug)')
    .eq('employeeId', employeeId);
  return data || [];
}

function initials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || '';
  const last = parts[parts.length - 1]?.[0] || '';
  return (first + last).toUpperCase();
}

export default async function EmployeePage({ params }) {
  const { id } = params;
  const employee = await fetchEmployee(id);
  const casts = await fetchShows(id);

  const formattedDate = employee?.dateOfBirth
    ? new Date(employee.dateOfBirth).toLocaleDateString('bg-BG')
    : null;

  // Deduplicate shows by ID in case of multiple cast records
  const showsMap = new Map();
  for (const row of casts) {
    const s = row?.shows;
    if (s?.id && !showsMap.has(s.id)) showsMap.set(s.id, s);
  }
  const shows = Array.from(showsMap.values());

  return (
    <main className="bg-theater-dark text-white">
      {/* Header: text (left) | image (right) */}
      <section className="px-6 pt-10 pb-12 sm:pt-14">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-start gap-8">
          {/* Content (left) */}
          <div className="flex-1 min-w-0">
            <div>
              <Link href="/cast" className="inline-flex items-center gap-2 text-gray-300 hover:text-[#27AAE1] transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10.828 12l4.95 4.95-1.414 1.414L8 12l6.364-6.364 1.414 1.414z"/></svg>
                <span className="border-b border-transparent hover:border-[#27AAE1]">Назад към състав</span>
              </Link>
            </div>
            <h1 className="text-4xl sm:text-5xl font-light mt-3">{employee?.name}</h1>
            {employee?.role && (
              <p className="text-gray-300 text-lg mt-2 capitalize">{employee.role}</p>
            )}
            {employee?.bio && (
              <p className="text-gray-300/90 leading-relaxed max-w-2xl mt-6">{employee.bio}</p>
            )}
            {formattedDate && (
              <p className="text-gray-400 text-sm mt-6">Роден: {formattedDate}</p>
            )}
          </div>

          {/* Profile image (right) */}
          <div className="relative w-full md:w-[360px] aspect-[3/4] overflow-hidden rounded-md bg-theater-grey">
            {employee?.profile_picture_URL ? (
              <>
                <Image
                  src={employee.profile_picture_URL}
                  alt={employee?.name || 'Профил'}
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-theater-grey to-black/40">
                <span className="text-4xl font-semibold text-white/80">{initials(employee?.name)}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Shows list */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-light mb-6">Участва в:</h2>
          {shows.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {shows.map((s) => (
                <div key={s.id} className="group">
                  <Link href={`/repertoar/${s.slug}`} className="block">
                    <div className="relative w-full aspect-[2/3] overflow-hidden rounded bg-theater-grey">
                      {(s.poster_URL || s.image_URL) ? (
                        <Image src={s.poster_URL || s.image_URL} alt={s.title} fill className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
                      ) : (
                        <div className="absolute inset-0 bg-theater-grey" />
                      )}
                    </div>
                  </Link>
                  <h3 className="mt-2 text-white text-sm sm:text-base font-medium leading-tight">{s.title}</h3>
                  <Link href={`/repertoar/${s.slug}`} className="mt-1 inline-flex items-center gap-1 text-[#27AAE1] hover:opacity-90 text-sm">
                    <span>Билети</span>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z"/></svg>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Няма добавени спектакли.</p>
          )}
        </div>
      </section>

      {/* Large stage image footer */}
      {(() => {
        const featured = shows.find((s) => s.image_URL)?.image_URL || employee?.profile_picture_URL;
        return featured ? (
          <section className="bg-theater-dark">
            <div className="relative w-full h-[380px] sm:h-[460px] md:h-[520px]">
              <Image src={featured} alt={employee?.name || 'Сцена'} fill className="object-cover" />
            </div>
          </section>
        ) : null;
      })()}
    </main>
  );
}
