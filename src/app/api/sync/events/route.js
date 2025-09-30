import { listEvents, mapEventToPerformancePayload } from '../../../../../lib/entase/client'
import { createAdminClient } from '../../../../../lib/supabase/admin'

export const dynamic = 'force-dynamic'

const EXPECTED_CRON_SCHEDULE = '*/10 * * * *'
const DEDUPE_WINDOW_MS = 60 * 1000

export async function GET(request) {
  if (!isAuthorizedCron(request, EXPECTED_CRON_SCHEDULE)) {
    return Response.json({ ok: false, error: 'Scheduled sync only.' }, { status: 403 })
  }

  try {
    const supabase = createAdminClient()

    const [hasEntaseShowId, hasEntaseEventId] = await Promise.all([
      checkColumnExists(supabase, 'shows', 'entase_id'),
      checkColumnExists(supabase, 'performances', 'entase_event_id'),
    ])

    const showColumns = ['id', 'slug']
    if (hasEntaseShowId) {
      showColumns.push('entase_id')
    }

    const performanceColumns = ['id', 'idShow', 'time']
    if (hasEntaseEventId) {
      performanceColumns.push('entase_event_id')
    }

    const [{ data: shows, error: showsError }, { data: performances, error: perfError }, events] =
      await Promise.all([
        supabase.from('shows').select(showColumns.join(', ')),
        supabase.from('performances').select(performanceColumns.join(', ')),
        listEvents(),
      ])

    if (showsError) throw showsError
    if (perfError) throw perfError

    const showIdByEntase = new Map()
    const showIdBySlug = new Map()
    for (const show of shows ?? []) {
      if (!show) continue
      if (show.slug) {
        showIdBySlug.set(show.slug, show.id)
      }
      if (hasEntaseShowId && show.entase_id) {
        showIdByEntase.set(String(show.entase_id), show.id)
      }
    }

    const eventById = new Map()
    if (hasEntaseEventId) {
      for (const performance of performances ?? []) {
        if (performance?.entase_event_id) {
          eventById.set(String(performance.entase_event_id), performance)
        }
      }
    }

    const duplicateChecker = createDuplicateChecker(performances ?? [], DEDUPE_WINDOW_MS)

    const inserts = []
    const updates = []

    for (const event of events) {
      if (!event.startTime) continue

      let showId = null
      if (hasEntaseShowId && event.productionId && showIdByEntase.has(event.productionId)) {
        showId = showIdByEntase.get(event.productionId)
      } else if (showIdBySlug.has(event.productionSlug)) {
        showId = showIdBySlug.get(event.productionSlug)
      }
      if (!showId) continue

      if (hasEntaseEventId && eventById.has(event.id)) {
        updates.push(mapEventToPerformancePayload(event, showId, { includeEntaseId: true }))
        continue
      }

      const eventDate = new Date(event.startTime)
      if (Number.isNaN(eventDate.getTime())) continue

      if (duplicateChecker(showId, eventDate.getTime())) {
        continue
      }

      const payload = mapEventToPerformancePayload(event, showId, {
        includeEntaseId: hasEntaseEventId,
      })
      inserts.push(payload)
    }

    let inserted = 0
    let updated = 0

    if (inserts.length > 0) {
      const { data, error } = await supabase
        .from('performances')
        .insert(inserts)
        .select('id')
      if (error) throw error
      inserted = data?.length ?? 0
    }

    if (hasEntaseEventId && updates.length > 0) {
      const { data, error } = await supabase
        .from('performances')
        .upsert(updates, { onConflict: 'entase_event_id' })
        .select('id')
      if (error) throw error
      updated = data?.length ?? 0
    }

    return Response.json(
      {
        ok: true,
        schedule: EXPECTED_CRON_SCHEDULE,
        attempted: events.length,
        inserted,
        updated,
        skipped: events.length - inserted - updated,
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    )
  } catch (error) {
    console.error('Failed to sync Entase events', error)
    return Response.json(
      {
        ok: false,
        error: 'Failed to sync events.',
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

function createDuplicateChecker(existingPerformances, windowMs) {
  const registry = new Map()
  for (const performance of existingPerformances) {
    if (!performance?.idShow || !performance?.time) continue
    const showId = performance.idShow
    const time = new Date(performance.time).getTime()
    if (Number.isNaN(time)) continue
    const times = registry.get(showId) ?? []
    times.push(time)
    registry.set(showId, times)
  }
  return (showId, timestamp) => {
    const times = registry.get(showId) ?? []
    for (const time of times) {
      if (Math.abs(time - timestamp) <= windowMs) {
        return true
      }
    }
    times.push(timestamp)
    registry.set(showId, times)
    return false
  }
}
