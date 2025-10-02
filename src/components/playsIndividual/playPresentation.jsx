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
      <div className="bg-theatre-dark text-[#e0e0e0] py-10 px-16">
        <p className="text-base md:text-lg leading-relaxed mb-8 max-w-3xl lg:max-w-4xl">
          {synopsis}
        </p>
        {ticketLink && (
          (<a
            href={ticketLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-neutral-700 text-white py-3 px-6 sm:py-4 sm:px-8 rounded text-lg sm:text-xl font-bold transition-colors transition-transform duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-theater-hover focus-visible:ring-opacity-75 hover:bg-theater-hover hover:shadow-lg hover:scale-[1.03] hover:-translate-y-0.5 active:translate-y-0"
          >
            {ticketButtonText}
          </a>)
        )}
      </div>
    </div>
  );
};

export default PlayPresentation;
