"use client";

import { useEffect, useState } from 'react'
import StatusMessage from '@/components/ui/status-message'
import { buttonBaseClass } from './constants'
import ContentHeroSection from './content-hero-section'
import ContentShowsSection from './content-shows-section'
import {
  appendHeroItem,
  getConfigValueByKey,
  removeHeroItemByIndex,
  toggleShowSelectionItem,
  updateHeroItemValue,
} from './content-section-utils'

const HERO_CONFIG_KEY = 'home_hero'
const SHOWS_CONFIG_KEY = 'home_shows'

export default function ContentSection({ supabase }) {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [heroMode, setHeroMode] = useState('auto')
  const [heroItems, setHeroItems] = useState([])
  const [showsMode, setShowsMode] = useState('auto')
  const [showsSelection, setShowsSelection] = useState([])
  const [availableShows, setAvailableShows] = useState([])

  useEffect(() => {
    void fetchConfig()
    void fetchShows()
  }, [])

  function clearStatus() {
    setStatus(null)
  }

  async function fetchConfig() {
    try {
      setLoading(true)
      const { data, error } = await supabase.from('content_config').select('*')

      if (error) {
        throw error
      }

      const heroConfig = getConfigValueByKey(data, HERO_CONFIG_KEY)
      const showsConfig = getConfigValueByKey(data, SHOWS_CONFIG_KEY)

      setHeroMode(heroConfig.mode || 'auto')
      setHeroItems(heroConfig.items || [])
      setShowsMode(showsConfig.mode || 'auto')
      setShowsSelection(showsConfig.selection || [])
    } catch (error) {
      console.error('Error fetching config:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchShows() {
    const { data } = await supabase
      .from('shows')
      .select('id, title, poster_URL')
      .order('title')

    if (data) {
      setAvailableShows(data)
    }
  }

  async function saveConfig() {
    setStatus(null)

    try {
      const updates = [
        {
          key: HERO_CONFIG_KEY,
          value: { mode: heroMode, items: heroItems },
        },
        {
          key: SHOWS_CONFIG_KEY,
          value: { mode: showsMode, selection: showsSelection },
        },
      ]

      const { error } = await supabase.from('content_config').upsert(updates)

      if (error) {
        throw error
      }

      setStatus({ type: 'success', message: 'Настройките са запазени успешно.' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Грешка при запазване.' })
    }
  }

  function addHeroItem() {
    setHeroItems(appendHeroItem(heroItems))
  }

  function updateHeroItem(index, field, value) {
    setHeroItems(updateHeroItemValue(heroItems, index, field, value))
  }

  function removeHeroItem(index) {
    setHeroItems(removeHeroItemByIndex(heroItems, index))
  }

  function toggleShowSelection(showId) {
    setShowsSelection(toggleShowSelectionItem(showsSelection, showId))
  }

  if (loading) {
    return <div className="text-white">Зареждане...</div>
  }

  return (
    <section className="space-y-6 text-white">
      <h2 className="mb-6 text-2xl font-bold text-white">Управление на съдържанието</h2>
      <StatusMessage status={status} onClear={clearStatus} />

      <ContentHeroSection
        heroMode={heroMode}
        heroItems={heroItems}
        onModeChange={setHeroMode}
        onAddItem={addHeroItem}
        onUpdateItem={updateHeroItem}
        onRemoveItem={removeHeroItem}
      />

      <ContentShowsSection
        showsMode={showsMode}
        showsSelection={showsSelection}
        availableShows={availableShows}
        onModeChange={setShowsMode}
        onToggleShow={toggleShowSelection}
      />

      <div className="flex justify-end border-t border-white/10 pt-4">
        <button
          onClick={saveConfig}
          className={`${buttonBaseClass} bg-green-500 px-8 py-3 text-lg text-white shadow-lg shadow-green-900/20 hover:bg-green-600`}
        >
          Запази промените
        </button>
      </div>
    </section>
  )
}
