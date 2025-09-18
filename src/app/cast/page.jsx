import Link from 'next/link';
import { createClient } from '../../../lib/supabase/server';
import CastGridClient from './CastGridClient';

export const metadata = {
  title: 'Състав',
};


export default async function CastPage() {
  const supabase = await createClient();
  const { data: employees } = await supabase
    .from('employees')
    .select('id, name, role, profile_picture_URL')
    .order('name');

  const people = employees ?? [];

  return (
    <main className="bg-theater-dark text-white">
      {/* Heading section without background image */}
      <section className="px-6 py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-6xl space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light">Творчески състав</h1>
          <div className="text-gray-300 space-y-2">
            <div>
              <Link href="/cast?section=technical" className="hover:text-[#27AAE1]">Художествено-технически състав</Link>
            </div>
            <div>
              <Link href="/cast?section=leadership" className="hover:text-[#27AAE1]">Ръководство</Link>
            </div>
            <div>
              <Link href="/cast?section=administrative" className="hover:text-[#27AAE1]">Административен състав</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Client-side grid + filters */}
      <CastGridClient people={people} />
    </main>
  );
}
