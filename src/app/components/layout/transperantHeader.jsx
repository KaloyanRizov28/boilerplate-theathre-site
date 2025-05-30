// src/components/layout/TransparentHeader.js
'use client'

import Image from 'next/image'
import { useState } from 'react'
import Link from 'next/link' // Link is still needed for the navigation items

export function TransparentHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: 'Програма', href: '/calendar' },
    { name: 'За нас', href: '/about' },
    { name: 'Билети', href: '/tickets' },
    { name: 'Контакти', href: '/contact' },
  ]

  // Important: Ensure these colors are visible against the content
  // that this transparent header will overlay.
  // You might need different colors for the hamburger icon or the logo
  // depending on the background of your page.
  const iconColorClass = 'bg-white'; // Example: Changed to white for better visibility on dark backgrounds
                                     // Or, you could pass this as a prop, e.g., iconColor="white" or iconColor="black"

  return (
    <>
      {/* Header - Now Transparent */}
      <header className="sticky top-0 left-0 w-full bg-transparent z-50"> {/* MODIFIED: bg-theater-dark to bg-transparent, removed border */}
        <div className="w-full px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Hamburger Menu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex flex-col space-y-1 p-2 z-50 relative -ml-1"
            >
              {/*
                TODO: Adjust hamburger icon color if 'bg-theater-grey' is not visible
                on the backgrounds where this transparent header will be used.
                Consider passing a prop for icon color or having different variants.
                Using 'iconColorClass' defined above as an example.
              */}
              <div className={`w-6 h-0.5 ${iconColorClass} transition-all duration-300 ${
                isMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}></div>
              <div className={`w-6 h-0.5 ${iconColorClass} transition-all duration-300 ${
                isMenuOpen ? 'opacity-0' : ''
              }`}></div>
              <div className={`w-6 h-0.5 ${iconColorClass} transition-all duration-300 ${
                isMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}></div>
            </button>

            {/* Theater Title - REMOVED as per request */}
            {/*
            <Link href="/" className="text-center">
              <div className="text-sm font-light tracking-wide text-white">
                <div>МУЗИКАЛНО-ДРАМАТИЧЕН ТЕАТЪР</div>
                <div>"КОНСТАНТИН КИСИМОВ"</div>
              </div>
            </Link>
            */}

            {/* Logo Space */}
            {/*
              With the central title removed, the hamburger and logo will now be on opposite ends
              due to 'justify-between'. This might be what you want.
              If not, you might need to adjust the flex layout here.
              For example, to keep the logo more centered, you might need a spacer element
              or change the justify-content property if there's only one other item.
            */}
            <div className="w-12 h-12 flex items-center justify-center -mr-1">
              {/*
                TODO: Ensure your logo.svg is visible on transparent backgrounds.
                If the SVG uses 'currentColor' for its fill/stroke, the 'text-white'
                class might work if you intend the logo to be white.
                Otherwise, the SVG's inherent colors will be used.
                You might need a different logo version for transparent backgrounds.
              */}
              <Image
                src="/logo.svg" // Ensure this logo is suitable for transparent backgrounds
                alt="Theater Logo"
                width={48}
                height={48}
                // className="text-white" // This class might affect SVG color if it uses currentColor
              />
            </div>
          </div>
        </div>
      </header>

      {/* Full Page Overlay Menu - This part remains the same as it has its own background */}
      <div className={`fixed top-0 left-0 w-full h-full z-40 transform transition-transform duration-500 ease-in-out ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-10"
          style={{
            backgroundImage: "url('/logo.svg')",
            backgroundSize: '60vw 60vw',
            backgroundPosition: 'bottom -25vw right -3vw'
          }}
        />

        {/* Dark Overlay for text readability */}
        <div className="absolute inset-0 bg-theater-dark bg-opacity-70" /> {/* This provides the dark background for the menu items */}

        {/* Menu Content - Staircase with Overshoot Animation */}
        <div className="relative z-20 flex flex-col justify-center h-full pl-16 md:pl-24">
          {navigation.map((item, index) => {
            const startPosition = -250 + (index * 40);
            const finalPosition = 0;
            const initialDelay = index * 20;
            const overshootDelay = index ; // Corrected: was missing multiplier, assuming index * something or a fixed value per index

            return (
              <div
                key={item.name}
                className="mb-8"
                style={{
                  transform: isMenuOpen
                    ? `translateX(${finalPosition}px)`
                    : `translateX(${startPosition}px)`,
                  opacity: isMenuOpen ? 1 : 0,
                  // Corrected transition logic based on re-reading, original might have intended separate transitions
                  transition: isMenuOpen
                    ? `transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1) ${initialDelay}ms, opacity 0.3s ease-out ${initialDelay}ms`
                    : 'transform 0.2s ease-in, opacity 0.2s ease-in',
                  animation: isMenuOpen ? `staircaseEntry-${index} 1s ease-out ${initialDelay}ms forwards` : 'none',
                }}
              >
                <Link
                  href={item.href}
                  className="text-white text-4xl md:text-5xl font-light tracking-wide hover:text-gray-300 transition-colors duration-300 block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </div>
            );
          })}
        </div>

        {/* CSS Keyframes for staircase animation - Remains the same */}
        <style jsx>{`
          @keyframes staircaseEntry-0 {
            0% { transform: translateX(-250px); opacity: 0; }
            60% { transform: translateX(25px); opacity: 1; } /* Overshoot */
            100% { transform: translateX(0px); opacity: 1; }
          }
          @keyframes staircaseEntry-1 {
            0% { transform: translateX(-210px); opacity: 0; }
            60% { transform: translateX(30px); opacity: 1; } /* Overshoot */
            100% { transform: translateX(0px); opacity: 1; }
          }
          @keyframes staircaseEntry-2 {
            0% { transform: translateX(-170px); opacity: 0; }
            60% { transform: translateX(35px); opacity: 1; } /* Overshoot */
            100% { transform: translateX(0px); opacity: 1; }
          }
          @keyframes staircaseEntry-3 {
            0% { transform: translateX(-130px); opacity: 0; }
            60% { transform: translateX(40px); opacity: 1; } /* Overshoot */
            100% { transform: translateX(0px); opacity: 1; }
          }
        `}</style>
      </div>
    </>
  )
}