import React from 'react';
import Image from 'next/image';

const HeroSection = () => {
  return (
    // 1. Made shorter using h-[80vh] instead of h-screen
    <div className="h-[80vh] flex flex-col">
      {/* Hero Image Section - Fills remaining space */}
      <section className="relative flex-1 w-full overflow-hidden">
        {/* Background Image with Next.js Image */}
        <Image
          src="/hero.jpg"
          alt="Hero background"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          quality={90}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40 z-[1]"></div>

        {/* Content - Responsive text at bottom left */}
        {/* 2. Applied consistent responsive padding */}
        <div className="absolute bottom-2 right-1 z-10 px-4 sm:px-6 lg:px-8 w-full">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold text-white tracking-wider leading-none -mb-2 sm:-mb-3 md:-mb-4 lg:-mb-6">
            НИРВАНА
          </h1>
        </div>
      </section>

      {/* Date/Time Section - Fixed height */}
      {/* 2. Applied consistent responsive padding */}
      <div className="bg-theater-dark text-white px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex space-x-8 text-lg">
          <span>20.06.25</span>
          <span>19:00</span>
          <span>СЦЕНА</span>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;