'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Arrow from "@/components/ui/icons/Arrow.svg";
import ProgramCalendar from './calendar'; // Assuming this is your calendar component

const parseShowDateToUTC = (dateStr) => {
  if (!dateStr) {
    console.warn("Invalid date string provided: ", dateStr);
    return null;
  }
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    console.warn("Invalid date string for parseShowDateToUTC:", dateStr);
    return null;
  }
  return date;
};

const MonthlyProgramGuide = ({ shows = [] }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const [activeDisplayMonth, setActiveDisplayMonth] = useState(new Date().getUTCMonth());
  const [activeDisplayYear, setActiveDisplayYear] = useState(new Date().getUTCFullYear());

  const [calendarWindowBaseMonth, setCalendarWindowBaseMonth] = useState(new Date().getUTCMonth());
  const [calendarWindowBaseYear, setCalendarWindowBaseYear] = useState(new Date().getUTCFullYear());

  const [activeFilter, setActiveFilter] = useState('all');
  console.log(shows);
  const processedShows = useMemo(() => {
    return shows.map(show => {
      const performance = show.performances ? show.performances[0] : null;
      const fullDate = parseShowDateToUTC(performance ? performance.time : null);
      return {
        ...show,
        fullDate,
        time: performance && performance.time
          ? new Date(performance.time).toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })
          : '',
        venue: performance && (performance.venues?.name || performance.venue)
          ? (performance.venues?.name || performance.venue)
          : '',
      };
    }).filter(show => show.fullDate !== null && !isNaN(show.fullDate.getTime()));
  }, [shows]);

  useEffect(() => {
    if (processedShows.length === 0) return;

    const december = 11;
    const yearForEffect = new Date().getUTCFullYear();

    let initialBaseM = new Date().getUTCMonth();
    let initialBaseY = new Date().getUTCFullYear();
    let initialActiveM = initialBaseM;
    let initialActiveY = initialBaseY;

    const hasDecemberData = processedShows.some(s =>
      s.fullDate &&
      s.fullDate.getUTCMonth() === december &&
      s.fullDate.getUTCFullYear() === yearForEffect
    );

    if (hasDecemberData) {
      initialBaseM = december;
      initialBaseY = yearForEffect;
      initialActiveM = december;
      initialActiveY = yearForEffect;
    } else {
      const firstAvailableShow = processedShows
        .sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime())
      [0];

      if (firstAvailableShow) {
        initialBaseM = firstAvailableShow.fullDate.getUTCMonth();
        initialBaseY = firstAvailableShow.fullDate.getUTCFullYear();
        initialActiveM = initialBaseM;
        initialActiveY = initialBaseY;
      }
    }

    setCalendarWindowBaseMonth(initialBaseM);
    setCalendarWindowBaseYear(initialBaseY);
    setActiveDisplayMonth(initialActiveM);
    setActiveDisplayYear(initialActiveY);
    setSelectedDate(null);

  }, [processedShows]);

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
      {/* ... The rest of your JSX remains exactly the same ... */}
      <div className="max-w-[145rem] mx-auto">
        <div className='flex justify-center my-8'>
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
        <div className="flex flex-wrap justify-right gap-x-6 gap-y-3 sm:gap-x-8 my-8">
          <button onClick={() => { setActiveFilter('all'); setSelectedDate(null); }} className={`text-lg sm:text-xl font-light transition-all duration-300 ${activeFilter === 'all' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>ВСИЧКИ</button>
          <button onClick={() => { setActiveFilter('theater'); setSelectedDate(null); }} className={`text-lg sm:text-xl font-light transition-all duration-300 ${activeFilter === 'theater' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>ТЕАТЪР</button>
          <button onClick={() => { setActiveFilter('music'); setSelectedDate(null); }} className={`text-lg sm:text-xl font-light transition-all duration-300 ${activeFilter === 'music' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>МУЗИКА</button>
        </div>
        {selectedDate && (
          <div className="text-center mb-6">
            <button onClick={() => setSelectedDate(null)} className="text-yellow-400 hover:text-yellow-300 underline text-sm sm:text-base">
              Покажи всички за месеца
            </button>
          </div>
        )}
        <div className="space-y-12 min-h-[50rem]">
          {Object.keys(programToDisplay).length === 0 && (
            <p className="text-xl sm:text-2xl text-gray-400 text-center py-16">
              {selectedDate ? "Няма представления за избраната дата и филтър." : "Няма налични представления за този месец и филтър."}
            </p>
          )}
          {Object.entries(programToDisplay).map(([dateKey, showsForDay]) => {
            const dayNumber = parseInt(dateKey.split('-')[2]);
            return (
              <div key={dateKey} className="flex flex-col sm:flex-row items-start gap-x-4 sm:gap-x- gap-y-4">
                <div className="flex-shrink-0 w-full sm:w-20 md:w-24 text-left sm:text-right mb-4 sm:mb-0 pt-1">
                  <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-none tabular-nums">{String(dayNumber).padStart(2, '0')}</div>
                  <div className="text-xs sm:text-sm text-gray-300 uppercase tracking-wide mt-1">{getDayOfWeekBG(dateKey)}</div>
                </div>
                <div className="flex-grow w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10 ">
                  {showsForDay.map(show => (
                    <div key={show.id} className="group mx-auto max-w-sm w-full sm:max-w-none sm:mx-0">
                      <Link href={`/shows/${show.slug}`} legacyBehavior>
                        <a className="block space-y-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded-md">
                          <div className="relative w-full shadow-lg" style={{ aspectRatio: '10/14' }}>
                            <Image src={show.poster_URL || show.image_URL} alt={show.title} fill sizes="(max-width: 426px) 90vw, (max-width: 639px) 384px, (max-width: 1279px) 45vw, 30vw" style={{ objectFit: 'cover' }} className="rounded" />
                          </div>
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors leading-tight">{show.title}</h3>
                            <p className="text-xs text-gray-400 mt-0.5">{show.author}</p>
                            <p className="text-xs sm:text-sm text-gray-200 mt-1.5">{show.time} {show.venue}</p>
                            <div className="inline-flex items-center text-xs sm:text-sm text-yellow-500 group-hover:text-yellow-300 transition-colors mt-1 font-medium">
                              Билети
                              <Arrow className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-1.5 transition-transform duration-200 group-hover:translate-x-1" />
                            </div>
                          </div>
                        </a>
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