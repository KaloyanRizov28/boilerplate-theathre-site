"use client";

import Image from 'next/image'

export default function ContentShowsSection({
  showsMode,
  showsSelection,
  availableShows,
  onModeChange,
  onToggleShow,
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-theater-blue">Секция &quot;Спектакли&quot;</h2>
        <div className="flex gap-2 rounded-lg bg-black/20 p-1">
          <button
            onClick={() => onModeChange('auto')}
            className={`px-4 py-2 text-sm font-medium transition-all ${
              showsMode === 'auto'
                ? 'rounded-md bg-theater-blue text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Автоматично
          </button>
          <button
            onClick={() => onModeChange('manual')}
            className={`px-4 py-2 text-sm font-medium transition-all ${
              showsMode === 'manual'
                ? 'rounded-md bg-theater-blue text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Ръчно
          </button>
        </div>
      </div>

      {showsMode === 'auto' ? (
        <div className="flex items-center gap-3 rounded-lg border border-blue-500/20 bg-blue-500/10 p-4 text-sm text-blue-200">
          <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          В автоматичен режим се показват последните добавени спектакли.
        </div>
      ) : (
        <div className="custom-scrollbar grid max-h-[500px] grid-cols-2 gap-3 overflow-y-auto rounded-xl border border-white/5 bg-black/20 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {availableShows.map((show) => {
            const isSelected = showsSelection.includes(show.id)

            return (
              <div
                key={show.id}
                onClick={() => onToggleShow(show.id)}
                className={`group relative flex cursor-pointer flex-col gap-2 rounded-lg border p-3 transition-all duration-200 ${
                  isSelected
                    ? 'border-theater-blue bg-theater-blue/10 shadow-lg shadow-theater-blue/10'
                    : 'border-white/5 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-white/5">
                  {show.poster_URL ? (
                    <Image src={show.poster_URL} alt={show.title} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
                      No Image
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-theater-blue/20">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-theater-blue text-white shadow-lg">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-start gap-2">
                  <span
                    className={`line-clamp-2 text-sm font-medium leading-tight ${
                      isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'
                    }`}
                  >
                    {show.title}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
