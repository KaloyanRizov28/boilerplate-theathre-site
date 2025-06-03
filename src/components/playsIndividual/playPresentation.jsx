// components/PlayPresentation.js
import React from 'react';
import PlayHero from './hero'; // Ensure this path is correct

const PlayPresentation = ({
  playName,
  backgroundImage,
  heroHeight = "h-[80vh]", // You can set a default hero height for the presentation
  synopsis,
  ticketLink,
  ticketButtonText = "Билети →" // Default button text
}) => {
  return (
    <div>
      <PlayHero
        playName={playName}
        backgroundImage={backgroundImage}
        heroHeight={heroHeight}
      />
      <div className="bg-[#1c1c1c] text-[#e0e0e0] py-10 px-4">
        <p className="text-base md:text-lg leading-relaxed mb-8 max-w-3xl lg:max-w-4xl">
          {synopsis}
        </p>
        {ticketLink && ( // Only render button if ticketLink is provided
          <a
            href={ticketLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-neutral-700 text-white py-3 px-6 sm:py-4 sm:px-8 rounded text-lg sm:text-xl font-bold hover:bg-neutral-600 active:bg-neutral-800 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-opacity-75"
          >
            {ticketButtonText}
          </a>
        )}
      </div>
    </div>
  );
};

export default PlayPresentation;