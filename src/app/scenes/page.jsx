import Link from 'next/link';

export const metadata = {
  title: 'Сцени'
};

const venues = [
  {
    id: 'main-stage',
    name: 'Голяма сцена',
    description:
      'Lorem ipsum dolor sit amet consectetur. Commodo proin commodo cras nisl sem. Dis malesuada in interdum aenean est lacus libero. Lorem ipsum dolor sit amet consectetur.',
    schemeHref: '/seat-picker'
  },
  {
    id: 'chamber-stage',
    name: 'Камерна сцена',
    description:
      'Lorem ipsum dolor sit amet consectetur. Commodo proin commodo cras nisl sem. Dis malesuada in interdum aenean est lacus libero. Lorem ipsum dolor sit amet consectetur.',
    schemeHref: '/seat-picker'
  }
];

export default function ScenesPage() {
  return (
    <section className="bg-theater-dark text-white px-6 py-16 sm:py-20 md:py-24">
      <div className="max-w-6xl mx-auto space-y-16 sm:space-y-20">
        <header className="text-center space-y-4">
          <p className="text-theater-grey uppercase tracking-[0.35em] text-xs sm:text-sm">Сцени</p>
          <h1 className="text-4xl sm:text-5xl font-light">Сцени</h1>
        </header>

        <div className="space-y-14 sm:space-y-16">
          {venues.map((venue) => (
            <article
              key={venue.id}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start border border-gray-800 rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-theater-dark/80 via-theater-dark to-theater-dark/80"
            >
              <div className="order-2 lg:order-1 space-y-6">
                <div className="space-y-3">
                  <h2 className="text-2xl sm:text-3xl font-light tracking-wide">{venue.name}</h2>
                  <p className="text-base sm:text-lg text-gray-300 leading-relaxed">{venue.description}</p>
                </div>
                <div>
                  <Link
                    href={venue.schemeHref}
                    className="inline-flex items-center gap-2 text-lg font-light text-white group"
                  >
                    <span className="border-b border-transparent pb-0.5 transition-all duration-300 group-hover:border-white">
                      Схеми
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
                    </svg>
                  </Link>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <div className="w-full h-56 sm:h-72 lg:h-full min-h-[14rem] rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-600 via-gray-500 to-gray-400" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
