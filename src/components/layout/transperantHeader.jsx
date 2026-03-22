// src/components/layout/TransparentHeader.js
'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '../../../lib/supabase/client'

export function TransparentHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState('root')
  const [user, setUser] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.reload()
  }

  const menus = {
    root: [
      { name: 'Програма', href: '/program' },
      { name: 'За нас', submenu: 'about' },
      { name: 'Билети', href: '/tickets' },
      { name: 'Контакти', href: '/contact' },
    ],
    about: [
      { name: 'Състав', href: '/cast' },
      { name: 'За театъра', href: '/about' },
      { name: 'Сцени', href: '/scenes' },
    ],
  }


  const iconBaseClass = 'w-6 h-0.5 transition-all duration-300';


  return (
    <>
      {/* Header - Now Transparent and FIXED with subtle gradient for readability */}
      <header className="fixed top-0 left-0 w-full bg-gradient-to-b from-black/80 via-black/30 to-transparent z-50">
        <div className="w-full px-4 sm:px-8 lg:px-12" style={{ height: '118px' }}>
          <div className="flex justify-between items-center h-full relative">
            {/* Hamburger Menu */}
            <button
              onClick={() => {
                if (isMenuOpen) setActiveMenu('root')
                setIsMenuOpen(!isMenuOpen)
              }}
              className="group flex flex-col space-y-1.5 p-2 z-50 relative -ml-1"
            >
              <div
                className={`w-8 h-[2px] transition-all duration-300 ${isMenuOpen ? 'bg-[#27AAE1] rotate-45 translate-y-[8px]' : 'bg-white'
                  } group-hover:bg-[#27AAE1]`}
              ></div>
              <div
                className={`w-8 h-[2px] transition-all duration-300 ${isMenuOpen ? 'bg-[#27AAE1] opacity-0' : 'bg-white'
                  } group-hover:bg-[#27AAE1]`}
              ></div>
              <div
                className={`w-8 h-[2px] transition-all duration-300 ${isMenuOpen ? 'bg-[#27AAE1] -rotate-45 -translate-y-[8px]' : 'bg-white'
                  } group-hover:bg-[#27AAE1]`}
              ></div>
            </button>

            {/* Theater Title Centered */}
            <Link href="/" className="hidden lg:block text-center group absolute left-1/2 -translate-x-1/2 z-50" aria-label="Начало">
              <div className="text-sm font-light tracking-[0.1em] text-white/95 group-hover:text-[#27AAE1] transition-colors duration-300 drop-shadow-md">
                <div>МУЗИКАЛНО-ДРАМАТИЧЕН ТЕАТЪР</div>
                <div className="mt-0.5">"КОНСТАНТИН КИСИМОВ"</div>
              </div>
            </Link>

            <div className="flex items-center gap-4 z-50 relative">
              {user && (
                <span className="text-sm text-white">
                  {user.email}
                  {user.app_metadata?.is_admin ? ' (Admin)' : ''}
                </span>
              )}
              {user && (
                <button onClick={handleLogout} className="text-[#27AAE1] hover:text-white transition-colors duration-200">
                  Log out
                </button>
              )}
              <div className="w-14 h-14 flex items-center justify-center -mr-1 hover:scale-105 transition-transform duration-300 drop-shadow-xl">
                <Link href="/" aria-label="Начало">
                  <Image
                    src="/logo.svg"
                    alt="Лого на театъра"
                    width={56}
                    height={56}
                    priority
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Full Page Overlay Menu */}
      <div className={`fixed top-0 left-0 w-full h-full z-40 transform transition-transform duration-500 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        {/* Background Image for menu */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-10"
          style={{
            backgroundImage: "url('/logo.svg')", // Path from /public folder
            backgroundSize: '60vw auto', // Adjusted for potentially non-square logo
            backgroundPosition: 'bottom -15vw right -10vw' // Adjusted for potentially better visual
          }}
          aria-hidden="true"
        />

        {/* Dark Overlay for text readability in menu */}
        <div className="absolute inset-0 bg-theater-dark bg-opacity-80 z-20" /> {/* Slightly increased opacity */}

        {/* Menu Content */}
        <nav className="relative z-30 flex flex-col justify-center h-full pl-12 sm:pl-16 md:pl-24" aria-label="Основна навигация">
          {activeMenu !== 'root' && (
            <button
              aria-label="Назад"
              onClick={() => setActiveMenu('root')}
              className="text-white text-2xl md:text-3xl font-light tracking-wide hover:text-[#27AAE1] transition-colors duration-300 flex items-center mb-6"
            >
              <span className="inline-block mr-3">←</span>
              <span className="sr-only">Назад</span>
            </button>
          )}
          {menus[activeMenu].map((item, index) => {
            const startPosition = -250 + (index * 40); // Initial off-screen position
            const finalPosition = 0; // Final on-screen position
            // Animation delays can be fine-tuned
            const initialDelay = 100 + index * 50; // Staggered delay for items appearing
            const closeDelay = index * 30; // Staggered delay for items disappearing

            return (
              <div
                key={item.name}
                className="mb-6 md:mb-8" // Adjusted margin
                style={{
                  transform: isMenuOpen
                    ? `translateX(${finalPosition}px)`
                    : `translateX(${startPosition}px)`,
                  opacity: isMenuOpen ? 1 : 0,
                  transition: isMenuOpen
                    ? `transform 0.5s cubic-bezier(0.23, 1, 0.32, 1) ${initialDelay}ms, opacity 0.4s ease-out ${initialDelay}ms`
                    : `transform 0.3s ease-in ${closeDelay}ms, opacity 0.2s ease-in ${closeDelay}ms`,
                  // Using CSS animation for overshoot for more control if needed, or stick to transition
                  // animation: isMenuOpen ? `staircaseEntry-${index} 0.7s cubic-bezier(0.23, 1, 0.32, 1) ${initialDelay}ms forwards` : 'none',
                }}
              >
                {item.submenu ? (
                  <button
                    onClick={() => setActiveMenu(item.submenu)}
                    className="text-left text-white text-3xl sm:text-4xl md:text-5xl font-light tracking-wide hover:text-[#27AAE1] transition-colors duration-300 block py-1"
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="text-white text-3xl sm:text-4xl md:text-5xl font-light tracking-wide hover:text-[#27AAE1] transition-colors duration-300 block py-1"
                    onClick={() => { setIsMenuOpen(false); setActiveMenu('root'); }}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* Removed inline <style jsx> for staircase keyframes. 
            It's generally better to keep animations in global CSS or a CSS module
            if they are complex or reused. If you prefer inline, you can add them back.
            For simplicity with Tailwind, you might rely on transition delays and curves.
            If you reinstate keyframes, ensure they match the number of navigation items.
        */}
      </div>
    </>
  );
}
