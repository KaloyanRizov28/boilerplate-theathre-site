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
    <div className={`w-full ${heroHeight} relative flex flex-col justify-end items-start text-white`}>
      {/* Background Image using next/image */}
      <Image
        src={imgSrc}
        alt={playName ? `Background for ${playName}` : "Play hero background"}
        layout="fill" // Fills the parent container
        objectFit="cover" // Behaves like background-size: cover
        quality={80}      // Adjust image quality (0-100)
        priority          // Load this image early if it's LCP (Largest Contentful Paint)
        className="z-0"   // Ensure image is in the background layer
      />

      {/* Overlay for better text readability */}
      <div className="absolute inset-0  bg-opacity-40 z-10"></div>

      {/* Text Container */}
      <div className="relative z-20 w-full max-w-[85%] p-0 top-4 pl-4">
        <h1 className="font-bold uppercase leading-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
          {playName}
        </h1>
      </div>
    </div>
  );
};

export default PlayHero;