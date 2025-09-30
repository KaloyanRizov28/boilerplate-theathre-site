import { createAdminClient } from '../../../../../lib/supabase/admin'
import { slugify as entaseSlugify } from '../../../../../lib/entase/client'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null)
    const production = body?.production
    const productionId = body?.productionId || production?.id

    if (!production && !productionId) {
      return Response.json(
        { ok: false, error: 'production or productionId is required.' },
        { status: 400 }
      )
    }

    const id = String(productionId || '').trim()
    const title = (production?.title && String(production.title)) || `Production ${id || ''}`.trim()
    const preferredSlug = production?.slug || title
    const entaseSlug = id ? `entase:${id}` : entaseSlugify(preferredSlug)

    const payload = {
      title,
      slug: entaseSlug,
      category: production?.category || 'production',
      information: production?.story || production?.synopsis || '',
      author: production?.author || '',
      image_URL: production?.imageUrl || null,
      poster_URL: production?.posterUrl || null,
      picture_personalURL: production?.landscapeUrl || null,
    }

    // Ensure server has service role key to bypass RLS for administrative writes
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return Response.json(
        { ok: false, error: 'Server missing SUPABASE_SERVICE_ROLE_KEY env. Add it to .env.local and restart.' },
        { status: 500 }
      )
    }

    const supabase = createAdminClient()

    // Try to find existing show by slug first to avoid relying on a unique constraint
    const { data: existing, error: selectError } = await supabase
      .from('shows')
      .select('id, title, slug')
      .eq('slug', entaseSlug)
      .maybeSingle()
    if (selectError) {
      return Response.json({ ok: false, error: selectError.message }, { status: 500 })
    }
    if (existing) {
      return Response.json({ ok: true, show: existing }, {
        headers: { 'Cache-Control': 'no-store' },
      })
    }

    // Insert new row
    const { data, error } = await supabase
      .from('shows')
      .insert([payload])
      .select('id, title, slug')
      .maybeSingle()

    if (error) {
      return Response.json({ ok: false, error: error.message }, { status: 500 })
    }

    return Response.json({ ok: true, show: data ?? payload }, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (error) {
    console.error('Failed to create show from Entase production', error)
    return Response.json({ ok: false, error: 'Failed to create show.' }, { status: 500 })
  }
}
