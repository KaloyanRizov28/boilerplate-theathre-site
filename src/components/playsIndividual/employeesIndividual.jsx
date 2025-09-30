"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const EkipSection = (props) => {
    const [activeFilter, setActiveFilter] = useState('актьори');

    const ekipData = props.employees.map(item => item.employees);

    const filteredEkip = ekipData.filter((member) => {
        if (activeFilter === 'актьори') {
            return member.role.toLowerCase() === 'актьор';
        } else if (activeFilter === 'ekip') {
            return member.role.toLowerCase() !== 'актьор';
        }
        return true;
    });

    return (
        <section className="bg-theater-dark px-16 py-12">
            <div className="">
                <div className="flex flex-col mb-10">
                    {/* Filter buttons */}
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

                {/* Ekip Grid */}
                <div className="flex flex-wrap gap-6 items-center justify-center sm:justify-start">
                    {filteredEkip.map((member) => (
                        <Link
                            key={member.id}
                            href={`/employees/${member.id}`}
                            className="flex flex-col items-center"
                        >
                            {member.profile_picture_URL ? (
                                <Image
                                    src={member.profile_picture_URL}
                                    alt={member.name}
                                    width={192}
                                    height={192}
                                    className="w-48 h-48 object-cover rounded-md mb-2"
                                />
                            ) : (
                                <div className="bg-theater-grey w-48 h-48 rounded-md mb-2" />
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
};

export default EkipSection;
