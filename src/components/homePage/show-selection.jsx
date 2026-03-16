'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Arrow from "@/components/ui/icons/Arrow.svg"

const ShowsSection = (props) => {
  const [activeFilter, setActiveFilter] = useState('all');
  let mockShows = props.shows;

  // Filter shows based on active category
  const filteredShows = mockShows.filter(show => {
    if (activeFilter === 'all') return true;
    return show.category === activeFilter;
  });

  // Get first 6 shows for display
  const displayedShows = filteredShows.slice(0, 6);

  return (
    <section className="bg-theater-dark px-8 py-8">
      <div className="mx-auto max-w-[1440px]">
        {/* Filter tabs row */}
        <div className="flex gap-6 mb-6">
          <button
            onClick={() => setActiveFilter('all')}
            className={`text-sm font-medium tracking-widest transition-all duration-300 pb-1 ${activeFilter === 'all'
              ? 'text-white border-b-2 border-white'
              : 'text-gray-500 hover:text-[#27AAE1] border-b-2 border-transparent'
              }`}
          >
            ВСИЧКИ
          </button>
          <button
            onClick={() => setActiveFilter('theater')}
            className={`text-sm font-medium tracking-widest transition-all duration-300 pb-1 ${activeFilter === 'theater'
              ? 'text-white border-b-2 border-white'
              : 'text-gray-500 hover:text-[#27AAE1] border-b-2 border-transparent'
              }`}
          >
            ТЕАТЪР
          </button>
          <button
            onClick={() => setActiveFilter('music')}
            className={`text-sm font-medium tracking-widest transition-all duration-300 pb-1 ${activeFilter === 'music'
              ? 'text-white border-b-2 border-white'
              : 'text-gray-500 hover:text-[#27AAE1] border-b-2 border-transparent'
              }`}
          >
            МУЗИКА
          </button>
        </div>

        {/* Shows grid - 3 columns, 2 rows, fixed card size 267x481 */}
        <div className="flex flex-wrap gap-8 justify-center">
          {displayedShows.map((show) => (
            <Link
              key={show.id}
              href={`/repertoar/${show.slug}`}
              className="group block bg-theater-dark overflow-hidden transition-all duration-300 flex-shrink-0"
              style={{ width: '267px', height: '481px' }}
            >
              <div className="flex flex-col h-full">
                {/* Image Section - fixed height */}
                <div className="relative w-full flex-shrink-0" style={{ height: '370px' }}>
                  <Image
                    src={show.poster_URL}
                    alt={show.title}
                    fill
                    sizes="267px"
                    className="object-cover"
                  />
                </div>

                {/* Content Section - fills remaining 111px */}
                <div className="pt-2 px-1 flex flex-col flex-grow overflow-hidden">
                  <p className="text-gray-400 text-[10px] font-light mb-0.5">{show.date}</p>
                  <h3 className="text-white text-xs font-semibold mb-0 leading-snug">
                    {show.title}
                  </h3>
                  <p className="text-gray-400 text-[10px] font-light mb-1">{show.author}</p>

                  <div className="flex-grow"></div>

                  <div className="inline-flex items-center text-[#27AAE1] text-[10px] font-light transition-colors duration-300 mb-2">
                    <span className="border-b border-transparent group-hover:border-[#27AAE1] transition-all duration-300 group-hover:text-[#27AAE1]">
                      Информация
                    </span>
                    <Arrow className="inline-block transition-transform duration-300 group-hover:translate-x-2 w-3 h-3 pl-0.5 fill-current" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all link if more than 6 shows */}
        {filteredShows.length > 6 && (
          <div className="text-right mt-6">
            <Link
              href="/calendar"
              className="inline-flex items-center text-white text-sm font-light transition-colors duration-300 group hover:text-[#27AAE1]"
            >
              <span className="border-b border-transparent group-hover:border-theater-hover transition-all duration-300 text-base hover:text-[#27AAE1] group-hover:text-[#27AAE1]">
                Виж всички представления
              </span>
              <Arrow className="inline-block transition-transform duration-300 group-hover:translate-x-2 w-4 h-4 ml-2 fill-current group-hover:text-[#27AAE1]"></Arrow>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShowsSection;
