"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Helper to categorize by role text (Bulgarian + fallback English keywords)
function categorizeRole(roleRaw) {
  const role = (roleRaw || "").toLowerCase();
  if (/актьор|actor/.test(role)) return "actors";
  if (/режис/.test(role)) return "directors";
  if (/сценар|драматург|writer|playwright|screen/.test(role)) return "writers";
  if (/музик|композитор|music/.test(role)) return "musicians";
  return "other";
}

export default function CastGridClient({ people = [] }) {
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    if (filter === "all") return people;
    return people.filter((p) => categorizeRole(p.role) === filter);
  }, [filter, people]);

  const tabBase = "text-sm sm:text-base font-light transition-all duration-300";

  return (
    <section className="px-6 pb-16">
      <div className="mx-auto max-w-6xl">
        {/* Top submenu (filters) */}
        <div className="flex flex-wrap gap-6 border-b border-gray-700/70 pb-3 mb-8">
          <button onClick={() => setFilter("all")} className={`${tabBase} ${filter === "all" ? "text-white" : "text-gray-400 hover:text-[#27AAE1]"}`}>ВСИЧКИ</button>
          <button onClick={() => setFilter("actors")} className={`${tabBase} ${filter === "actors" ? "text-white" : "text-gray-400 hover:text-[#27AAE1]"}`}>АКТЬОРИ</button>
          <button onClick={() => setFilter("directors")} className={`${tabBase} ${filter === "directors" ? "text-white" : "text-gray-400 hover:text-[#27AAE1]"}`}>РЕЖИСЬОРИ</button>
          <button onClick={() => setFilter("writers")} className={`${tabBase} ${filter === "writers" ? "text-white" : "text-gray-400 hover:text-[#27AAE1]"}`}>СЦЕНАРИСТИ</button>
          <button onClick={() => setFilter("musicians")} className={`${tabBase} ${filter === "musicians" ? "text-white" : "text-gray-400 hover:text-[#27AAE1]"}`}>МУЗИКАНТИ</button>
        </div>

        {/* Grid of people */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {filtered.map((p) => (
            <Link
              key={p.id}
              href={`/employees/${p.id}`}
              className="group block"
            >
              <div className="relative w-full aspect-[3/4] overflow-hidden rounded bg-gray-300/70">
                {p.profile_picture_URL && (
                  <Image
                    src={p.profile_picture_URL}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="mt-3">
                <h3 className="text-white text-lg font-semibold group-hover:text-[#27AAE1] transition-colors">
                  {p.name}
                </h3>
                {p.role && (
                  <p className="text-gray-400 text-sm">{p.role}</p>
                )}
              </div>
            </Link>
          ))}
          {filtered.length === 0 && (
            <p className="text-gray-400">Няма намерени резултати.</p>
          )}
        </div>
      </div>
    </section>
  );
}
