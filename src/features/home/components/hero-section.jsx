'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function HeroSection({ items = [] }) {
  const dataItems = Array.isArray(items) ? items : []

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

  function getItemKey(item) {
    if (!item) return ''
    const href = item.href || ''
    if (href.startsWith('/repertoar/')) return href
    return item.title || href || item.image || ''
  }

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
      const curKey = getItemKey(dataItems[cur])

      let next = (cur + 1) % dataItems.length
      let safety = 0
      while (safety < dataItems.length - 1) {
        const nextKey = getItemKey(dataItems[next])
        if (nextKey && nextKey !== curKey) break
        next = (next + 1) % dataItems.length
        safety++
      }
      if (next === cur) return // nothing different to show

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
  }, [dataItems, hasMultiple])

  useEffect(() => { fadingRef.current = isFading }, [isFading])
  useEffect(() => { incomingRef.current = incomingIndex }, [incomingIndex])

  const handleHiddenLoaded = () => {
    if (incomingRef.current === null || fadingRef.current) return
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsFading(true))
    })
    setTimeout(() => {
      setFrontIsA((prev) => !prev)
      activeIdxRef.current = incomingRef.current ?? activeIdxRef.current
      setIncomingIndex(null)
      incomingRef.current = null
      setIsFading(false)
    }, 700)
  }

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
      <section className="relative w-full h-[420px] sm:h-[687px] overflow-hidden bg-black">
        <div
          className={`absolute inset-0 transition-[opacity,transform] duration-700 ease-out ${(isFading ? (frontIsA ? 'opacity-0' : 'opacity-100') : (frontIsA ? 'opacity-100' : 'opacity-0'))
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
              onLoad={() => {
                if (!frontIsA && incomingIndex !== null) handleHiddenLoaded()
              }}
            />
          )}
        </div>

        <div
          className={`absolute inset-0 transition-[opacity,transform] duration-700 ease-out ${(isFading ? (!frontIsA ? 'opacity-0' : 'opacity-100') : (!frontIsA ? 'opacity-100' : 'opacity-0'))
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
              onLoad={() => {
                if (frontIsA && incomingIndex !== null) handleHiddenLoaded()
              }}
            />
          )}
        </div>

        <div className="absolute inset-0 bg-black/30 z-[1]" />

        <div className="absolute bottom-3 z-10 w-full flex justify-center px-8">
          <div className="max-w-[1474px] w-full">
            <Link
              href={href}
              className="group/title inline-block rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            >
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold ml-[-0.03em] leading-none transition-all duration-700 bg-gradient-to-r from-[#27AAE1] from-50% to-white to-50% bg-[length:200%_100%] bg-[position:100%_0] group-hover/title:bg-[position:0_0] bg-clip-text text-transparent">
                {title}
              </h1>
            </Link>
          </div>
        </div>
      </section>

      <div className="bg-theater-dark text-white py-4 border-b border-white/5">
        <div className="flex justify-center px-8">
          <div className="max-w-[1474px] w-full">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm sm:text-base text-gray-300 font-light tracking-wide uppercase">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#27AAE1]" />
                {date}
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#27AAE1]" />
                {time}
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#27AAE1]" />
                {venue}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
