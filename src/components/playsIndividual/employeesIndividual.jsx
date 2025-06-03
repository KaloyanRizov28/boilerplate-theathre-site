'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import Arrow from "@/components/ui/icons/Arrow.svg"

// Mock actor data
const EkipSection = (props) => {
    const [activeFilter, setActiveFilter] = useState('актьори'); // Default to 'ekip'

    // Mock Ekip (Team) data
    // 'role' is used to differentiate between actors and other team members
    const ekipData = props.employees.map(item => item.employees);
    
    // Filter logic for 'ekip' and 'актьори'
    const filteredEkip = ekipData.filter((member) => {
        if (activeFilter === 'актьори') {
            return member.role.toLowerCase() === 'актьор';
        } else if (activeFilter === 'ekip') {
            // 'ekip' filter includes everyone who is NOT an actor
            return member.role.toLowerCase() !== 'актьор';
        }
        return true; // Should not be reached if filters are only 'ekip' and 'актьори'
    });

    return (
        <section className="bg-theater-dark px-4 py-12">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col mb-10">
                    <div className="flex justify-start items-center mb-6">
                        <Link
                            href="/team"
                            className="text-white text-2xl sm:text-3xl font-[700] group"
                        >
                            Екип <Arrow className="inline-block transition-transform duration-300 group-hover:translate-x-2 w-6 h-6 pl-1"></Arrow>
                        </Link>
                    </div>

                    {/* Filter buttons */}
                    <div className="flex gap-6 md:gap-8">

                        <button
                            onClick={() => setActiveFilter('актьори')}
                            className={`text-lg font-light transition-all duration-300 ${activeFilter === 'актьори' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            АКТЬОРИ
                        </button>
                        <button
                            onClick={() => setActiveFilter('ekip')}
                            className={`text-lg font-light transition-all duration-300 ${activeFilter === 'ekip' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            ЕКИП
                        </button>
                    </div>
                </div>

                {/* Ekip Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredEkip.map((member) => (
                        <div key={member.id} className="flex flex-col items-center">
                            <div className="bg-gray-700 w-24 h-24 rounded-md mb-2" />
                            <p className="text-white text-sm text-center">{member.name}</p>
                            {/* Only show role if it's not 'актьор' when Ekip filter is active, or always if you want to show it. */}
                            {/* For simplicity, we'll show the role for all displayed members. */}
                            {member.role && (
                                <p className="text-gray-400 text-xs text-center capitalize">{member.role}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default EkipSection;