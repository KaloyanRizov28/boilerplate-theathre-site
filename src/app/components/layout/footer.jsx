// src/components/layout/footer.js

import Arrow from "@/app/components/ui/icons/Arrow.svg"
import Link from "next/link" // Using the current Next.js Link component

export function Footer() {
  // Define styles for links that *do* have arrows
  const linkStyleWithArrow = "text-gray-300 hover:text-white transition-colors flex items-center group text-sm py-1";
  const arrowStyle = "inline-block transition-transform duration-300 group-hover:translate-x-1 w-4 h-4 ml-2";

  return (
    <footer className="bg-theater-dark py-12 text-white"> {/* Adjusted padding for a better look */}
      <div className="px-12"> {/* Kept px-6, added max-width/center */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Information Section (with arrows & new Link syntax) */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Информация</h3>
            <div className="space-y-2">
              {/* Privacy Policy Link - New Syntax */}
              <Link href="/privacy-policy" className={linkStyleWithArrow}>
                  Политика за неприкосновеност и "бисквитки"
                  <Arrow className={arrowStyle} />
              </Link>
              {/* Terms and Conditions Link - New Syntax */}
              <Link href="/terms" className={linkStyleWithArrow}>
                  Общи условия
                  <Arrow className={arrowStyle} />
              </Link>
            </div>
          </div>

          {/* Contacts Section (original style, no arrows, no emoticons) */}
          <div className="text-right">
            <h3 className="text-xl font-semibold mb-4 w-full">Контакти</h3> {/* Kept title for consistency */}
            <div className="text-gray-400 text-sm mb-4 space-y-2"> {/* Used space-y-2 to mimic original <p> spacing */}
              <p>1000 гр. Велико Търново ул. "Васил Априлов" 4</p>
              <p>Тел: 0882555665</p> {/* Removed emoticon, added 'Тел:' */}
              <p>Имейл: info@theater-bg.com</p> {/* Removed emoticon, added 'Имейл:' */}
            </div>
            {/* Trophy icon removed */}
          </div>
          
        </div>

        {/* Copyright Section */}
        <div className="text-center text-gray-500 text-xs mt-8 pt-8 border-t border-gray-800">
          МДТ "Константин Кисимов" © 2025
        </div>
      </div>
    </footer>
  )
}