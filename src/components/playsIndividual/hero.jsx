// components/PlayHero.js
import React from 'react';
import Image from 'next/image';

const PlayHero = ({
  playName,
  backgroundImage, // Path to the image, e.g., /images/your-play-hero.jpg
  heroHeight = "h-screen" // Default height, e.g., h-[70vh], h-[80vh], h-screen
}) => {
  // Use the provided backgroundImage or a default one
  // Make sure this default image exists in your /public/images folder
  const imgSrc = backgroundImage // Using the image name from your upload

  return (
    <div className={`w-full ${heroHeight} relative flex flex-col justify-end items-center text-white bg-theater-dark`}>
      {/* Background Image using next/image */}
      <Image
        src={imgSrc}
        alt={playName ? `Background for ${playName}` : "Play hero background"}
        fill
        quality={80}
        priority
        className="z-0 object-cover"
      />

      {/* Smooth gradient overlay blending into the page section below */}
      <div className="absolute inset-0 bg-gradient-to-t from-theater-dark via-theater-dark/40 to-black/20 z-10" />

      {/* Text Container - aligned exactly to the global 1474px rule */}
      <div className="relative z-20 w-full flex justify-center px-4 sm:px-8 pb-4 sm:pb-6">
        <div className="w-full max-w-[1474px]">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light uppercase tracking-wide drop-shadow-md pb-2">
            {playName}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default PlayHero;