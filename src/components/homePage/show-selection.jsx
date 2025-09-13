'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Arrow from "@/components/ui/icons/Arrow.svg"


// Mock data structure


const ShowsSection = (props) => {
  const [activeFilter, setActiveFilter] = useState('all');
   let mockShows = props.shows;
   console.log(props.shows);
  // Filter shows based on active category
  const filteredShows = mockShows.filter(show => {
    if (activeFilter === 'all') return true;
    return show.category === activeFilter;
  });

  // Get first 6 shows for display
  const displayedShows = filteredShows.slice(0, 6);

  return (
    <section className="bg-theater-dark px-16 "> {/* Added some vertical padding for overall look */}
      <div className="mx-auto">
        {/* Container for Header and Filters, using flex-col */}
        <div className="flex flex-col mb-12 ">
          {/* Header with Tickets link */}
          <div className="flex justify-start items-center mb-8">
            <Link
              href="/tickets"
              className="text-white text-2xl sm:text-3xl font-[700] group"
            >
              Билети <Arrow className="inline-block transition-transform duration-300 group-hover:translate-x-2 w-6 h-6 pl-1 "></Arrow>
            </Link>
          </div>

          {/* Filter buttons */}
          <div className="flex gap-8 ">
            <button
              onClick={() => setActiveFilter('all')}
              className={`text-xl font-light transition-all duration-300 ${activeFilter === 'all'
                ? 'text-white'
                : 'text-gray-500 hover:text-gray-300'
                }`}
            >
              ВСИЧКИ
            </button>
            <button
              onClick={() => setActiveFilter('theater')}
              className={`text-xl font-light transition-all duration-300 ${activeFilter === 'theater'
                ? 'text-white'
                : 'text-gray-500 hover:text-gray-300'
                }`}
            >
              ТЕАТЪР
            </button>
            <button
              onClick={() => setActiveFilter('music')}
              className={`text-xl font-light transition-all duration-300 ${activeFilter === 'music'
                ? 'text-white'
                : 'text-gray-500 hover:text-gray-300'
                }`}
            >
              МУЗИКА
            </button>
          </div>
        </div>

        {/* Shows grid - 6 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayedShows.map((show) => (
        <Link
          key={show.id} // Preserved from the original outer div
          href={`/repertoar/${show.slug}`}
          // Classes from original outer div ("group cursor-pointer") and card div ("bg-theater-dark...")
          // "cursor-pointer" is default for <a> tags rendered by Link, so explicitly adding it is optional.
          // "group" is essential for group-hover effects.
          className="group block bg-theater-dark rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
        >
          {/* This inner div helps structure content. The flex classes are added for better layout (e.g., "Информация" at the bottom).
              If you want to avoid any layout changes from flexbox, you can remove "flex flex-col h-full" from this div
              and "flex-grow" from the spacer div below, but the "Информация" section might not always align at the bottom. */}
          <div className="flex flex-col h-full">
            
            {/* Image Section */}
            {/* The "px-4 pt-4" are applied based on your original comments for the "NEW WRAPPER FOR PADDING".
                Original: <div className=""> with comments for px-4 and pt-4. */}
            <div className=""> 
              <div 
                className="relative w-full" // Preserved from original image container
                style={{ aspectRatio: '2/3' }} // Preserved
              >
                <Image
                  src={show.poster_URL}
                  alt={show.title}
                  fill
                  sizes="(max-width: 768px) 70vw, (max-width: 1024px) 40vw, 23vw"
                  // "object-cover" class is equivalent to style={{ objectFit: 'cover' }}
                  className="object-cover" // Preserved (was style={{ objectFit: 'cover' }})
                />
              </div>
            </div>

            {/* Content Section */}
            {/* Original content div: <div className="bg-theater-dark pt-3">
                - "bg-theater-dark" is removed as the parent Link now has it.
                - "pt-3" is preserved.
                - "px-4" is added for horizontal padding consistency with the image wrapper (based on your comments for image wrapper).
                - "pb-4" is added for bottom spacing; adjust if not desired.
                - "flex flex-col flex-grow" on this div is for layout. */}
            <div className="pt-3 flex flex-col flex-grow">
              {/* All text item classes are preserved directly from your original code. */}
              <p className="text-white text-xl font-light mb-1">{show.date}</p>
              <h3 className="text-white text-lg font-normal mb-0 leading-tight">
                {show.title}
              </h3>
              <p className="text-gray-400 text-sm font-light mb-2">{show.author}</p>

              {/* This spacer div with "flex-grow" pushes the "Информация" section to the bottom.
                  Remove if you prefer content to flow naturally without this alignment. */}
              <div className="flex-grow"></div>

              {/* "Информация" and Arrow section - styled to replicate the original Link's appearance */}
              {/* Original Link classes: "inline-flex items-center text-white text-base font-light transition-colors duration-300" */}
              <div className="inline-flex items-center text-white text-base font-light transition-colors duration-300 mt-2"> {/* "mt-2" added for spacing */}
                {/* Original span classes: "border-b border-transparent transition-all duration-300" */}
                {/* "group-hover:border-white" is added for visual feedback when the card (group) is hovered.
                    The original span didn't have an explicit hover state for the border. Remove if not desired. */}
                <span className="border-b border-transparent group-hover:border-white transition-all duration-300">
                  Информация
                </span>
                {/* Arrow classes are preserved. "group-hover:translate-x-2" works due to "group" on the parent Link. */}
                <Arrow className="inline-block transition-transform duration-300 group-hover:translate-x-2 w-6 h-6 pl-2" />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>

        {/* View all link if more than 6 shows */}
        {filteredShows.length > 6 && (
          <div className="text-right mt-12 pr-6">
            <Link
              href="/calendar"
              className="inline-flex items-center text-white text-sm font-light transition-colors duration-300 group" // Added 'group' for hover effects
            >
              {/* Span for the text with an underline effect on hover */}
              <span className="border-b border-transparent group-hover:border-white transition-all duration-300 text-lg">
                Виж всички представления {/* Kept your original text */}
              </span>
              {/* Arrow icon, matching the target style */}
              <Arrow className="inline-block transition-transform duration-300 group-hover:translate-x-2 w-6 h-6 ml-2"></Arrow>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShowsSection;