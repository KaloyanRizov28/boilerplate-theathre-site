"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

function PersonCard({ p }) {
  return (
    <Link
      href={`/employees/${p.id}`}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#27AAE1]/70 rounded-lg"
    >
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg bg-theater-grey">
        {p.profile_picture_URL ? (
          <>
            <Image
              src={p.profile_picture_URL}
              alt={p.name}
              fill
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-theater-grey to-black/40">
            <span className="text-4xl font-semibold text-white/80">
              {(p.name || "?")
                .split(" ")
                .map((x) => x[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="text-white text-lg font-medium leading-tight group-hover:text-[#27AAE1] transition-colors">
            {p.name}
          </h3>
          {p.role && <p className="text-gray-300/90 text-sm capitalize">{p.role}</p>}
        </div>
      </div>
    </Link>
  );
}

export default function TeamAccordionClient({ creative = [], technical = [], administrative = [] }) {
  const [active, setActive] = useState("creative");
  const [phase, setPhase] = useState("in"); // 'in' | 'out'

  const sections = useMemo(
    () => [
      { key: "creative", title: "Творчески състав", people: creative },
      { key: "technical", title: "Художествено-технически състав", people: technical },
      { key: "administrative", title: "Администрация", people: administrative },
    ],
    [creative, technical, administrative]
  );

  const activePeople = useMemo(() => {
    const found = sections.find((s) => s.key === active);
    return found ? found.people : [];
  }, [sections, active]);

  function handleSelect(key) {
    if (key === active) return;
    setPhase("out");
    setTimeout(() => {
      setActive(key);
      setPhase("in");
    }, 140);
  }

  return (
    <section className="px-6 pb-16">
      <div className="mx-auto max-w-6xl">
        {/* Vertical text menu */}
        <div className="flex flex-col gap-2 mb-6">
          {sections.map((s) => {
            const selected = active === s.key;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => handleSelect(s.key)}
                aria-selected={selected}
                className={`text-left px-0 py-1 bg-transparent transition-colors cursor-pointer select-none ${selected ? "text-[#27AAE1]" : "text-gray-200 hover:text-white"}`}
              >
                <span className="text-2xl sm:text-3xl font-light">{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* Results panel under the menu */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 transition-all duration-200 ${
            phase === "out" ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
          }`}
        >
          {activePeople.length > 0 ? (
            activePeople.map((p) => <PersonCard key={p.id} p={p} />)
          ) : (
            <div className="col-span-full text-gray-400">Няма добавени хора.</div>
          )}
        </div>
      </div>
    </section>
  );
}
