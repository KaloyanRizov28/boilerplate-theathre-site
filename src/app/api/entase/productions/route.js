import { listProductions } from '../../../../../lib/entase/client'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl
    const fetchPhotos = searchParams.get('fetchPhotos') === 'true'
    const includeRaw = searchParams.get('raw') === 'true'
    const productions = await listProductions({ fetchPhotos })

    const payload = productions.map((production) => {
      const { raw, ...rest } = production
      return includeRaw ? { ...rest, raw } : rest
    })

    return Response.json(
      {
        ok: true,
        count: payload.length,
        productions: payload,
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    )
  } catch (error) {
    console.error('Failed to load Entase productions', error)
    return Response.json(
      {
        ok: false,
        error: 'Failed to load productions from Entase.',
      },
      { status: 500 }
    )
  }
}
