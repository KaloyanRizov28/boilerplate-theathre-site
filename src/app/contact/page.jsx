import Link from 'next/link';
import Arrow from '@/components/ui/icons/Arrow.svg';

export const metadata = {
  title: 'Контакти'
};

const sections = [
  {
    title: 'Администрация',
    people: [
      { name: 'Име Име Име Пост', phone: '0888 888 888', email: 'imeime@mail.bg' },
      { name: 'Име Име Име Пост', phone: '0888 888 888', email: 'imeime@mail.bg' },
      { name: 'Име Име Име Пост', phone: '0888 888 888', email: 'imeime@mail.bg' },
    ]
  },
  {
    title: 'Билетна Каса',
    people: [
      { name: 'Име Име Име Пост', phone: '0888 888 888', email: 'imeime@mail.bg' },
      { name: 'Име Име Име Пост', phone: '0888 888 888', email: 'imeime@mail.bg' },
    ]
  },
  {
    title: 'Нещо друго ако има',
    people: [
      { name: 'Име Име Име Пост', phone: '0888 888 888', email: 'imeime@mail.bg' },
    ]
  }
];

export default function ContactPage() {
  return (
    <main className="bg-theater-dark text-white">
      {/* Page title */}
      <section className="px-6 md:px-12 lg:px-16 py-14 md:py-18 lg:py-20">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold">Контакти</h1>
      </section>
      {/* Content grid */}
      <section className="px-6 md:px-12 lg:px-16 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Left column: sections */}
          <div className="space-y-12">
            {sections.map((sec) => (
              <div key={sec.title}>
                <h2 className="text-xl font-semibold mb-4">{sec.title}</h2>
                <div className="space-y-8">
                  {sec.people.map((p, idx) => (
                    <div key={`${sec.title}-${idx}`} className="text-gray-200">
                      <p className="text-base font-medium text-white mb-2">{p.name}</p>
                      <div className="space-y-1.5">
                        <Link
                          href={`tel:${p.phone.replace(/\s+/g, '')}`}
                          className="inline-flex items-center group hover:text-[#27AAE1] transition-colors"
                        >
                          <span className="tabular-nums">{p.phone}</span>
                          <Arrow className="w-4 h-4 ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1 fill-current group-hover:text-[#27AAE1]" />
                        </Link>
                        <br />
                        <Link
                          href={`mailto:${p.email}`}
                          className="inline-flex items-center group hover:text-[#27AAE1] transition-colors"
                        >
                          <span>{p.email}</span>
                          <Arrow className="w-4 h-4 ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1 fill-current group-hover:text-[#27AAE1]" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right column: map placeholder and address */}
          <div className="flex flex-col gap-6">
            {/* Embedded Google Map */}
            <div className="relative rounded-none overflow-hidden aspect-[16/10] border border-gray-700/70">
              <iframe
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                title="Карта — МДТ Константин Кисимов"
                src="https://maps.google.com/maps?q=5000%20Veliko%20Tarnovo%20Vasil%20Levski%204&z=16&output=embed"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-1">Адрес:</h3>
              <p className="text-gray-300">5000 гр. Велико Търново Ул. „Васил Левски“ 4</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
