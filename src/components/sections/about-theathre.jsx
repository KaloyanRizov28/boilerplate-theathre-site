import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Arrow from "@/components/ui/icons/Arrow.svg"
const AboutTheaterSection = () => {
  return (
    <section className="bg-theater-dark py-16 px-4 ">
      <div className="mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div>
            <h2 className="text-white text-4xl sm:text-5xl font-light mb-8">
              За Театъра
            </h2>
            
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Lorem ipsum dolor sit amet consectetur. Commodo proin commodo 
              cras nisl sem. Dis malesuada in interdum aenean est lacus 
              libero.Lorem ipsum dolor sit amet consectetur.
            </p>
            
            <Link 
              href="/about" 
              className="inline-flex items-center text-white text-xl font-light group"
            >
              <span className="border-b border-transparent transition-all duration-300">
                Виж още
              </span>
              <Arrow className="inline-block transition-transform duration-300 group-hover:translate-x-2 w-6 h-6 pl-2"></Arrow>
            </Link>
          </div>
          
          {/* Right side - Theater Logo/Icon */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80">
              {/* Using Next.js Image for the theater icon */}
              <Image
                src="/logo.svg" // Replace with your actual icon path
                alt="Theater Icon"
                fill
                className="object-contain filter brightness-0 invert"
              />
              
              {/* Alternative: If you want to use the icon as a background pattern */}
              {/* <div 
                className="w-full h-full bg-white"
                style={{
                  maskImage: 'url(/theater-icon.svg)',
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskImage: 'url(/theater-icon.svg)',
                  WebkitMaskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                }}
              /> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Alternative version with inline SVG (if you have the SVG code)
const AboutTheaterSectionWithSVG = () => {
  return (
    <section className="bg-gray-900 py-16 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div>
            <h2 className="text-white text-4xl sm:text-5xl font-light mb-8">
              За Театъра
            </h2>
            
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Lorem ipsum dolor sit amet consectetur. Commodo proin commodo 
              cras nisl sem. Dis malesuada in interdum aenean est lacus 
              libero.Lorem ipsum dolor sit amet consectetur.
            </p>
            
            <Link 
              href="/about" 
              className="inline-flex items-center text-white text-xl font-light group"
            >
              <span className="border-b border-transparent group-hover:border-white transition-all duration-300">
                Виж още
              </span>
              <span className="ml-2 inline-block transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110">
                →
              </span>
            </Link>
          </div>
          
          {/* Right side - Theater Icon as SVG */}
          <div className="flex justify-center lg:justify-end">
            <svg 
              className="w-64 h-64 sm:w-80 sm:h-80 text-white"
              viewBox="0 0 200 200" 
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Theater/Lyre icon representation */}
              {/* This is a placeholder - replace with your actual SVG paths */}
              <path d="M100 20 L80 40 L80 100 L70 110 L70 130 L90 130 L90 180 L110 180 L110 130 L130 130 L130 110 L120 100 L120 40 Z" />
              <path d="M60 60 C40 60 30 70 30 90 C30 110 40 120 60 120 L60 100 C50 100 50 90 50 80 C50 70 60 70 60 60 Z" />
              <path d="M140 60 C160 60 170 70 170 90 C170 110 160 120 140 120 L140 100 C150 100 150 90 150 80 C150 70 140 70 140 60 Z" />
              <rect x="70" y="140" width="60" height="10" />
              <rect x="60" y="160" width="80" height="10" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTheaterSection;