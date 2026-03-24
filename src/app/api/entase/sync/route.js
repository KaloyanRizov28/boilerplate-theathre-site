import { NextResponse } from 'next/server'

import { slugify } from '@/services/entase/client'
import { createAdminClient } from '@/services/supabase/admin'
import { createClient as createServerClient } from '@/services/supabase/server'

const ENTASE_BASE_URL = 'https://api.entase.com/v2'
const DEFAULT_POSTER = 'https://via.placeholder.com/600x900/0B1D2A/FFFFFF?text=Poster'
const DEFAULT_IMAGE = 'https://via.placeholder.com/1280x720/0B1D2A/FFFFFF?text=Show'

async function fetchCollection(initialPath, apiKey) {
  const items = []
  let url = initialPath.startsWith('http')
    ? initialPath
    : `${ENTASE_BASE_URL}${initialPath}`

  while (url) {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      cache: 'no-store',
    })
    if (!response.ok) {
      const body = await response.text()
      throw new Error(
        `Entase request failed for ${url} with status ${response.status}: ${body}`
      )
    }
    const payload = await response.json()
    const data = payload?.resource?.data ?? []
    items.push(...data)
    const cursor = payload?.resource?.cursor
    if (cursor?.hasMore && cursor?.nextURL) {
      url = cursor.nextURL.startsWith('http')
        ? cursor.nextURL
        : `${ENTASE_BASE_URL}${cursor.nextURL}`
    } else {
      url = null
    }
  }
  
  return items
}

function buildSlug(title, productionId) {
  const base = slugify(title || `production-${productionId}`)
  return `${base}-${productionId}`
}

function extractStory(production) {
  if (!production) return ''
  const sections = []
  if (production.story) {
    sections.push(production.story)
  }
  const meta = []
  if (production.length) {
    meta.push(`Продължителност: ${production.length}`)
  }
  if (production.minAgeRestriction) {
    meta.push(`Минимална възраст: ${production.minAgeRestriction}+`)
  }
  if (meta.length) {
    sections.push(meta.join(' • '))
  }
  return sections.join('\n\n')
}

function buildShowRecord(production) {
  return {
    title: production.title || `Production ${production.id}`,
    slug: buildSlug(production.title, production.id),
    category: 'theater',
    author: production.author || 'Entase',
    information: extractStory(production),
    image_URL: production.image_URL || DEFAULT_IMAGE,
    poster_URL: production.poster_URL || DEFAULT_POSTER,
    picture_personalURL: production.picture_personalURL || null,
  }
}

function normalizeDate(timestampInSeconds) {
  const timestampInMilliseconds = timestampInSeconds * 1000
  const date = new Date(timestampInMilliseconds)
  const formatter = new Intl.DateTimeFormat('bg-BG', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Europe/Sofia',
  })

  return convertSofiaStringToISO(formatter.format(date))
}

function convertSofiaStringToISO(sofiaTimeString) {
  const datePart = sofiaTimeString.split(' ')[0]
  const timePart = sofiaTimeString.split(', ')[1]
  const [day, month, year] = datePart.split('.').map(Number)
  const isoDatePart = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  return `${isoDatePart} ${timePart} +03`
}

export async function POST() {
  const apiKey = process.env.ENTASE_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'ENTASE_API_KEY is not configured on the server.' },
      { status: 500 }
    )
  }

  const supabase = await createServerClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 401 })
  }

  if (!user || user.app_metadata?.is_admin !== true) {
    return NextResponse.json(
      { error: 'You must be an authenticated admin to perform this action.' },
      { status: 403 }
    )
  }

  try {
    const [productions, events] = await Promise.all([
      fetchCollection('/productions?limit=100&sort[id]=asc', apiKey),
      fetchCollection(
        '/events?limit=100&filter[status][0]=1&filter[status][1]=2&extend[0]=productionTitle',
        apiKey
      ),
    ])
    if (!productions.length) {
      return NextResponse.json(
        { error: 'No productions were returned by the Entase API.' },
        { status: 502 }
      )
    }
    const productionsById = new Map()
    productions.forEach((production) => {
      productionsById.set(production.id, production)
    })

    // Upsert ALL productions as shows, regardless of events
    const showsPayload = productions.map((p) => buildShowRecord(p))

    const adminClient = createAdminClient()

    const { data: upsertedShows, error: upsertError } = await adminClient
      .from('shows')
      .upsert(showsPayload, { onConflict: 'slug', ignoreDuplicates: true })
      .select('id, slug')

    if (upsertError) {
      throw upsertError
    }

    const slugs = showsPayload.map((show) => show.slug)
    let shows = upsertedShows ?? []

    if (shows.length !== slugs.length) {
      const { data: fetchedShows, error: fetchShowsError } = await adminClient
        .from('shows')
        .select('id, slug')
        .in('slug', slugs)
      if (fetchShowsError) {
        throw fetchShowsError
      }
      shows = fetchedShows
    }

    const slugToId = new Map(shows.map((show) => [show.slug, show.id]))

    const performancesPayload = events
      .map((event) => {
        const production = productionsById.get(event.productionID)
        if (!production) return null
        const slug = buildSlug(production.title, production.id)
        const idShow = slugToId.get(slug)
        if (!idShow) return null
        const time = normalizeDate(event.dateStart)
        if (!time) return null
        const payload = {
          idShow,
          time,
        }
        if (event.location?.placeName) {
          payload.venue = event.location.placeName
        }
        return payload
      })
      .filter(Boolean)

    // Delete and rebuild performances for ALL synced shows to avoid stale data
    const showIds = Array.from(new Set(shows.map((s) => s.id)))
    if (showIds.length) {
      const { error: deletePerformancesError } = await adminClient
        .from('performances')
        .delete()
        .in('idShow', showIds)
      if (deletePerformancesError) {
        throw deletePerformancesError
      }
    }

    if (performancesPayload.length) {
      const { error: insertPerformancesError } = await adminClient
        .from('performances')
        .insert(performancesPayload)
      if (insertPerformancesError) {
        throw insertPerformancesError
      }
    }

    return NextResponse.json({
      status: 'ok',
      showCount: showsPayload.length,
      performanceCount: performancesPayload.length,
    })
  } catch (error) {
    console.error('Failed to sync with Entase:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to sync with Entase.' },
      { status: 500 }
    )
  }
}
