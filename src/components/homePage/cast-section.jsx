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

// --- 2. CastCard (entire card clickable + smaller) ---
const CastCard = ({ member }) => (
    <Link
        href={`/employees/${member.id}`}
        aria-label={`Профил: ${member.name}`}
        className="group block h-full cursor-pointer outline-none focus:outline-none"
    >
        <div className="bg-theater-dark rounded-lg overflow-hidden transition-all duration-300 h-full flex flex-col focus-visible:ring-2 focus-visible:ring-[#27AAE1]">
            <div className="relative w-full aspect-[2/3] bg-gray-800 overflow-hidden">
                {member.profile_picture_URL ? (
                    <>
                        <Image
                            src={member.profile_picture_URL}
                            alt={member.name}
                            fill
                            className="object-cover object-top"
                            sizes="(max-width: 600px) 45vw, (max-width: 968px) 25vw, 18vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    </>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-theater-grey text-gray-400 text-xs">
                        Без снимка
                    </div>
                )}
            </div>
            <div className="p-3 bg-theater-dark flex-grow flex flex-col justify-between">
                <div>
                    <h3 className="text-white text-base font-medium leading-tight">
                        {member.name}
                    </h3>
                    {member.role && (
                        <p className="text-gray-400 text-xs font-light mt-1 capitalize">{member.role}</p>
                    )}
                </div>
                <span className="inline-flex items-center text-white text-xs font-light transition-colors duration-300 mt-2 group-hover:text-[#27AAE1]">
                    <span className="border-b border-transparent transition-all duration-300 group-hover:border-theater-hover group-hover:text-[#27AAE1]">
                        Виж още
                    </span>
                    <Arrow className="inline-block transition-transform duration-300 group-hover:translate-x-2 w-5 h-5 pl-2 fill-current group-hover:text-[#27AAE1]" />
                </span>
            </div>
        </div>
    </Link>
);

// --- 3. The Swiper Cast Section ---
const SwiperCastSection = ({ castMembers = [] }) => {
    const hasCastMembers = Array.isArray(castMembers) && castMembers.length > 0;

    return (
        // Compact padding
        <section className="bg-theater-dark py-6 px-6 ">
            {/* Kept original container structure */}
            <div className="relative overflow-hidden">
                <h2 className="text-white text-3xl sm:text-4xl font-light mb-6 sm:mb-8 text-center sm:text-left">
                    Състав
                </h2>

                <div className="relative card-content">
                    {hasCastMembers ? (
                        <Swiper
                            modules={[Navigation, Pagination, A11y]}
                            loop={true}
                            spaceBetween={12}
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
                                    slidesPerView: 2,
                                    spaceBetween: 12,
                                },
                                600: {
                                    slidesPerView: 3,
                                    spaceBetween: 12,
                                },
                                968: {
                                    slidesPerView: 4,
                                    spaceBetween: 12,
                                },
                                1280: {
                                    slidesPerView: 5,
                                    spaceBetween: 12,
                                }
                            }}
                            className=""
                        >
                            {castMembers.map((member) => (
                                <SwiperSlide key={member.id} className="h-auto outline-none focus:outline-none">
                                    <CastCard member={member} />
                                </SwiperSlide>
                            ))}

                            <div className="swiper-button-next text-white hover:text-[#27AAE1] transition-colors"></div>
                            <div className="swiper-button-prev text-white hover:text-[#27AAE1] transition-colors"></div>
                        </Swiper>
                    ) : (
                        <p className="text-gray-400 text-center py-8">
                            Скоро ще добавим информация за състава.
                        </p>
                    )}
                </div>

                {/* View all cast members link - MODIFIED as requested */}
                <div className="text-right pr-4 sm:pr-6"> {/* Slight nudge to the left */}
                    <Link
                        href="/cast"
                        className="inline-flex items-center text-white text-base font-light group transition-colors duration-300 hover:text-[#27AAE1]"
                    >
                        <span className="border-b border-transparent  transition-all duration-300 group-hover:border-theater-hover hover:text-[#27AAE1] group-hover:text-[#27AAE1]">
                            Виж целия състав
                        </span>
                        <Arrow className="inline-block transition-transform duration-300 group-hover:translate-x-2 w-4 h-4 ml-2 fill-current group-hover:text-[#27AAE1]" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default SwiperCastSection;
