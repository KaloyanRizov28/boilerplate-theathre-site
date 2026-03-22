import { createClient } from '../../../lib/supabase/server';
import TeamAccordionClient from '../leadership/TeamAccordionClient';

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
  return (
    /актьор|actor/.test(role) ||
    /режис/.test(role) ||
    /сценар|драматург|writer|playwright/.test(role) ||
    /музик|композитор|music/.test(role) ||
    /хореограф/.test(role)
  );
}

export default async function CastPage() {
  const supabase = await createClient();
  const { data: employees } = await supabase
    .from('employees')
    .select('id, name, role, profile_picture_URL')
    .order('name');

  const people = employees || [];
  const technical = people.filter((p) => isTechnical(p.role));
  const administrative = people.filter((p) => isAdministrative(p.role));
  const creative = people.filter((p) => isCreative(p.role) || (!isTechnical(p.role) && !isAdministrative(p.role)));

  return (
    <main className="bg-theater-dark text-white">
      <section className="px-4 sm:px-8 py-8 sm:py-16">
        <div className="max-w-[1474px] mx-auto w-full">
          <TeamAccordionClient creative={creative} technical={technical} administrative={administrative} />
        </div>
      </section>
    </main>
  );
}
