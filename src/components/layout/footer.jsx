// src/components/layout/footer.js

import Arrow from "@/components/ui/icons/Arrow.svg"
import Link from "next/link"
import Image from "next/image"

export function Footer() {
  const linkStyle = "text-white hover:text-[#27AAE1] transition-colors flex items-center group text-sm py-1";
  const arrowStyle = "inline-block transition-transform duration-300 group-hover:translate-x-1 w-4 h-4 ml-1 fill-current";

  return (
    <footer className="bg-[#171717] border-t border-white/5 text-white">
      {/* Main footer content */}
      <div className="px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-8">
          {/* Left column: Policy links */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/privacy-policy" className={linkStyle}>
              <span>Политика за поверителност</span>
              <Arrow className={arrowStyle} />
            </Link>
            <Link href="/cookie-policy" className={linkStyle}>
              <span>Политика за бисквитки</span>
              <Arrow className={arrowStyle} />
            </Link>
            <Link href="/terms" className={linkStyle}>
              <span>Общи условия</span>
              <Arrow className={arrowStyle} />
            </Link>
          </div>

          {/* Right column: Contact info + Logo */}
          <div className="flex flex-col items-center md:items-end gap-6 md:gap-4">
            <div className="text-sm text-white/90 text-center md:text-right space-y-2 md:space-y-1">
              <p>5000 гр. Велико Търново Ул. „Васил Левски" 4</p>
              <p>mdtvtarnovo@gmail.com</p>
              <p>062625851</p>
            </div>
            <div className="w-16 h-16 md:w-14 md:h-14 relative flex-shrink-0 group">
              <Image
                src="/logo.svg"
                alt="МДТ Лого"
                fill
                className="object-contain"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Copyright bar */}
      <div className="py-4 text-center text-[#27AAE1] text-sm font-light border-t border-white/5">
        МДТ &quot;Константин Кисимов&quot; © {new Date().getFullYear()}
      </div>
    </footer>
  );
}
