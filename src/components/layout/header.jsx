// src/components/layout/header.js
'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '../../../lib/supabase/client'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.reload()
  }

  const navigation = [
    { name: 'Програма', href: '/program' },
    { name: 'За нас', href: '/about' },
    { name: 'Сцени', href: '/scenes' },
    { name: 'Билети', href: '/tickets' },
    { name: 'Контакти', href: '/contact' },
  ]

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 left-0 w-full bg-theater-dark border-b border-gray-700 z-50">
        <div className="w-full px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Hamburger Menu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex flex-col space-y-1 p-2 z-50 relative -ml-1" // `relative` is fine here on the button itself
            >
              <div className={`w-6 h-0.5 bg-theater-grey transition-all duration-300 ${
                isMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}></div>
              <div className={`w-6 h-0.5 bg-theater-grey transition-all duration-300 ${
                isMenuOpen ? 'opacity-0' : ''
              }`}></div>
              <div className={`w-6 h-0.5 bg-theater-grey transition-all duration-300 ${
                isMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}></div>
            </button>

            {/* Theater Title */}
            <Link href="/" className="text-center">
              <div className="text-sm font-light tracking-wide text-white">
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
      <div className={`fixed top-0 left-0 w-full h-full z-40 transform transition-transform duration-500 ease-in-out ${
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
        <div className="relative z-20 flex flex-col justify-center h-full pl-16 md:pl-24">
          {navigation.map((item, index) => {
            const startPosition = -250 + (index * 40); // Staircase start positions
            const finalPosition = 0; // Final aligned position
            const initialDelay = index * 20; // Staggered entry
            const overshootDelay = index ; // Overshoot happens 300ms after entry starts
            
            return (
              <div
                key={item.name}
                className="mb-8"
                style={{
                  transform: isMenuOpen 
                    ? `translateX(${finalPosition}px)` 
                    : `translateX(${startPosition}px)`,
                  opacity: isMenuOpen ? 1 : 0,
                  transition: isMenuOpen 
                    ? `transform 0.4s ease-out ${initialDelay}ms, transform 0.3s ease-in-out ${overshootDelay}ms, opacity 0.3s ease-out ${initialDelay}ms`
                    : 'all 0.2s ease-in',
                  // Custom keyframe animation for the overshoot effect
                  animation: isMenuOpen ? `staircaseEntry-${index} 1s ease-out ${initialDelay}ms forwards` : 'none',
                }}
              >
                <Link
                  href={item.href}
                  className="text-white text-4xl md:text-5xl font-light tracking-wide hover:text-gray-300 transition-colors duration-300 block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
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
        `}</style>
      </div>
    </>
  )
}