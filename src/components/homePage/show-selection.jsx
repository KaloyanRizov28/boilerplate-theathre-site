'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Arrow from "@/components/ui/icons/Arrow.svg"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const ShowCard = ({ show }) => (
  <Link
    href={`/repertoar/${show.slug}`}
    className="group block bg-theater-dark overflow-hidden transition-all duration-300 w-full"
  >
    <div className="flex flex-col h-full">
      {/* Image Section - proportional aspect ratio scaling */}
      <div className="relative w-full aspect-[267/370]">
        <Image
          src={show.poster_URL}
          alt={show.title}
          fill
          sizes="(max-width: 640px) 100vw, 400px"
          className="object-cover"
        />
      </div>

      {/* Content Section - fills remaining 111px */}
      <div className="pt-2 px-1 flex flex-col flex-grow overflow-hidden">
        <p className="text-gray-400 text-xs sm:text-sm font-light mb-0.5">{show.date}</p>
        <h3 className="text-white text-base sm:text-lg font-semibold mb-0 leading-snug">
          {show.title}
        </h3>
        <p className="text-gray-400 text-xs sm:text-sm font-light mb-1">{show.author}</p>

        <div className="flex-grow"></div>

        <div className="inline-flex items-center text-[#27AAE1] text-xs sm:text-sm font-light transition-colors duration-300 mb-2">
          <span className="border-b border-transparent group-hover:border-[#27AAE1] transition-all duration-300 group-hover:text-[#27AAE1]">
            Информация
          </span>
          <Arrow className="inline-block transition-transform duration-300 group-hover:translate-x-2 w-3 h-3 pl-0.5 fill-current" />
        </div>
      </div>
    </div>
  </Link>
);

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
    <section className="bg-theater-dark px-4 sm:px-8 py-8">
      <div className="max-w-[1474px] mx-auto w-full">
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

        {/* Shows Layout - Carousel on Mobile, Grid on Desktop */}
        <p className="block sm:hidden text-xs text-center text-gray-500 mb-2 uppercase tracking-widest">Плъзнете за още</p>
        <div className="block sm:hidden overflow-hidden">
          <Swiper
            modules={[Pagination]}
            observer={true}
            observeParents={true}
            spaceBetween={0}
            slidesPerView={1}
            centeredSlides={false}
            pagination={{ 
              el: '.plays-pagination',
              clickable: true 
            }}
            className="w-full"
          >
            {displayedShows.map((show) => (
              <SwiperSlide key={show.id}>
                <div className="px-4">
                  <ShowCard show={show} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* Unique scoped pagination container */}
          <div className="plays-pagination flex justify-center gap-2 mt-6 [&_.swiper-pagination-bullet]:bg-gray-500 [&_.swiper-pagination-bullet-active]:bg-[#27AAE1] [&_.swiper-pagination-bullet-active]:w-6 [&_.swiper-pagination-bullet-active]:rounded-full [&_.swiper-pagination-bullet]:w-2 [&_.swiper-pagination-bullet]:h-2 [&_.swiper-pagination-bullet]:transition-all [&_.swiper-pagination-bullet]:duration-300 [&_.swiper-pagination-bullet]:cursor-pointer"></div>
        </div>

        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12 xl:gap-[137px]">
          {displayedShows.map((show) => (
            <ShowCard key={show.id} show={show} />
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
