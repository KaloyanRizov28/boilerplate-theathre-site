"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function CastFilterSection({ employees = [] }) {
    const [activeFilter, setActiveFilter] = useState('актьори');

    const castMembers = employees.map((item) => item.employees).filter(Boolean);

    const filteredMembers = castMembers.filter((member) => {
        const role = String(member.role || '').toLowerCase();
        if (activeFilter === 'актьори') {
            return role === 'актьор';
        } else if (activeFilter === 'ekip') {
            return role !== 'актьор';
        }
        return true;
    });

    return (
        <section className="bg-theater-dark px-4 sm:px-8 py-8 sm:py-12">
            <div className="max-w-[1474px] mx-auto w-full">
                <div className="flex flex-col mb-10">
                    <div className="flex gap-6 md:gap-8">
                        <button
                            onClick={() => setActiveFilter('актьори')}
                            className={`text-lg font-light transition-all duration-300 ${activeFilter === 'актьори' ? 'text-white' : 'text-gray-500 hover:text-[#27AAE1]'}`}
                        >
                            АКТЬОРИ
                        </button>
                        <button
                            onClick={() => setActiveFilter('ekip')}
                            className={`text-lg font-light transition-all duration-300 ${activeFilter === 'ekip' ? 'text-white' : 'text-gray-500 hover:text-[#27AAE1]'}`}
                        >
                            ЕКИП
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-6 items-center justify-center sm:justify-start">
                    {filteredMembers.map((member) => (
                        <Link
                            key={member.id}
                            href={`/employees/${member.id}`}
                            className="flex flex-col items-center"
                        >
                            {member.profile_picture_URL && (
                                <Image
                                    src={member.profile_picture_URL}
                                    alt={member.name}
                                    width={192}
                                    height={192}
                                    className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-cover rounded-md mb-2 transition-all duration-300"
                                />
                            )}
                            <p className="text-white text-sm text-center">{member.name}</p>
                            {member.role && (
                                <p className="text-gray-400 text-xs text-center capitalize">{member.role}</p>
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
