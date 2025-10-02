'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

// Smoother, simpler crossfade hero without layout thrash
const HeroSection = ({ items = [], item }) => {
  const dataItems = Array.isArray(items) && items.length > 0 ? items : (item ? [item] : [])

  // Two persistent slots to avoid swapping src on the visible layer
  const [slotA, setSlotA] = useState(null)
  const [slotB, setSlotB] = useState(null)
  const [frontIsA, setFrontIsA] = useState(true)
  const [isFading, setIsFading] = useState(false)
  const [incomingIndex, setIncomingIndex] = useState(null)
  const hasMultiple = dataItems.length > 1

  const timerRef = useRef(null)
  const activeIdxRef = useRef(0)
  const fadingRef = useRef(false)
  const incomingRef = useRef(null)

  // Helper to identify the play key (slug/href preferred, fallback to title)
  const playKey = (it) => {
    if (!it) return ''
    const href = it.href || ''
    if (href.startsWith('/repertoar/')) return href
    return it.title || href || it.image || ''
  }

  // Initialize to a random slide and set up the timer
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current)

    if (!dataItems.length) {
      setSlotA(null); setSlotB(null)
      setFrontIsA(true); setIsFading(false)
      setIncomingIndex(null); activeIdxRef.current = 0
      return
    }

    const start = hasMultiple ? Math.floor(Math.random() * dataItems.length) : 0
    activeIdxRef.current = start
    setFrontIsA(true)
    setIsFading(false)
    setIncomingIndex(null)
    setSlotA(dataItems[start])
    setSlotB(null)

    if (!hasMultiple) return

    timerRef.current = setInterval(() => {
      if (fadingRef.current) return
      if (incomingRef.current !== null) return

      const cur = activeIdxRef.current
      const curKey = playKey(dataItems[cur])

      // Find next with different play key
      let next = (cur + 1) % dataItems.length
      let safety = 0
      while (safety < dataItems.length - 1) {
        const nextKey = playKey(dataItems[next])
        if (nextKey && nextKey !== curKey) break
        next = (next + 1) % dataItems.length
        safety++
      }
      if (next === cur) return // nothing different to show

      // Prepare hidden slot with incoming item
      incomingRef.current = next
      setIncomingIndex(next)
      const incomingItem = dataItems[next]
      if (frontIsA) setSlotB(incomingItem)
      else setSlotA(incomingItem)
    }, 6000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [dataItems.length, hasMultiple])

  // Keep refs in sync
  useEffect(() => { fadingRef.current = isFading }, [isFading])
  useEffect(() => { incomingRef.current = incomingIndex }, [incomingIndex])

  // Start fade when the hidden image is loaded
  const handleHiddenLoaded = () => {
    if (incomingRef.current === null || fadingRef.current) return
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsFading(true))
    })
    // Finalize after CSS duration (keep in sync with duration-700)
    setTimeout(() => {
      setFrontIsA((prev) => !prev)
      activeIdxRef.current = incomingRef.current ?? activeIdxRef.current
      setIncomingIndex(null)
      incomingRef.current = null
      setIsFading(false)
    }, 700)
  }

  // Derive data for layers and text (show incoming text during fade)
  const frontItem = frontIsA ? slotA : slotB
  const backItem = frontIsA ? slotB : slotA
  const displayItem = (isFading && backItem) ? backItem : (frontItem || backItem)
  const title = displayItem?.title || 'НИРВАНА'
  const date = displayItem?.date || '20.06.25'
  const time = displayItem?.time || '19:00'
  const venue = displayItem?.venue || 'СЦЕНА'
  const href = displayItem?.href || '#'

  return (
    <div className="flex flex-col">
      {/* Keep a stable height to prevent layout jank */}
      <section className="relative w-full h-[65vh] md:h-[75vh] lg:h-[80vh] overflow-hidden bg-black">
        {/* Layer A */}
        <div
          className={`absolute inset-0 transition-[opacity,transform] duration-700 ease-out ${
            (isFading ? (frontIsA ? 'opacity-0' : 'opacity-100') : (frontIsA ? 'opacity-100' : 'opacity-0'))
          } ${(!frontIsA && !isFading) ? 'scale-105' : 'scale-100'}`}
          style={{ willChange: 'opacity, transform' }}
        >
          {slotA && (
            <Image
              key={`A-${slotA.image || '/hero.jpg'}`}
              src={slotA.image || '/hero.jpg'}
              alt={slotA.title || ''}
              fill
              priority={!hasMultiple && frontIsA}
              className="object-cover object-center select-none pointer-events-none"
              sizes="100vw"
              quality={90}
              onLoadingComplete={() => {
                // Trigger only if A is hidden and being prepared
                if (!frontIsA && incomingIndex !== null) handleHiddenLoaded()
              }}
            />
          )}
        </div>

        {/* Layer B */}
        <div
          className={`absolute inset-0 transition-[opacity,transform] duration-700 ease-out ${
            (isFading ? (!frontIsA ? 'opacity-0' : 'opacity-100') : (!frontIsA ? 'opacity-100' : 'opacity-0'))
          } ${(frontIsA && !isFading) ? 'scale-105' : 'scale-100'}`}
          style={{ willChange: 'opacity, transform' }}
        >
          {slotB && (
            <Image
              key={`B-${slotB.image || '/hero.jpg'}`}
              src={slotB.image || '/hero.jpg'}
              alt={slotB.title || ''}
              fill
              priority={!hasMultiple && !frontIsA}
              className="object-cover object-center select-none pointer-events-none"
              sizes="100vw"
              quality={90}
              onLoadingComplete={() => {
                // Trigger only if B is hidden and being prepared
                if (frontIsA && incomingIndex !== null) handleHiddenLoaded()
              }}
            />
          )}
        </div>

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/30 z-[1]"></div>

        {/* Content */}
        <div className="absolute bottom-3 left-6 z-10 w-full">
          <a href={href} className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded">
            <h1 className="text-4xl sm:text-6xl font-bold text-white ml-[-0.03em]">
              {title}
            </h1>
          </a>
        </div>
      </section>

      {/* Meta row */}
      <div className="bg-theater-dark text-white py-2">
        <div className="flex space-x-4 text-base pl-6">
          <span>{date}</span>
          <span>{time}</span>
          <span>{venue}</span>
        </div>
      </div>
    </div>
  )
}

export default HeroSection;
