'use client'; // Swiper needs to run on the client

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Arrow from "@/components/ui/icons/Arrow.svg"
// 1. Import Swiper components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Mock data
const mockCast = [
    { id: 1, name: 'Самуил Сребрев', role: 'Актьор', slug: 'samuil-srebrev', image: '/cast/samuil.jpg' },
    { id: 2, name: 'Слави Гергов', role: 'Режисьор', slug: 'slavi-gergov', image: '/cast/slavi.jpg' },
    { id: 3, name: 'Самуил Горанов', role: 'Актьор', slug: 'samuil-goranov', image: '/cast/samuil-g.jpg' },
    { id: 4, name: 'Име 4', role: 'Актьор', slug: 'ime-4', image: '/cast/samuil.jpg' },
    { id: 5, name: 'Име 5', role: 'Актьор', slug: 'ime-5', image: '/cast/slavi.jpg' },
    { id: 6, name: 'Име 6', role: 'Режисьор', slug: 'ime-6', image: '/cast/samuil-g.jpg' },
];

// --- 2. CastCard ---
const CastCard = ({ member }) => (
    <div className="group cursor-pointer h-full outline-none focus:outline-none">
        <div className="bg-theater-dark rounded-lg overflow-hidden transition-all duration-300 h-full flex flex-col">
            <div className="relative w-full aspect-[3/4] bg-gray-800 overflow-hidden">
                <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 600px) 90vw, (max-width: 968px) 45vw, 30vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            <div className="p-4 bg-theater-dark flex-grow flex flex-col justify-between">
                <div>
                    <h3 className="text-white text-lg font-medium mb-1 leading-tight">
                        {member.name}
                    </h3>
                    <p className="text-gray-400 text-sm font-light mb-4">{member.role}</p>
                </div>
                <Link
                    href={`/cast/${member.slug}`}
                    className="inline-flex items-center text-white text-sm font-light transition-colors duration-300 mt-2"
                >
                    <span className="border-b border-transparent transition-all duration-300">
                        Виж още
                    </span>
                    <Arrow className="inline-block transition-transform duration-300 group-hover:translate-x-2 w-6 h-6 pl-2"></Arrow>
                </Link>
            </div>
        </div>
    </div>
);

// --- 3. The Swiper Cast Section ---
const SwiperCastSection = () => {
    return (
        // Kept original padding as per your last code example
        <section className="bg-theater-dark py-4 px-16 ">
            {/* Kept original container structure */}
            <div className="relative overflow-hidden">
                <h2 className="text-white text-4xl sm:text-5xl font-light mb-12 sm:mb-16 text-center sm:text-left">
                    Състав
                </h2>

                <div className="relative card-content">
                    <Swiper
                        modules={[Navigation, Pagination, A11y]}
                        loop={true}
                        spaceBetween={32}
                        grabCursor={true}
                        pagination={{
                            el: ".swiper-pagination",
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        navigation={{
                            nextEl: ".swiper-button-next",
                            prevEl: ".swiper-button-prev",
                        }}
                        breakpoints={{
                            0: {
                                slidesPerView: 1.2,
                                spaceBetween: 20,
                            },
                            600: {
                                slidesPerView: 2,
                                spaceBetween: 32,
                            },
                            968: {
                                slidesPerView: 3,
                                spaceBetween: 32,
                            },
                            1280: {
                                slidesPerView: 4,
                                spaceBetween: 32,
                            }
                        }}
                        className=""
                    >
                        {mockCast.map((member) => (
                            <SwiperSlide key={member.id} className="h-auto outline-none focus:outline-none">
                                <CastCard member={member} />
                            </SwiperSlide>
                        ))}

                        <div className="swiper-button-next text-white hover:text-gray-300 transition-colors"></div>
                        <div className="swiper-button-prev text-white hover:text-gray-300 transition-colors"></div>
                    </Swiper>
                </div>

                {/* View all cast members link - MODIFIED as requested */}
                <div className="text-right pr-2"> {/* MODIFIED: text-right */}
                    <Link
                        href="/cast"
                        // MODIFIED: New class, using text-lg as it was before, group added
                        className="inline-flex items-center text-white text-lg font-light group transition-colors duration-300"
                    >
                        <span className="border-b border-transparent  transition-all duration-300">
                            Виж целия състав
                        </span>
                        {/* MODIFIED: Added arrow */}
                        <Arrow className="inline-block transition-transform duration-300 group-hover:translate-x-2 w-6 h-6 ml-2"></Arrow>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default SwiperCastSection;