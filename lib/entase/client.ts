import 'server-only'

import { setTimeout as sleep } from 'node:timers/promises'

type FetchOptions = {
  searchParams?: Record<string, string | number | undefined | null>
  init?: RequestInit
  retries?: number
  backoffMs?: number
}

export interface MappedProduction {
  id: string
  slug: string
  title: string
  category: string
  author: string | null
  story: string | null
  synopsis: string | null
  posterUrl: string | null
  imageUrl: string | null
  landscapeUrl: string | null
  updatedAt: string | null
  raw: unknown
}

export interface MappedEvent {
  id: string
  productionId: string | null
  productionSlug: string
  startTime: string | null
  endTime: string | null
  status: string | null
  raw: unknown
}

const DEFAULT_BASE_URL = 'https://api.entase.com/v1/'
const RETRYABLE_STATUS = new Set([408, 409, 425, 429, 500, 502, 503, 504])
const DEFAULT_PAGE_SIZE = 50

class EntaseRequestError extends Error {
  response?: Response

  constructor(message: string, response?: Response) {
    super(message)
    this.name = 'EntaseRequestError'
    this.response = response
  }
}

function getApiKey(): string {
  const apiKey = process.env.ENTASE_API_KEY
  if (!apiKey) {
    throw new Error('ENTASE_API_KEY env var is required for Entase requests')
  }
  return apiKey
}

function getBaseUrl(): string {
  const baseUrl = process.env.ENTASE_API_BASE_URL?.trim() || DEFAULT_BASE_URL
  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
}

function buildUrl(path: string, searchParams?: FetchOptions['searchParams']): URL {
  const baseUrl = getBaseUrl()
  const normalizedPath = path.startsWith('http')
    ? path
    : `${baseUrl}${path.startsWith('/') ? path.slice(1) : path}`
  const url = new URL(normalizedPath)
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value === undefined || value === null) continue
      url.searchParams.set(key, String(value))
    }
  }
  return url
}

async function entaseFetch(path: string, options: FetchOptions = {}): Promise<any> {
  const { searchParams, init, retries = 3, backoffMs = 500 } = options
  const apiKey = getApiKey()
  let attempt = 0
  let lastError: unknown
  while (attempt <= retries) {
    try {
      const url = buildUrl(path, searchParams)
      const response = await fetch(url.toString(), {
        ...init,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          ...(init?.headers ?? {}),
        },
      })
      if (!response.ok) {
        if (RETRYABLE_STATUS.has(response.status) && attempt < retries) {
          await sleep(backoffMs * Math.pow(2, attempt))
          attempt += 1
          continue
        }
        const message = await safeReadText(response)
        throw new EntaseRequestError(
          `Entase request failed with status ${response.status}: ${message || response.statusText}`,
          response
        )
      }
      const text = await safeReadText(response)
      if (!text) return null
      try {
        return JSON.parse(text)
      } catch (error) {
        throw new EntaseRequestError('Failed to parse Entase response as JSON', response)
      }
    } catch (error) {
      lastError = error
      if (error instanceof EntaseRequestError) {
        throw error
      }
      if (attempt >= retries) {
        throw error
      }
      await sleep(backoffMs * Math.pow(2, attempt))
    }
    attempt += 1
  }
  throw lastError instanceof Error
    ? lastError
    : new Error('Unknown Entase fetch error')
}

async function safeReadText(response: Response): Promise<string> {
  try {
    return await response.text()
  } catch (error) {
    console.error('Failed to read Entase response text', error)
    return ''
  }
}

function extractItems(payload: any): any[] {
  if (!payload) return []
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload.data)) return payload.data
  if (Array.isArray(payload.items)) return payload.items
  if (Array.isArray(payload.results)) return payload.results
  if (payload.list && Array.isArray(payload.list)) return payload.list
  return []
}

function nextPageInfo(payload: any, currentPage: number): { page?: number; url?: string } | null {
  if (!payload) return null
  if (payload.pagination) {
    const { next, page, total_pages: totalPages } = payload.pagination
    if (typeof next === 'number') return { page: next }
    if (typeof next === 'string') return { url: next }
    if (typeof page === 'number' && typeof totalPages === 'number') {
      if (page < totalPages) return { page: page + 1 }
    }
  }
  if (payload.meta) {
    const { next_page: nextPage, current_page: currentPage, last_page: lastPage, next } = payload.meta
    if (typeof next === 'string' && next) return { url: next }
    if (typeof nextPage === 'number') return { page: nextPage }
    if (
      typeof currentPage === 'number' &&
      typeof lastPage === 'number' &&
      currentPage < lastPage
    ) {
      return { page: currentPage + 1 }
    }
  }
  if (payload.links?.next) {
    return { url: payload.links.next }
  }
  if (typeof payload.next_page === 'number') {
    return { page: payload.next_page }
  }
  if (typeof payload.next === 'string') {
    return { url: payload.next }
  }
  if (typeof payload.next === 'number') {
    return { page: payload.next }
  }
  if (typeof payload.total_pages === 'number' && currentPage < payload.total_pages) {
    return { page: currentPage + 1 }
  }
  return null
}

async function fetchPaginated(path: string, params: Record<string, any> = {}): Promise<any[]> {
  const items: any[] = []
  let page = typeof params.page === 'number' ? params.page : 1
  let nextUrl: string | undefined
  let hasMore = true
  while (hasMore) {
    const searchParams = { ...params, page, per_page: params.per_page ?? DEFAULT_PAGE_SIZE }
    const payload = await entaseFetch(nextUrl ?? path, { searchParams })
    items.push(...extractItems(payload))
    const info = nextPageInfo(payload, page)
    if (!info) {
      hasMore = false
    } else if (info.url) {
      nextUrl = info.url
      page += 1
    } else if (typeof info.page === 'number') {
      page = info.page
      nextUrl = undefined
    } else {
      hasMore = false
    }
  }
  return items
}

function sanitizeText(value: unknown): string | null {
  if (!value) return null
  const text = String(value)
  if (!text.trim()) return null
  return text
}

export function sanitizeStory(value: unknown): string | null {
  const text = sanitizeText(value)
  if (!text) return null
  return text
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function slugify(input: unknown, fallback = 'entase-item'): string {
  const value = sanitizeText(input) ?? fallback
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    || fallback
}

async function maybeVerifyAsset(url: string | null, shouldVerify: boolean): Promise<string | null> {
  if (!url) return null
  if (!shouldVerify) return url
  try {
    const response = await fetch(url, { method: 'HEAD' })
    if (response.ok) return url
  } catch (error) {
    console.warn('Failed to verify Entase asset', error)
  }
  return null
}

function normalizeDate(value: unknown): string | null {
  if (!value) return null
  const date = new Date(value as string)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString()
}

function normalizeId(value: unknown): string {
  if (value === null || value === undefined) return ''
  const id = String(value).trim()
  return id
}

export async function listProductions(options: { fetchPhotos?: boolean } = {}): Promise<MappedProduction[]> {
  const { fetchPhotos = false } = options
  const rawProductions = await fetchPaginated('productions')
  const mapped: MappedProduction[] = []
  for (const raw of rawProductions) {
    const id = normalizeId(raw?.id ?? raw?.uuid ?? raw?.production_id)
    if (!id) continue
    const title = sanitizeText(raw?.title ?? raw?.name) ?? `Production ${id}`
    const slugSource = sanitizeText(raw?.slug ?? raw?.handle) ?? title
    const slug = slugify(slugSource)
    mapped.push({
      id,
      slug,
      title,
      category: sanitizeText(raw?.category ?? raw?.genre) ?? 'production',
      author: sanitizeText(raw?.author ?? raw?.writer ?? raw?.playwright) ?? null,
      story: sanitizeStory(raw?.story ?? raw?.synopsis ?? raw?.description) ?? null,
      synopsis: sanitizeStory(raw?.synopsis ?? raw?.short_description) ?? null,
      posterUrl: await maybeVerifyAsset(
        sanitizeText(
          raw?.poster_url ??
            raw?.poster?.url ??
            raw?.images?.poster ??
            raw?.images?.portrait ??
            raw?.poster
        ),
        fetchPhotos
      ),
      imageUrl: await maybeVerifyAsset(
        sanitizeText(
          raw?.image_url ??
            raw?.cover_url ??
            raw?.images?.square ??
            raw?.images?.cover ??
            raw?.images?.primary ??
            raw?.thumbnail
        ),
        fetchPhotos
      ),
      landscapeUrl: await maybeVerifyAsset(
        sanitizeText(raw?.images?.landscape ?? raw?.banner_url ?? raw?.hero_url ?? raw?.images?.hero),
        fetchPhotos
      ),
      updatedAt: normalizeDate(raw?.updated_at ?? raw?.updatedAt),
      raw,
    })
  }
  return mapped
}

export async function listEvents(): Promise<MappedEvent[]> {
  const rawEvents = await fetchPaginated('events', { per_page: 100 })
  const mapped: MappedEvent[] = []
  for (const raw of rawEvents) {
    const id = normalizeId(raw?.id ?? raw?.event_id ?? raw?.uuid)
    if (!id) continue
    const productionId = normalizeId(raw?.production_id ?? raw?.production?.id)
    const productionSlugSource =
      sanitizeText(raw?.production?.slug ?? raw?.production_slug ?? raw?.production?.handle) ||
      sanitizeText(raw?.production?.title ?? raw?.production_name)
    const productionSlug = slugify(productionSlugSource, productionId || 'entase-production')
    mapped.push({
      id,
      productionId: productionId || null,
      productionSlug,
      startTime: normalizeDate(raw?.start ?? raw?.start_at ?? raw?.startAt ?? raw?.datetime),
      endTime: normalizeDate(raw?.end ?? raw?.end_at ?? raw?.endAt),
      status: sanitizeText(raw?.status ?? raw?.state) ?? null,
      raw,
    })
  }
  return mapped
}

export function mapProductionToShowPayload(
  production: MappedProduction,
  options: { includeEntaseId?: boolean } = {}
): Record<string, any> {
  const payload: Record<string, any> = {
    title: production.title,
    slug: production.slug,
    category: production.category,
    information: production.story ?? production.synopsis ?? '',
    author: production.author ?? '',
    image_URL: production.imageUrl,
    poster_URL: production.posterUrl,
    picture_personalURL: production.landscapeUrl,
  }
  if (options.includeEntaseId) {
    payload.entase_id = production.id
    payload.entase_updated_at = production.updatedAt
  }
  return payload
}

export function mapEventToPerformancePayload(
  event: MappedEvent,
  showId: number,
  options: { includeEntaseId?: boolean } = {}
): Record<string, any> {
  const payload: Record<string, any> = {
    idShow: showId,
    time: event.startTime,
  }
  if (options.includeEntaseId) {
    payload.entase_event_id = event.id
    payload.entase_production_id = event.productionId
  }
  return payload
}
