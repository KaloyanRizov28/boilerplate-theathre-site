// src/components/layout/footer.js

import Arrow from "@/components/ui/icons/Arrow.svg"
import Link from "next/link"
import Image from "next/image"

export function Footer() {
  const linkStyle = "text-white hover:text-white/70 transition-colors flex items-center group text-sm py-1";
  const arrowStyle = "inline-block transition-transform duration-300 group-hover:translate-x-1 w-4 h-4 ml-1 fill-current";

  return (
    <footer className="bg-[#27AAE1] text-white">
      {/* Main footer content */}
      <div className="px-6 py-10">
        <div className="grid grid-cols-2 gap-8">

          {/* Left column: Policy links */}
          <div className="flex flex-col gap-1">
            <Link href="/privacy-policy" className={linkStyle}>
              <span className="group-hover:text-white/70">Политика за поверителност</span>
              <Arrow className={arrowStyle} />
            </Link>
            <Link href="/cookie-policy" className={linkStyle}>
              <span className="group-hover:text-white/70">Политика за бисквитки</span>
              <Arrow className={arrowStyle} />
            </Link>
            <Link href="/terms" className={linkStyle}>
              <span className="group-hover:text-white/70">Общи условия</span>
              <Arrow className={arrowStyle} />
            </Link>
          </div>

          {/* Right column: Contact info + Logo */}
          <div className="flex flex-col items-end gap-4">
            <div className="text-sm text-white/90 text-right space-y-1">
              <p>5000 гр. Велико Търново Ул. „Васил Левски" 4</p>
              <p>mdtvtarnovo@gmail.com</p>
              <p>062625851</p>
            </div>
            <div className="w-14 h-14 relative flex-shrink-0">
              <Image
                src="/logo.svg"
                alt="МДТ Лого"
                fill
                className="object-contain brightness-0 invert"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Copyright bar */}
      <div className="bg-[#1e95c8] py-3 text-center text-white text-sm">
        МДТ &quot;Константин Кисимов&quot; © 2025
      </div>
    </footer>
  );
}
