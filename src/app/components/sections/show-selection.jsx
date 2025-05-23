'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Mock data structure
const mockShows = [
  {
    id: 1,
    title: 'Розенкранц и Гилденстерн са мъртви',
    slug: 'rozenkranc-i-gildenstern',
    image: '/shows/rozenkranc.png',
    date: '13.12',
    category: 'theater',
    author: 'Том Стопард'
  },
  {
    id: 2,
    title: 'Кралецът на праскови',
    slug: 'kralecyt-na-praskovi',
    image: '/shows/4.png',
    date: '13.12',
    category: 'theater',
    author: 'Емилиян Станев'
  },
  {
    id: 3,
    title: 'Страната на усмивките',
    slug: 'stranata-na-usmivkite',
    image: '/shows/dve.png',
    date: '13.12',
    category: 'music',
    author: 'Франц Лехар'
  },
  {
    id: 4,
    title: 'Вишнева градина',
    slug: 'vishneva-gradina',
    image: '/shows/3.png',
    date: '20.12',
    category: 'theater',
    author: 'Антон Чехов'
  },
  {
    id: 5,
    title: 'Кармен',
    slug: 'karmen',
    image: '/shows/5.png',
    date: '25.12',
    category: 'music',
    author: 'Жорж Бизе'
  },
  {
    id: 6,
    title: 'Дон Жуан',
    slug: 'don-zhuan',
    image: '/shows/6.png',
    date: '28.12',
    category: 'music',
    author: 'Волфганг Амадеус Моцарт'
  }
];

const ShowsSection = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  // Filter shows based on active category
  const filteredShows = mockShows.filter(show => {
    if (activeFilter === 'all') return true;
    return show.category === activeFilter;
  });

  // Get first 6 shows for display
  const displayedShows = filteredShows.slice(0, 6);

  return (
    <section className="bg-theater-dark py-16 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Tickets link */}
        <div className="flex justify-between items-center mb-8">
          <Link 
            href="/tickets" 
            className="text-white text-2xl sm:text-3xl font-light group"
          >
            Билети <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">→</span>
          </Link>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-8 mb-12">
          <button
            onClick={() => setActiveFilter('all')}
            className={`text-xl font-light transition-all duration-300 ${
              activeFilter === 'all' 
                ? 'text-white' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            ВСИЧКИ
          </button>
          <button
            onClick={() => setActiveFilter('theater')}
            className={`text-xl font-light transition-all duration-300 ${
              activeFilter === 'theater' 
                ? 'text-white' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            ТЕАТЪР
          </button>
          <button
            onClick={() => setActiveFilter('music')}
            className={`text-xl font-light transition-all duration-300 ${
              activeFilter === 'music' 
                ? 'text-white' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            МУЗИКА
          </button>
        </div>

        {/* Shows grid - 6 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedShows.map((show) => (
            <div key={show.id} className="group cursor-pointer">
              {/* Card */}
              <div className="bg-theater-dark rounded-lg overflow-hidden transition-all duration-300">
                {/* Image container */}
                <div className="relative h-[400px] bg-theater-dark overflow-hidden p-4 pb-0">
                  <div className="relative h-full">
                    <Image
                      src={show.image}
                      alt={show.title}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 bg-theater-dark">
                  {/* Date */}
                  <p className="text-white text-xl font-light mb-2">{show.date}</p>
                  
                  {/* Title */}
                  <h3 className="text-white text-lg font-normal mb-3 leading-tight">
                    {show.title}
                  </h3>
                  
                  {/* Author */}
                  <p className="text-gray-400 text-sm font-light mb-4">{show.author}</p>
                  
                  {/* Info link */}
                  <Link 
                    href={`/shows/${show.slug}`}
                    className="inline-flex items-center text-white text-base font-light transition-colors duration-300"
                  >
                    <span className="border-b border-transparent group-hover:border-white transition-all duration-300">Информация</span>
                    <span className="ml-2 inline-block transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110">→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View all link if more than 6 shows */}
        {filteredShows.length > 6 && (
          <div className="text-center mt-12">
            <Link 
              href="/shows" 
              className="inline-block text-white text-lg font-light border border-white/30 px-8 py-3 rounded-lg transition-all duration-300 group hover:bg-white hover:text-black"
            >
              Виж всички представления
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShowsSection;