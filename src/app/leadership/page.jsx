import { createClient } from '../../../lib/supabase/server';
import TeamAccordionClient from './TeamAccordionClient';

export const metadata = {
  title: 'Състав',
};

function isTechnical(roleRaw) {
  const role = (roleRaw || '').toLowerCase();
  if (!role) return false;
  return (
    /техничес/.test(role) ||
    /освет/.test(role) ||
    /звук/.test(role) ||
    /сценич/.test(role) ||
    /сценограф/.test(role) ||
    /костюм/.test(role) ||
    /реквизит/.test(role) ||
    /машинист/.test(role) ||
    /монтаж/.test(role) ||
    /видео|фото/.test(role) ||
    /техник/.test(role)
  );
}

function isAdministrative(roleRaw) {
  const role = (roleRaw || '').toLowerCase();
  if (!role) return false;
  return (
    /админист/.test(role) ||
    /офис/.test(role) ||
    /билет/.test(role) ||
    /финанс/.test(role) ||
    /маркет/.test(role) ||
    /комуникац/.test(role) ||
    /hr|човешки ресурси/.test(role) ||
    /счетовод/.test(role) ||
    /деловод|кадри/.test(role)
  );
}

function isCreative(roleRaw) {
  const role = (roleRaw || '').toLowerCase();
  if (!role) return false;
  // Creative roles: actor, director, writer/dramaturg, composer/musician, choreographer
  return (
    /актьор|actor/.test(role) ||
    /режис/.test(role) ||
    /сценар|драматург|writer|playwright/.test(role) ||
    /музик|композитор|music/.test(role) ||
    /хореограф/.test(role)
  );
}

export default async function TeamPage() {
  const supabase = await createClient();
  const { data: employees } = await supabase
    .from('employees')
    .select('id, name, role, profile_picture_URL')
    .order('name');

  const people = employees || [];
  const technical = people.filter((p) => isTechnical(p.role));
  const administrative = people.filter((p) => isAdministrative(p.role));
  // Anything explicitly creative OR not matched by tech/admin but has roles - consider creative
  const creative = people.filter((p) => isCreative(p.role) || (!isTechnical(p.role) && !isAdministrative(p.role)));

  return (
    <main className="bg-theater-dark text-white">
      <section className="px-6 py-14 sm:py-18 md:py-20">
        <div className="mx-auto max-w-6xl space-y-5">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light">Състав</h1>
          <p className="text-gray-300 max-w-2xl text-base sm:text-lg">
            Изберете категория, за да видите хората в нея. Клик върху реда отваря списъка с профили.
          </p>
        </div>
      </section>

      <TeamAccordionClient creative={creative} technical={technical} administrative={administrative} />
    </main>
  );
}
