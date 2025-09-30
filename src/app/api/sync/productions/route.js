import { listProductions, mapProductionToShowPayload, slugify } from '../../../../../lib/entase/client'
import { createAdminClient } from '../../../../../lib/supabase/admin'

export const dynamic = 'force-dynamic'

const EXPECTED_CRON_SCHEDULE = '0 0 * * *'

export async function GET(request) {
  if (!isAuthorizedCron(request, EXPECTED_CRON_SCHEDULE)) {
    return Response.json({ ok: false, error: 'Scheduled sync only.' }, { status: 403 })
  }

  try {
    const { searchParams } = request.nextUrl
    const fetchPhotos = searchParams.get('fetchPhotos') === 'true'
    const supabase = createAdminClient()

    const hasEntaseId = await checkColumnExists(supabase, 'shows', 'entase_id')
    const selectColumns = ['id', 'slug', 'title']
    if (hasEntaseId) {
      selectColumns.push('entase_id')
    }

    const [{ data: existingShows, error: showsError }, productions] = await Promise.all([
      supabase.from('shows').select(selectColumns.join(', ')),
      listProductions({ fetchPhotos }),
    ])

    if (showsError) throw showsError

    const slugResolver = createSlugResolver(existingShows ?? [])
    const entaseIdToShow = new Map()
    if (hasEntaseId) {
      for (const show of existingShows ?? []) {
        if (show?.entase_id) {
          entaseIdToShow.set(String(show.entase_id), show)
        }
      }
    }

    const upsertPayloads = productions.map((production) => {
      const existing = hasEntaseId ? entaseIdToShow.get(production.id) : null
      const claimedSlug = existing
        ? existing.slug
        : slugResolver(production.slug, production.title)
      return mapProductionToShowPayload(
        { ...production, slug: claimedSlug },
        { includeEntaseId: hasEntaseId }
      )
    })

    const upserts = upsertPayloads.filter(Boolean)

    let upserted = 0
    if (upserts.length > 0) {
      const { data, error } = await supabase
        .from('shows')
        .upsert(upserts, { onConflict: hasEntaseId ? 'entase_id' : 'slug' })
        .select('id')
      if (error) throw error
      upserted = data?.length ?? 0
    }

    return Response.json(
      {
        ok: true,
        schedule: EXPECTED_CRON_SCHEDULE,
        attempted: productions.length,
        upserted,
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    )
  } catch (error) {
    console.error('Failed to sync Entase productions', error)
    return Response.json(
      {
        ok: false,
        error: 'Failed to sync productions.',
      },
      { status: 500 }
    )
  }
}

function isAuthorizedCron(request, expected) {
  const cronHeader = request.headers.get('x-vercel-cron')
  if (cronHeader && cronHeader !== expected) {
    return false
  }
  if (cronHeader === expected) {
    return true
  }
  const manualTrigger = request.nextUrl.searchParams.get('cron')
  if (manualTrigger === '1' || manualTrigger === 'true') {
    return true
  }
  return process.env.NODE_ENV !== 'production'
}

async function checkColumnExists(supabase, table, column) {
  const { error } = await supabase.from(table).select(column).limit(1)
  if (!error) return true
  if (typeof error.message === 'string' && /column .* does not exist/i.test(error.message)) {
    return false
  }
  console.warn(`Unexpected error when checking column ${table}.${column}`, error)
  return false
}

function createSlugResolver(existingShows = []) {
  const registry = new Map()
  for (const show of existingShows) {
    if (show?.slug) {
      registry.set(show.slug, show.title ?? '')
    }
  }
  return (preferredSlug, title) => {
    const baseSlug = slugify(preferredSlug || title)
    const existingTitle = registry.get(baseSlug)
    if (!existingTitle || existingTitle === (title ?? '')) {
      registry.set(baseSlug, title ?? '')
      return baseSlug
    }
    let suffix = 2
    let candidate = `${baseSlug}-${suffix}`
    while (registry.has(candidate)) {
      suffix += 1
      candidate = `${baseSlug}-${suffix}`
    }
    registry.set(candidate, title ?? '')
    return candidate
  }
}
