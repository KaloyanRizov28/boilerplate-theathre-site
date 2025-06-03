'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Arrow from "@/components/ui/icons/Arrow.svg";
// Assuming StaircaseCalendar is your ProgramCalendar.jsx component
import StaircaseCalendar from '../../components/sections/calendar/calendar';

// Data from your ShowsSection
const showsSectionMockData = [
  { id: 1, title: 'Розенкранц и Гилденстерн са мъртви', slug: 'rozenkranc-i-gildenstern', image: '/shows/rozenkranc.png', date: '13.05', category: 'theater', author: 'Том Стопард' },
  { id: 2, title: 'Кралецът на праскови', slug: 'kralecyt-na-praskovi', image: '/shows/4.png', date: '13.05', category: 'theater', author: 'Емилиян Станев' },
  { id: 3, title: 'Страната на усмивките', slug: 'stranata-na-usmivkite', image: '/shows/dve.png', date: '13.05', category: 'music', author: 'Франц Лехар' },
  { id: 4, title: 'Вишнева градина', slug: 'vishneva-gradina', image: '/shows/3.png', date: '20.05', category: 'theater', author: 'Антон Чехов' },
  { id: 5, title: 'Кармен', slug: 'karmen', image: '/shows/5.png', date: '25.05', category: 'music', author: 'Жорж Бизе' },
  { id: 6, title: 'Дон Жуан', slug: 'don-zhuan', image: '/shows/6.png', date: '28.05', category: 'music', author: 'Волфганг Амадеус Моцарт' },
  { id: 7, title: 'Дон Жуан ( повторение )', slug: 'don-zhuan-2', image: '/shows/6.png', date: '28.05', category: 'music', author: 'Волфганг Амадеус Моцарт' }
];

const parseShowDateToUTC = (dateStr, year) => {
  const [day, month] = dateStr.split('.').map(Number);
  if (isNaN(day) || isNaN(month) || month < 1 || month > 12 || day < 1 || day > 31) {
    console.warn("Invalid date string for parseShowDateToUTC:", dateStr);
    return null;
  }
  // Check for valid days in month (e.g. February 30th)
  const daysInSpecificMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  if (day > daysInSpecificMonth) {
    console.warn(`Invalid day ${day} for month ${month} in year ${year}. Date string: ${dateStr}`);
    return null;
  }
  return new Date(Date.UTC(year, month - 1, day));
};

const initialProcessingYear = new Date().getUTCFullYear();
const processedShows = showsSectionMockData.map(show => {
  const fullDate = parseShowDateToUTC(show.date, initialProcessingYear);
  return {
    ...show,
    fullDate,
    time: show.id % 3 === 0 ? "20:00" : "19:00",
    venue: show.category === 'theater' ? (show.id % 2 === 0 ? "Голяма Сцена" : "Камерна Сцена") : "Концертна Зала",
  };
}).filter(show => show.fullDate !== null && !isNaN(show.fullDate.getTime()));

const MonthlyProgramGuide = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  // State for the month whose grid and shows are currently displayed
  const [activeDisplayMonth, setActiveDisplayMonth] = useState(new Date().getUTCMonth());
  const [activeDisplayYear, setActiveDisplayYear] = useState(new Date().getUTCFullYear());

  // State for the base of the calendar's two-month navigation window
  // This determines the first month shown in the "Month1 | Month2" navigation
  const [calendarWindowBaseMonth, setCalendarWindowBaseMonth] = useState(new Date().getUTCMonth());
  const [calendarWindowBaseYear, setCalendarWindowBaseYear] = useState(new Date().getUTCFullYear());

  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const december = 11; // 0-indexed for December
    const yearForEffect = initialProcessingYear; // Use the year shows were processed against

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
        const firstAvailableShowInProcessedYear = processedShows
            .filter(s => s.fullDate && s.fullDate.getUTCFullYear() === yearForEffect)
            .sort((a,b) => a.fullDate.getTime() - b.fullDate.getTime())
            [0];

        if (firstAvailableShowInProcessedYear) {
            initialBaseM = firstAvailableShowInProcessedYear.fullDate.getUTCMonth();
            initialBaseY = firstAvailableShowInProcessedYear.fullDate.getUTCFullYear();
            initialActiveM = initialBaseM;
            initialActiveY = initialBaseY;
        }
        // If no specific data, defaults to current month/year set by useState initials
    }
    
    setCalendarWindowBaseMonth(initialBaseM);
    setCalendarWindowBaseYear(initialBaseY);
    setActiveDisplayMonth(initialActiveM);
    setActiveDisplayYear(initialActiveY);
    setSelectedDate(null); // Reset selected date when initial month/year is set

  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        new Date(Date.UTC(parseInt(a.substring(0,4)), parseInt(a.substring(5,7))-1, parseInt(a.substring(8,10)))).getUTCDate() -
        new Date(Date.UTC(parseInt(b.substring(0,4)), parseInt(b.substring(5,7))-1, parseInt(b.substring(8,10)))).getUTCDate()
    );
    const orderedGrouped = {};
    sortedDateKeys.forEach(key => { orderedGrouped[key] = grouped[key]; });
    return orderedGrouped;
  }, [activeDisplayMonth, activeDisplayYear, activeFilter]);

  const daysWithShowsInActiveMonth = useMemo(() => Object.keys(showsByDateForActiveMonth).map(dateKey => parseInt(dateKey.split('-')[2])), [showsByDateForActiveMonth]);

  const programToDisplay = useMemo(() => {
    if (selectedDate) {
      // Ensure selectedDate matches the activeDisplayMonth and activeDisplayYear before trying to filter
      if (selectedDate.getUTCMonth() !== activeDisplayMonth || selectedDate.getUTCFullYear() !== activeDisplayYear) {
          return {}; // Selected date is not in the currently active month view
      }
      const dateKey = `${selectedDate.getUTCFullYear()}-${(selectedDate.getUTCMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getUTCDate().toString().padStart(2, '0')}`;
      return showsByDateForActiveMonth[dateKey] ? { [dateKey]: showsByDateForActiveMonth[dateKey] } : {};
    }
    return showsByDateForActiveMonth;
  }, [selectedDate, showsByDateForActiveMonth, activeDisplayMonth, activeDisplayYear]);

  const handleDaySelection = (dayNumber) => {
    // dayNumber is from the activeDisplayMonth/Year context
    setSelectedDate(new Date(Date.UTC(activeDisplayYear, activeDisplayMonth, dayNumber)));
  };

  const handleMonthNavigation = (month, year) => {
    console.log('[MonthlyProgramGuide] Navigating displayed shows to month:', month, 'year:', year);
    setActiveDisplayMonth(month);
    setActiveDisplayYear(year);
    setSelectedDate(null); // Reset date selection when month changes
    // calendarWindowBaseMonth/Year do not change here, they define the fixed window
  };

  const getDayOfWeekBG = (dateString_YYYY_MM_DD) => {
    const parts = dateString_YYYY_MM_DD.split('-').map(Number);
    const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    return new Intl.DateTimeFormat('bg-BG', { weekday: 'long', timeZone: 'UTC' }).format(date);
  };

  return (
    <section className="bg-theater-dark text-white px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-[145rem] mx-auto">
        

        <div className='flex justify-center my-8'>
          <StaircaseCalendar
            // Props for DISPLAYING the grid
            currentMonth={activeDisplayMonth}
            currentYear={activeDisplayYear}
            
            // Props for setting the CALENDAR's own navigation window (Month1 | Month2)
            baseMonth={calendarWindowBaseMonth}
            baseYear={calendarWindowBaseYear}   
            
            daysWithShows={daysWithShowsInActiveMonth} // These are for the activeDisplayMonth
            onDayClick={handleDaySelection}
            onMonthChange={handleMonthNavigation} // This updates activeDisplayMonth/Year
            selectedDayNumber={selectedDate && selectedDate.getUTCMonth() === activeDisplayMonth && selectedDate.getUTCFullYear() === activeDisplayYear ? selectedDate.getUTCDate() : undefined}
          />
        </div>
        <div className="flex flex-wrap justify-right gap-x-6 gap-y-3 sm:gap-x-8 my-8">
            <button onClick={() => { setActiveFilter('all'); setSelectedDate(null);}} className={`text-lg sm:text-xl font-light transition-all duration-300 ${activeFilter === 'all' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>ВСИЧКИ</button>
            <button onClick={() => { setActiveFilter('theater'); setSelectedDate(null);}} className={`text-lg sm:text-xl font-light transition-all duration-300 ${activeFilter === 'theater' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>ТЕАТЪР</button>
            <button onClick={() => { setActiveFilter('music'); setSelectedDate(null);}} className={`text-lg sm:text-xl font-light transition-all duration-300 ${activeFilter === 'music' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>МУЗИКА</button>
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
                            <Image src={show.image} alt={show.title} fill sizes="(max-width: 426px) 90vw, (max-width: 639px) 384px, (max-width: 1279px) 45vw, 30vw" style={{ objectFit: 'cover' }} className="rounded"/>
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