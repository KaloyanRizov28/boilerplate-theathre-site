// src/components/layout/header.js
'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '../../../lib/supabase/client'

export function Header() {
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
      { name: 'Творчески състав', href: '/about?section=creative' },
      { name: 'Технически състав', href: '/about?section=technical' },
      { name: 'Ръководство', href: '/about?section=leadership' },
      { name: 'Административен състав', href: '/about?section=administrative' },
      { name: 'За театъра', href: '/about' },
      { name: 'Сцени', href: '/scenes' },
    ],
  }


  return (
    <>
      {/* Header */}
      <header className="sticky top-0 left-0 w-full bg-theater-dark border-b border-gray-700 z-50">
        <div className="w-full px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Hamburger Menu */}
            <button
              onClick={() => {
                if (isMenuOpen) setActiveMenu('root')
                setIsMenuOpen(!isMenuOpen)
              }}
              className="flex flex-col space-y-1 p-2 z-50 relative -ml-1" // `relative` is fine here on the button itself
            >
              <div className={`w-6 h-0.5 bg-theater-hover transition-all duration-300 ${
                isMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}></div>
              <div className={`w-6 h-0.5 bg-theater-hover transition-all duration-300 ${
                isMenuOpen ? 'opacity-0' : ''
              }`}></div>
              <div className={`w-6 h-0.5 bg-theater-hover transition-all duration-300 ${
                isMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}></div>
            </button>

            {/* Theater Title */}
            <Link href="/" className="text-center">
              <div className="text-sm font-light tracking-wide text-theater-hover">
                <div>МУЗИКАЛНО-ДРАМАТИЧЕН ТЕАТЪР</div>
                <div>"КОНСТАНТИН КИСИМОВ"</div>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              {user && (
                <span className="text-sm text-white">
                  {user.email}
                  {user.app_metadata?.is_admin ? ' (Admin)' : ''}
                </span>
              )}
              {user && (
                <button onClick={handleLogout} className="text-theater-accent">
                  Log out
                </button>
              )}
              <div className="w-12 h-12 flex items-center justify-center -mr-1">
                <Image
                  src="/logo.svg"
                  alt="Theater Logo"
                  width={48}
                  height={48}
                  className="text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Full Page Overlay Menu */}
      <div className={`fixed top-0 left-0 w-screen h-screen overflow-x-hidden z-40 transform transform-gpu transition-transform duration-500 ease-in-out ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-10"
          style={{
            backgroundImage: "url('/logo.svg')",
            backgroundSize: '60vw 60vw',
            backgroundPosition: 'bottom -25vw right -3vw'
          }}
        />
        
        {/* Dark Overlay for text readability */}
        <div className="absolute inset-0 bg-theater-dark bg-opacity-70" />

        {/* Menu Content - Staircase with Overshoot Animation */}
        <div className="relative z-20 flex flex-col justify-center h-full pl-8 pr-16 md:pl-24 md:pr-8 overflow-y-auto overflow-x-hidden py-20 md:py-0">
          {activeMenu !== 'root' && (
            <button
              aria-label="Назад"
              onClick={() => setActiveMenu('root')}
              className="text-white text-2xl md:text-3xl font-light tracking-wide hover:text-theater-hover transition-colors duration-300 flex items-center mb-4 sm:mb-6"
            >
              <span className="inline-block mr-3">←</span>
              <span className="sr-only">Назад</span>
            </button>
          )}

          {menus[activeMenu].map((item, index) => {
            const startPosition = -250 + (index * 40); // Staircase start positions
            const finalPosition = 0; // Final aligned position
            const initialDelay = index * 15; // Slightly faster stagger for submenu/mobile

            return (
              <div
                key={item.name}
                className="mb-4 sm:mb-5 md:mb-8"
                style={{
                  transform: isMenuOpen 
                    ? `translateX(${finalPosition}px)` 
                    : `translateX(${startPosition}px)`,
                  opacity: isMenuOpen ? 1 : 0,
                  // Custom keyframe animation for the overshoot effect
                  animation: isMenuOpen ? `staircaseEntry-${index} 0.45s ease-out ${initialDelay}ms forwards` : 'none',
                }}
              >
                {item.submenu ? (
                  <button
                    onClick={() => setActiveMenu(item.submenu)}
                    className="text-left text-white text-3xl sm:text-4xl md:text-5xl font-light tracking-wide hover:text-theater-hover transition-colors duration-300 block"
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="text-white text-3xl sm:text-4xl md:text-5xl font-light tracking-wide hover:text-theater-hover transition-colors duration-300 block"
                    onClick={() => { setIsMenuOpen(false); setActiveMenu('root'); }}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* CSS Keyframes for staircase animation */}
        <style jsx>{`
          @keyframes staircaseEntry-0 {
            0% { transform: translateX(-250px); opacity: 0; }
            60% { transform: translateX(25px); opacity: 1; }
            100% { transform: translateX(0px); opacity: 1; }
          }
          @keyframes staircaseEntry-1 {
            0% { transform: translateX(-210px); opacity: 0; }
            60% { transform: translateX(30px); opacity: 1; }
            100% { transform: translateX(0px); opacity: 1; }
          }
          @keyframes staircaseEntry-2 {
            0% { transform: translateX(-170px); opacity: 0; }
            60% { transform: translateX(35px); opacity: 1; }
            100% { transform: translateX(0px); opacity: 1; }
          }
          @keyframes staircaseEntry-3 {
            0% { transform: translateX(-130px); opacity: 0; }
            60% { transform: translateX(40px); opacity: 1; }
            100% { transform: translateX(0px); opacity: 1; }
          }
          @keyframes staircaseEntry-4 {
            0% { transform: translateX(-90px); opacity: 0; }
            60% { transform: translateX(30px); opacity: 1; }
            100% { transform: translateX(0px); opacity: 1; }
          }
          @keyframes staircaseEntry-5 {
            0% { transform: translateX(-50px); opacity: 0; }
            60% { transform: translateX(25px); opacity: 1; }
            100% { transform: translateX(0px); opacity: 1; }
          }
          @keyframes staircaseEntry-6 {
            0% { transform: translateX(-30px); opacity: 0; }
            60% { transform: translateX(20px); opacity: 1; }
            100% { transform: translateX(0px); opacity: 1; }
          }
          @keyframes staircaseEntry-7 {
            0% { transform: translateX(-20px); opacity: 0; }
            60% { transform: translateX(15px); opacity: 1; }
            100% { transform: translateX(0px); opacity: 1; }
          }
        `}</style>
      </div>
    </>
  )
}
