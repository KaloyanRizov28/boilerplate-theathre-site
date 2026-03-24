'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ProgramCalendar from './program-calendar';

const parseShowDateToUTC = (dateStr) => {
  if (!dateStr) return null
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) {
    return null
  }
  return date
}

const MonthlyProgramGuide = ({ shows = [] }) => {
  const [selectedDate, setSelectedDate] = useState(null)

  const [activeDisplayMonth, setActiveDisplayMonth] = useState(new Date().getUTCMonth())
  const [activeDisplayYear, setActiveDisplayYear] = useState(new Date().getUTCFullYear())

  const [calendarWindowBaseMonth, setCalendarWindowBaseMonth] = useState(new Date().getUTCMonth())
  const [calendarWindowBaseYear, setCalendarWindowBaseYear] = useState(new Date().getUTCFullYear())

  const [activeFilter, setActiveFilter] = useState('all')
  
  const processedShows = useMemo(() => {
    const entries = []
    shows.forEach(show => {
      const perfs = Array.isArray(show.performances) ? [...show.performances] : []
      perfs.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
      if (perfs.length === 0) return
      perfs.forEach(perf => {
        const fullDate = parseShowDateToUTC(perf?.time ?? null)
        if (!fullDate || isNaN(fullDate.getTime())) return
        entries.push({
          ...show,
          fullDate,
          time: perf?.time
            ? new Date(perf.time).toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Sofia' })
            : '',
          venue: (perf?.venues?.name || perf?.venue) ?? '',
          performanceId: perf?.id ?? `${show.id}-${perf?.time}`,
        })
      })
    })
    return entries
  }, [shows])

  useEffect(() => {
    if (processedShows.length === 0) return

    const monthMap = new Map()
    processedShows.forEach(s => {
      if (!s.fullDate) return
      const y = s.fullDate.getUTCFullYear()
      const m = s.fullDate.getUTCMonth()
      const key = y * 12 + m
      if (!monthMap.has(key)) monthMap.set(key, { y, m })
    })

    if (monthMap.size === 0) return

    const months = Array.from(monthMap.values()).sort((a, b) => (a.y * 12 + a.m) - (b.y * 12 + b.m))
    const now = new Date()
    const nowKey = now.getUTCFullYear() * 12 + now.getUTCMonth()

    let target = months.find(({ y, m }) => (y * 12 + m) >= nowKey)
    if (!target) target = months[months.length - 1]

    setCalendarWindowBaseMonth(target.m)
    setCalendarWindowBaseYear(target.y)
    setActiveDisplayMonth(target.m)
    setActiveDisplayYear(target.y)
    setSelectedDate(null)

  }, [processedShows])

  const showsByDateForActiveMonth = useMemo(() => {
    const grouped = {};
    processedShows.forEach(show => {
      if (activeFilter !== 'all' && show.category !== activeFilter) { return; }
      if (show.fullDate && show.fullDate.getUTCMonth() === activeDisplayMonth && show.fullDate.getUTCFullYear() === activeDisplayYear) {
        const dateKey = `${show.fullDate.getUTCFullYear()}-${(show.fullDate.getUTCMonth() + 1).toString().padStart(2, '0')}-${show.fullDate.getUTCDate().toString().padStart(2, '0')}`;
        if (!grouped[dateKey]) { grouped[dateKey] = []; }
        grouped[dateKey].push(show);
      }
    });
    const sortedDateKeys = Object.keys(grouped).sort((a, b) =>
      new Date(Date.UTC(parseInt(a.substring(0, 4)), parseInt(a.substring(5, 7)) - 1, parseInt(a.substring(8, 10)))).getUTCDate() -
      new Date(Date.UTC(parseInt(b.substring(0, 4)), parseInt(b.substring(5, 7)) - 1, parseInt(b.substring(8, 10)))).getUTCDate()
    );
    const orderedGrouped = {};
    sortedDateKeys.forEach(key => { orderedGrouped[key] = grouped[key]; });
    return orderedGrouped;
  }, [activeDisplayMonth, activeDisplayYear, activeFilter, processedShows]);

  const daysWithShowsInActiveMonth = useMemo(() => Object.keys(showsByDateForActiveMonth).map(dateKey => parseInt(dateKey.split('-')[2])), [showsByDateForActiveMonth]);

  const programToDisplay = useMemo(() => {
    if (selectedDate) {
      if (selectedDate.getUTCMonth() !== activeDisplayMonth || selectedDate.getUTCFullYear() !== activeDisplayYear) {
        return {};
      }
      const dateKey = `${selectedDate.getUTCFullYear()}-${(selectedDate.getUTCMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getUTCDate().toString().padStart(2, '0')}`;
      return showsByDateForActiveMonth[dateKey] ? { [dateKey]: showsByDateForActiveMonth[dateKey] } : {};
    }
    return showsByDateForActiveMonth;
  }, [selectedDate, showsByDateForActiveMonth, activeDisplayMonth, activeDisplayYear]);

  const handleDaySelection = (dayNumber) => {
    setSelectedDate(new Date(Date.UTC(activeDisplayYear, activeDisplayMonth, dayNumber)));
  };

  const handleMonthNavigation = (month, year) => {
    setActiveDisplayMonth(month);
    setActiveDisplayYear(year);
    setSelectedDate(null);
  };

  const getDayOfWeekBG = (dateString_YYYY_MM_DD) => {
    const parts = dateString_YYYY_MM_DD.split('-').map(Number);
    const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    return new Intl.DateTimeFormat('bg-BG', { weekday: 'long', timeZone: 'UTC' }).format(date);
  };

  return (
    <section className="bg-theater-dark text-white px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-[1474px] mx-auto w-full">
        <div className='flex justify-center my-6'>
          <ProgramCalendar
            currentMonth={activeDisplayMonth}
            currentYear={activeDisplayYear}
            baseMonth={calendarWindowBaseMonth}
            baseYear={calendarWindowBaseYear}
            daysWithShows={daysWithShowsInActiveMonth}
            onDayClick={handleDaySelection}
            onMonthChange={handleMonthNavigation}
            selectedDayNumber={selectedDate && selectedDate.getUTCMonth() === activeDisplayMonth && selectedDate.getUTCFullYear() === activeDisplayYear ? selectedDate.getUTCDate() : undefined}
          />
        </div>
        <div className="flex flex-wrap justify-left gap-x-6 gap-y-3 sm:gap-x-8 my-6">
          <button onClick={() => { setActiveFilter('all'); setSelectedDate(null); }} className={`text-lg sm:text-xl font-light transition-all duration-300 ${activeFilter === 'all' ? 'text-white' : 'text-gray-500 hover:text-[#27AAE1]'}`}>ВСИЧКИ</button>
          <button onClick={() => { setActiveFilter('theater'); setSelectedDate(null); }} className={`text-lg sm:text-xl font-light transition-all duration-300 ${activeFilter === 'theater' ? 'text-white' : 'text-gray-500 hover:text-[#27AAE1]'}`}>ТЕАТЪР</button>
          <button onClick={() => { setActiveFilter('music'); setSelectedDate(null); }} className={`text-lg sm:text-xl font-light transition-all duration-300 ${activeFilter === 'music' ? 'text-white' : 'text-gray-500 hover:text-[#27AAE1]'}`}>МУЗИКА</button>
        </div>
        {selectedDate && (
          <div className="text-center mb-6">
            <button onClick={() => setSelectedDate(null)} className="text-yellow-400 hover:text-[#27AAE1] underline text-sm sm:text-base">
              Покажи всички за месеца
            </button>
          </div>
        )}
        <div className="space-y-8 min-h-[50rem]">
          {Object.keys(programToDisplay).length === 0 && (
            <p className="text-xl sm:text-2xl text-gray-400 text-center py-16">
              {selectedDate ? "Няма представления за избраната дата и филтър." : "Няма налични представления за този месец и филтър."}
            </p>
          )}
          {Object.entries(programToDisplay).map(([dateKey, showsForDay]) => {
            const dayNumber = parseInt(dateKey.split('-')[2]);
            return (
              <div key={dateKey} className="flex flex-col sm:flex-row items-start gap-x-4 sm:gap-x- gap-y-4">
                <div className="flex-shrink-0 w-full sm:w-24 text-left sm:text-right pt-2 border-b sm:border-b-0 border-white/10 pb-2 sm:pb-0">
                  <div className="flex sm:flex-col items-baseline gap-2 sm:gap-0">
                    <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-none tabular-nums">{String(dayNumber).padStart(2, '0')}</div>
                    <div className="text-sm sm:text-sm text-[#27AAE1] uppercase tracking-wider font-medium">{getDayOfWeekBG(dateKey)}</div>
                  </div>
                </div>
                <div className="flex-grow w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {showsForDay.map(show => (
                    <div key={`${show.id}-${show.performanceId || show.time}`} className="group w-full">
                      <Link href={`/repertoar/${show.slug}`} className="block space-y-3 focus:outline-none group">
                        <div className="relative w-full shadow-2xl overflow-hidden rounded-sm aspect-[10/14]">
                          <Image
                            src={show.poster_URL || show.image_URL}
                            alt={show.title}
                            fill
                            sizes="(max-width: 640px) 100vw, 30vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-[#27AAE1] transition-colors leading-tight">
                            {show.title}
                          </h3>
                          <p className="text-xs text-gray-400 font-light">{show.author}</p>
                          <div className="flex items-center gap-3 mt-2">
                             <span className="text-xs sm:text-sm font-medium text-white bg-[#27AAE1]/20 px-2 py-0.5 rounded-sm">
                               {show.time}
                             </span>
                             <span className="text-xs text-gray-400 uppercase tracking-widest">{show.venue}</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MonthlyProgramGuide;
