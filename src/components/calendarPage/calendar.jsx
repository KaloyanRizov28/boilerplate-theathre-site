'use client';

import React, { useMemo, useState, useEffect } from 'react';

// Helper function to get month calendar details (UTC-aware)
const getMonthCalendarDetails = (year, month, weekStartsOn = 1) => {
  const internalDate = new Date(Date.UTC(year, month, 1));
  let monthNameForDisplay = 'Error';
  const localDateForMonthName = new Date(year, month, 1);

  if (!isNaN(localDateForMonthName.getTime())) {
    monthNameForDisplay = localDateForMonthName.toLocaleString('bg-BG', { month: 'long' });
  } else {
    console.error("getMonthCalendarDetails: Invalid date for monthName generation.", { year, month });
  }

  if (isNaN(internalDate.getTime())) {
    console.error("getMonthCalendarDetails: Invalid UTC date for calendar structure.", { year, month });
    const today = new Date();
    return {
      weeks: Array(5).fill(Array(7).fill(null)),
      monthName: 'Error',
      year: today.getUTCFullYear()
    };
  }

  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const newWeeks = [];
  let dayCounter = 1;
  const dayOfWeekOfFirstUTC = internalDate.getUTCDay();
  const leadingSpacers = (dayOfWeekOfFirstUTC - weekStartsOn + 7) % 7;
  const calendarCells = [];
  for (let i = 0; i < leadingSpacers; i++) calendarCells.push(null);
  while (dayCounter <= daysInMonth) {
    const currentCellDateUTC = new Date(Date.UTC(year, month, dayCounter));
    const dayOfWeekUTC = currentCellDateUTC.getUTCDay();
    calendarCells.push({
      dayNumber: dayCounter,
      isWeekend: dayOfWeekUTC === 0 || dayOfWeekUTC === 6,
    });
    dayCounter++;
  }
  while (calendarCells.length % 7 !== 0) calendarCells.push(null);
  for (let i = 0; i < calendarCells.length; i += 7) newWeeks.push(calendarCells.slice(i, i + 7));
  return { weeks: newWeeks, monthName: monthNameForDisplay, year };
};

// Reverted to the single INITIAL_WEEK_START_COLUMN from your earlier provided code
const INITIAL_WEEK_START_COLUMN = 8;

const ProgramCalendar = ({
  currentYear: currentYearProp,     // The year of the month grid to DISPLAY
  currentMonth: currentMonthProp,   // The month of the grid to DISPLAY (0-indexed)
  baseYear: passedBaseYear,         // Base year for the calendar's own navigation window (now from currentViewYear)
  baseMonth: passedBaseMonth,       // Base month for the calendar's own navigation window (now from currentViewMonth)
  daysWithShows,
  selectedDayNumber,
  onDayClick,
  onMonthChange
}) => {

  // --- UPDATED MONTH LOGIC ---
  // Determine base for calendar's own navigation buttons using passedBaseMonth/Year
  const calendarNavBaseYear = typeof passedBaseYear === 'number' && !isNaN(passedBaseYear)
    ? passedBaseYear
    : new Date().getUTCFullYear();
  const calendarNavBaseMonth = typeof passedBaseMonth === 'number' && !isNaN(passedBaseMonth)
    ? passedBaseMonth
    : new Date().getUTCMonth();
  
  // Determine month/year for DISPLAYING the day grid
  // Prioritize currentMonthProp/currentYearProp. Fallback to nav base if props are invalid.
  let yearToDisplay = calendarNavBaseYear; 
  if (typeof currentYearProp === 'number' && !isNaN(currentYearProp)) {
    yearToDisplay = currentYearProp;
  }

  let monthToDisplay = calendarNavBaseMonth; 
  if (typeof currentMonthProp === 'number' && !isNaN(currentMonthProp)) {
    monthToDisplay = currentMonthProp;
  }
  
  

  const { weeks } = useMemo(() => {
    return getMonthCalendarDetails(yearToDisplay, monthToDisplay, 1);
  }, [yearToDisplay, monthToDisplay]);

  const [gridOpacity, setGridOpacity] = useState(1);

  useEffect(() => {
    setGridOpacity(0);
    const timer = setTimeout(() => { setGridOpacity(1); }, 150);
    return () => clearTimeout(timer);
  }, [monthToDisplay, yearToDisplay]);

  const firstMonthInWindow = useMemo(() => {
    const details = getMonthCalendarDetails(calendarNavBaseYear, calendarNavBaseMonth, 1);
    return { month: calendarNavBaseMonth, year: calendarNavBaseYear, name: details.monthName };
  }, [calendarNavBaseMonth, calendarNavBaseYear]);

  const secondMonthInWindow = useMemo(() => {
    const date = new Date(Date.UTC(calendarNavBaseYear, calendarNavBaseMonth + 1, 1));
    const M = date.getUTCMonth();
    const Y = date.getUTCFullYear();
    const details = getMonthCalendarDetails(Y, M, 1);
    return { month: M, year: Y, name: details.monthName };
  }, [calendarNavBaseMonth, calendarNavBaseYear]);

  const isDisplayingNavFirstMonth = yearToDisplay === firstMonthInWindow.year && monthToDisplay === firstMonthInWindow.month;
  const isDisplayingNavSecondMonth = yearToDisplay === secondMonthInWindow.year && monthToDisplay === secondMonthInWindow.month;

  const handleInternalDayClick = (dayNumberFromCell, isDayWithShowFlag) => {
    if (!dayNumberFromCell) return;
    if (onDayClick) {
      onDayClick(dayNumberFromCell, monthToDisplay, yearToDisplay, isDayWithShowFlag);
    } else {
      const clickedMonthName = new Date(yearToDisplay, monthToDisplay).toLocaleString('default', { month: 'long' });
    }
  };

  const navigateToFirstMonth = () => {
    if (onMonthChange && !isDisplayingNavFirstMonth) {
      onMonthChange(firstMonthInWindow.month, firstMonthInWindow.year);
    }
  };
  const navigateToSecondMonth = () => {
    if (onMonthChange && !isDisplayingNavSecondMonth) {
      onMonthChange(secondMonthInWindow.month, secondMonthInWindow.year);
    }
  };
  // --- END OF UPDATED MONTH LOGIC ---

  // --- STYLES REVERTED to your originally provided version ---
  const overallPaddingClasses = "p-0 sm:p-4 md:p-6 lg:p-8 xl:p-12";
  const titleSizeClasses = "text-lg sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl";
  const monthNameSizeClasses = "text-sm sm:text-xl md:text-1xl lg:text-2xl xl:text-3xl";
  const dateTextSizeClasses = "text-[12px] sm:text-lg md:text-xl lg:text-2xl xl:text-3xl"; 
  const dayCellWidthClasses = "w-7 sm:w-9 md:w-11 lg:w-14 xl:w-16"; 
  const dayCellSpacingClasses = "space-x-1 sm:space-x-1.5 md:space-x-2 lg:space-x-2.5 xl:space-x-3"; 
  // --- END OF STYLES REVERSION ---

  return (
    <div className={`bg-theater-dark text-white ${overallPaddingClasses} rounded-lg font-sans w-full max-w-screen-xl mx-auto`}>
      <div className="flex flex-col md:flex-row md:items-start gap-y-2 md:gap-y-0 md:gap-x-6 lg:gap-x-10 xl:gap-x-14">
        <div className="flex-shrink-0 w-full md:w-auto text-center md:text-left md:sticky md:top-6 mb-1 sm:mb-0">
          <h1 className={`${titleSizeClasses} font-bold text-white mb-1 sm:mb-6 md:mb-8 tracking-tight`}>
            Програма
          </h1>
          <div className={`flex items-center justify-center md:justify-start ${dayCellSpacingClasses.replace('space-x-', 'space-x-')} xs:space-x-0.5 sm:space-x-3 md:space-x-4`}>
            <button
              onClick={navigateToFirstMonth}
              disabled={isDisplayingNavFirstMonth}
              className={`${monthNameSizeClasses} font-medium capitalize transition-colors duration-150 ${isDisplayingNavFirstMonth ? 'text-white cursor-default' : 'text-gray-400 hover:text-[#27AAE1]'}`}
            >
              {firstMonthInWindow.name} {/* This will now be currentViewMonth's name */}
            </button>
            <span className={`${monthNameSizeClasses} text-gray-500 mx-1 sm:mx-1.5 md:mx-2`}></span>
            <button
              onClick={navigateToSecondMonth}
              disabled={isDisplayingNavSecondMonth}
              className={`${monthNameSizeClasses} font-medium capitalize transition-colors duration-150 ${isDisplayingNavSecondMonth ? 'text-white cursor-default' : 'text-gray-400 hover:text-[#27AAE1]'}`}
            >
              {secondMonthInWindow.name} {/* This will now be (currentViewMonth + 1)'s name */}
            </button>
          </div>
        </div>

        {/* Styles here are from your original version; no overflow wrapper or min-width added by me */}
        <div
          className={`flex-grow w-full grid grid-cols-7 sm:grid-cols-14 gap-y-2 sm:gap-y-2.5 lg:gap-y-3 gap-x-1 sm:gap-x-0.5 md:gap-x-1 font-mono transition-opacity duration-300 ease-in-out`}
          style={{ opacity: gridOpacity }}
        >
          {weeks.map((week, weekIndex) => {
            // Only apply the staircase offset on screens larger than mobile (sm: 640px)
            // For mobile, it will be a standard 7-column grid starting at 1
            const startColumn = Math.max(1, INITIAL_WEEK_START_COLUMN - weekIndex);

            return (
              <div
                key={`week-${weekIndex}-${yearToDisplay}-${monthToDisplay}`}
                className={`col-span-14 sm:col-span-7 flex justify-between sm:justify-end ${dayCellSpacingClasses}`}
                style={{
                  gridColumnStart: typeof window !== 'undefined' && window.innerWidth < 640 ? 1 : startColumn
                }}
              >
                {week.map((dayObj, dayIndex) => {
                  if (!dayObj) {
                    return <span key={`empty-${weekIndex}-${dayIndex}`} className={`${dayCellWidthClasses} block text-center invisible sm:visible`}></span>;
                  }
                  const isDayWithShow = daysWithShows && daysWithShows.includes(dayObj.dayNumber);
                  const isSelected = selectedDayNumber === dayObj.dayNumber && monthToDisplay === currentMonthProp && yearToDisplay === currentYearProp;

                  let cellClasses = `${dayCellWidthClasses} text-[14px] sm:text-[18px] md:text-xl lg:text-2xl xl:text-3xl text-center block transition-all duration-150 ease-in-out rounded-sm py-1 sm:py-0`;

                  if (isSelected && isDayWithShow) {
                    cellClasses += " bg-[#27AAE1] text-white font-bold transform scale-105 cursor-pointer shadow-[0_0_15px_rgba(39,170,225,0.4)]";
                  } else if (isDayWithShow) {
                    cellClasses += " text-white font-semibold cursor-pointer hover:bg-theater-hover hover:scale-105 active:scale-100 ring-1 ring-[#27AAE1]/30";
                  } else {
                    if (dayObj.isWeekend) {
                      cellClasses += " text-gray-600 opacity-40 cursor-default pointer-events-none";
                    } else {
                      cellClasses += " text-gray-700 opacity-30 cursor-default pointer-events-none";
                    }
                  }
                  return (
                    <span
                      key={dayObj.dayNumber}
                      onClick={() => isDayWithShow && handleInternalDayClick(dayObj.dayNumber, isDayWithShow)}
                      className={cellClasses}
                      role="button"
                      tabIndex={isDayWithShow ? 0 : -1}
                      aria-disabled={!isDayWithShow}
                      aria-pressed={isSelected && isDayWithShow}
                    >
                      {dayObj.dayNumber.toString().padStart(2, '0')}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgramCalendar;
