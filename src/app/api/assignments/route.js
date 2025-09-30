import { listProductions, mapProductionToShowPayload } from '../../../../lib/entase/client'
import { createAdminClient } from '../../../../lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createAdminClient()
    const hasEntaseId = await checkColumnExists(supabase, 'shows', 'entase_id')

    const selectColumns = ['id', 'slug', 'title']
    if (hasEntaseId) {
      selectColumns.push('entase_id')
    }

    const [productions, { data: shows, error: showsError }] = await Promise.all([
      listProductions(),
      supabase.from('shows').select(selectColumns.join(', ')),
    ])

    if (showsError) throw showsError

    const matchedShowIds = new Set()
    const matches = []
    const unmatchedProductions = []
    const showByEntase = new Map()
    const showBySlug = new Map()

    for (const show of shows ?? []) {
      if (!show) continue
      if (hasEntaseId && show.entase_id) {
        showByEntase.set(String(show.entase_id), show)
      }
      if (show.slug) {
        showBySlug.set(show.slug, show)
      }
    }

    for (const production of productions) {
      const match = hasEntaseId
        ? showByEntase.get(production.id)
        : showBySlug.get(production.slug)
      if (match) {
        matchedShowIds.add(match.id)
        matches.push({
          productionId: production.id,
          productionTitle: production.title,
          productionSlug: production.slug,
          showId: match.id,
          showSlug: match.slug,
          showTitle: match.title,
        })
      } else {
        unmatchedProductions.push({
          id: production.id,
          title: production.title,
          slug: production.slug,
        })
      }
    }

    const unmatchedShows = (shows ?? [])
      .filter((show) => show && !matchedShowIds.has(show.id))
      .map((show) => ({ id: show.id, title: show.title, slug: show.slug }))

    return Response.json(
      {
        ok: true,
        matches,
        unmatchedProductions,
        unmatchedShows,
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    )
  } catch (error) {
    console.error('Failed to load Entase assignments', error)
    return Response.json(
      {
        ok: false,
        error: 'Failed to load assignments.',
      },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await safeJson(request)
    const productionId = body?.productionId
    const showId = body?.showId
    const fetchPhotos = body?.fetchPhotos === true

    if (!productionId || !showId) {
      return Response.json(
        { ok: false, error: 'productionId and showId are required.' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()
    const hasEntaseId = await checkColumnExists(supabase, 'shows', 'entase_id')
    if (!hasEntaseId) {
      return Response.json(
        { ok: false, error: 'Entase assignments require an entase_id column on shows.' },
        { status: 400 }
      )
    }

    const [{ data: show, error: showError }, productions] = await Promise.all([
      supabase.from('shows').select('id, slug').eq('id', showId).maybeSingle(),
      listProductions({ fetchPhotos }),
    ])

    if (showError) throw showError
    if (!show) {
      return Response.json({ ok: false, error: 'Show not found.' }, { status: 404 })
    }

    const production = productions.find((item) => item.id === String(productionId))
    if (!production) {
      return Response.json({ ok: false, error: 'Production not found.' }, { status: 404 })
    }

    const payload = mapProductionToShowPayload(
      { ...production, slug: show.slug },
      { includeEntaseId: true }
    )

    const { data, error } = await supabase
      .from('shows')
      .update(payload)
      .eq('id', showId)
      .select('id')
      .maybeSingle()

    if (error) throw error

    return Response.json(
      {
        ok: true,
        id: data?.id ?? showId,
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    )
  } catch (error) {
    console.error('Failed to update Entase assignment', error)
    return Response.json(
      {
        ok: false,
        error: 'Failed to update assignment.',
      },
      { status: 500 }
    )
  }
}

async function safeJson(request) {
  try {
    if (request.headers.get('content-length') === '0') {
      return null
    }
    return await request.json()
  } catch (error) {
    console.warn('Failed to parse JSON body', error)
    return null
  }
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
