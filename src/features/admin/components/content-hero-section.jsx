"use client";

import Image from 'next/image'
import { inputClass } from '@/features/admin/constants'

export default function ContentHeroSection({
  heroMode,
  heroItems,
  onModeChange,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-theater-blue">Hero Секция (Въртележка)</h2>
        <div className="flex gap-2 rounded-lg bg-black/20 p-1">
          <button
            onClick={() => onModeChange('auto')}
            className={`px-4 py-2 text-sm font-medium transition-all ${
              heroMode === 'auto'
                ? 'rounded-md bg-theater-blue text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Автоматично
          </button>
          <button
            onClick={() => onModeChange('manual')}
            className={`px-4 py-2 text-sm font-medium transition-all ${
              heroMode === 'manual'
                ? 'rounded-md bg-theater-blue text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Ръчно
          </button>
        </div>
      </div>

      {heroMode === 'auto' ? (
        <div className="flex items-center gap-3 rounded-lg border border-blue-500/20 bg-blue-500/10 p-4 text-sm text-blue-200">
          <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          В автоматичен режим се показват предстоящите представления, подредени по дата.
        </div>
      ) : (
        <div className="space-y-4">
          {heroItems.map((item, index) => (
            <div
              key={index}
              className="group relative grid grid-cols-1 gap-4 rounded-xl border border-white/5 bg-black/20 p-4 transition-colors hover:border-white/10 md:grid-cols-2"
            >
              <button
                onClick={() => onRemoveItem(index)}
                className="absolute right-2 top-2 p-2 text-gray-500 transition-colors hover:text-red-400"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-400">Заглавие</label>
                <input
                  value={item.title}
                  onChange={(event) => onUpdateItem(index, 'title', event.target.value)}
                  className={inputClass}
                  placeholder="Заглавие на слайда"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-400">Информация</label>
                <input
                  value={item.subtitle}
                  onChange={(event) => onUpdateItem(index, 'subtitle', event.target.value)}
                  className={inputClass}
                  placeholder="Дата, час или подзаглавие"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-400">Линк</label>
                <input
                  value={item.link}
                  onChange={(event) => onUpdateItem(index, 'link', event.target.value)}
                  className={inputClass}
                  placeholder="/repertoar/slug"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-400">Снимка URL</label>
                <input
                  value={item.image}
                  onChange={(event) => onUpdateItem(index, 'image', event.target.value)}
                  className={inputClass}
                  placeholder="https://..."
                />
              </div>
              {item.image && (
                <div className="relative mt-2 h-32 w-full overflow-hidden rounded-lg border border-white/10 md:col-span-2">
                  <Image src={item.image} alt="preview" fill className="object-cover" />
                </div>
              )}
            </div>
          ))}

          <button
            onClick={onAddItem}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/10 py-4 font-medium text-gray-400 transition-all hover:border-theater-blue/50 hover:text-theater-blue"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Добави слайд
          </button>
        </div>
      )}
    </div>
  )
}
