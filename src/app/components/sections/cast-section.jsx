import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Mock data for cast members
const mockCast = [
  {
    id: 1,
    name: 'Самуил Сребрев',
    role: 'Актьор',
    slug: 'samuil-srebrev',
    image: '/cast/samuil.jpg'
  },
  {
    id: 2,
    name: 'Слави Гергов',
    role: 'Режисьор',
    slug: 'slavi-gergov',
    image: '/cast/slavi.jpg'
  },
  {
    id: 3,
    name: 'Самуил Горанов',
    role: 'Актьор',
    slug: 'samuil-goranov',
    image: '/cast/samuil-g.jpg'
  }
];

const CastSection = () => {
  return (
    <section className="bg-theater-dark py-16 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <h2 className="text-white text-4xl sm:text-5xl font-light mb-12">
          Състав
        </h2>

        {/* Cast grid - 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCast.map((member) => (
            <div key={member.id} className="group cursor-pointer">
              {/* Card */}
              <div className="bg-theater-dark rounded-lg overflow-hidden transition-all duration-300">
                {/* Image container - smaller square format for portraits */}
                <div className="relative h-[250px] bg-gray-800 overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Subtle gradient overlay at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="p-3 bg-theater-dark">
                  {/* Name */}
                  <h3 className="text-white text-base font-normal mb-1 leading-tight">
                    {member.name}
                  </h3>
                  
                  {/* Role */}
                  <p className="text-gray-400 text-sm font-light mb-3">{member.role}</p>
                  
                  {/* Info link */}
                  <Link 
                    href={`/cast/${member.slug}`}
                    className="inline-flex items-center text-white text-sm font-light transition-colors duration-300"
                  >
                    <span className="border-b border-transparent group-hover:border-white transition-all duration-300">
                      Виж още
                    </span>
                    <span className="ml-1 inline-block transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110 text-xs">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View all cast members link */}
        <div className="text-center mt-12">
          <Link 
            href="/cast" 
            className="inline-block text-white text-lg font-light border border-white/30 px-8 py-3 rounded-lg transition-all duration-300 group hover:bg-white hover:text-black"
          >
            Виж целия състав
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CastSection;