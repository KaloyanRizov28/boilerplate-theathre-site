import Image from 'next/image';
import Link from 'next/link';
import Arrow from '@/components/ui/icons/Arrow.svg';

export const metadata = {
  title: 'Сцени'
};

const venues = [
  {
    id: 'main-stage',
    name: 'Голяма сцена',
    description:
      'Основната сцена на театъра посреща най-големите ни продукции с впечатляващ капацитет и богата сценична механизация. Пространството е проектирано да осигури перфектна видимост и акустика дори при пълна зала.',
    specs: [
      { label: 'Капацитет', value: '707 места' },
      { label: 'Размер на сцената', value: '18 x 12 м' },
      { label: 'Височина', value: '22 м' }
    ],
    features: [
      'Пълноценна сценична кулиса с автоматизация',
      'LED осветление и проекционна система',
      'Разширена оркестрина за музикални спектакли'
    ],
    schemeHref: '/seat-picker'
  },
  {
    id: 'chamber-stage',
    name: 'Камерна сцена',
    description:
      'Интимно пространство за съвременни постановки, камерни концерти и творчески срещи. Модулните седалки и мобилната сценография позволяват различни конфигурации спрямо конкретното събитие.',
    specs: [
      { label: 'Капацитет', value: '120 места' },
      { label: 'Размер на сцената', value: '9 x 7 м' },
      { label: 'Конфигурации', value: 'Арена, фронтална, 360°' }
    ],
    features: [
      'Гъвкава система за осветление',
      'Черна кутия с акустична обработка',
      'Отделен вход и фоайе за гости'
    ],
    schemeHref: '/seat-picker'
  }
];

export default function ScenesPage() {
  return (
    <main className="bg-theater-dark text-white">
      <section className="px-6 py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-6xl space-y-16">
          {venues.map((venue, index) => (
            <article
              key={venue.id}
              className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center"
            >
              <div className={`space-y-8 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <header className="space-y-3">
                  <p className="text-theater-grey uppercase tracking-[0.35em] text-xs sm:text-sm">{venue.name}</p>
                  <h2 className="text-3xl sm:text-4xl font-light">{venue.name}</h2>
                </header>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed">{venue.description}</p>
                <Link href={venue.schemeHref} className="inline-flex items-center text-lg font-light group">
                  <span className="border-b border-transparent pb-1 transition-all duration-300 group-hover:border-white hover:text-[#27AAE1] group-hover:text-[#27AAE1]">
                    Схеми на залата
                  </span>
                  <Arrow className="ml-3 h-6 w-6 transition-transform duration-300 group-hover:translate-x-1.5 fill-current group-hover:text-[#27AAE1]" />
                </Link>
              </div>

              <div className={`relative overflow-hidden rounded-none border border-gray-700/70 bg-gradient-to-br from-gray-700/40 via-gray-600/30 to-gray-500/20 backdrop-blur ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="aspect-[4/3] sm:aspect-[3/2]">
                  <Image
                    src="/logo.svg"
                    alt={`${venue.name} - визуална репрезентация`}
                    fill
                    className="object-contain p-12 brightness-0 invert"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-theater-dark/90 via-theater-dark/30 to-transparent px-6 py-5 text-sm text-gray-300">
                  <p>
                    Консултирайте се с екипа ни за резервации и технически изисквания за {venue.name.toLowerCase()}.
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
