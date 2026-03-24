import { createClient } from '@/services/supabase/server'

const HERO_CONFIG_KEY = 'home_hero'
const SHOWS_CONFIG_KEY = 'home_shows'

function getConfigValue(configData, key) {
  return configData?.find((config) => config.key === key)?.value || {}
}

function orderShowsBySelection(shows, selection) {
  const showMap = new Map(shows.map((show) => [show.id, show]))

  return selection.map((id) => showMap.get(id)).filter(Boolean)
}

function dedupeHeroItems(items) {
  const seen = new Set()
  const uniqueItems = []

  for (const item of items) {
    const key =
      item.href && item.href.startsWith('/repertoar/')
        ? item.href
        : item.title || item.image

    if (seen.has(key)) {
      continue
    }

    seen.add(key)
    uniqueItems.push(item)
  }

  return uniqueItems
}

async function getShows(supabase, showsConfig) {
  if (showsConfig.mode === 'manual' && showsConfig.selection?.length > 0) {
    const { data } = await supabase
      .from('shows')
      .select('*')
      .in('id', showsConfig.selection)

    return data ? orderShowsBySelection(data, showsConfig.selection) : []
  }

  const { data } = await supabase.from('shows').select('*').limit(6)
  return data ?? []
}

async function getCastMembers(supabase) {
  const { data } = await supabase
    .from('employees')
    .select('id, name, role, profile_picture_URL')
    .order('id')
    .limit(8)

  return data ?? []
}

function buildManualHeroItems(heroConfig) {
  return heroConfig.items.map((item) => ({
    title: item.title,
    href: item.link || '#',
    date: item.subtitle || '',
    image: item.image,
    time: '',
    venue: '',
  }))
}

async function getAutomaticHeroItems(supabase) {
  const nowIso = new Date().toISOString()
  const { data } = await supabase
    .from('performances')
    .select('id, time, venue, shows(title, slug, image_URL, poster_URL)')
    .gte('time', nowIso)
    .order('time', { ascending: true })
    .limit(12)

  const heroCandidates = (data || [])
    .map((performance) => {
      const date = new Date(performance.time)

      return {
        title: performance.shows?.title || 'Представление',
        href: performance.shows?.slug ? `/repertoar/${performance.shows.slug}` : '#',
        venue: performance.venue || '',
        date: date.toLocaleDateString('bg-BG', {
          day: '2-digit',
          month: '2-digit',
          timeZone: 'Europe/Sofia',
        }),
        time: date.toLocaleTimeString('bg-BG', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Europe/Sofia',
        }),
        image:
          performance.shows?.image_URL ||
          performance.shows?.poster_URL ||
          '/hero.jpg',
      }
    })
    .filter((item) => item.title && item.image)

  return dedupeHeroItems(heroCandidates).slice(0, 8)
}

async function getHeroItems(supabase, heroConfig) {
  if (heroConfig.mode === 'manual' && heroConfig.items?.length > 0) {
    return buildManualHeroItems(heroConfig)
  }

  return getAutomaticHeroItems(supabase)
}

export async function getHomePageData() {
  const supabase = await createClient()
  const { data: configData } = await supabase.from('content_config').select('*')
  const heroConfig = getConfigValue(configData, HERO_CONFIG_KEY)
  const showsConfig = getConfigValue(configData, SHOWS_CONFIG_KEY)

  const [heroItems, shows, castMembers] = await Promise.all([
    getHeroItems(supabase, heroConfig),
    getShows(supabase, showsConfig),
    getCastMembers(supabase),
  ])

  return {
    heroItems,
    shows,
    castMembers,
  }
}
