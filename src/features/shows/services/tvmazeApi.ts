import type { SearchShowItem, TVShow } from '@/features/shows/types/show.types'

const BASE = 'https://api.tvmaze.com'

type CacheEntry<T> = { value: T; expiresAt: number }

const cache = new Map<string, CacheEntry<unknown>>()
const DEFAULT_TTL_MS = 5 * 60 * 1000

function cacheKey(path: string): string {
  return path
}

function getCached<T>(key: string): T | undefined {
  const hit = cache.get(key)
  if (!hit) return undefined
  if (Date.now() > hit.expiresAt) {
    cache.delete(key)
    return undefined
  }
  return hit.value as T
}

function setCache<T>(key: string, value: T, ttlMs: number = DEFAULT_TTL_MS): void {
  cache.set(key, { value, expiresAt: Date.now() + ttlMs })
}

async function fetchJson<T>(path: string, opts?: { useCache?: boolean }): Promise<T> {
  const useCache = opts?.useCache !== false
  const key = cacheKey(path)
  if (useCache) {
    const cached = getCached<T>(key)
    if (cached !== undefined) return cached
  }

  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) {
    throw new Error(`TVMaze API error: ${res.status}`)
  }
  const data = (await res.json()) as T
  if (useCache) setCache(key, data)
  return data
}

/** First page of the catalog (~250 items). Enough to populate genre rows without hammering the API. */
export async function fetchShowPage(page = 0): Promise<TVShow[]> {
  return fetchJson<TVShow[]>(`/shows?page=${page}`)
}

export async function searchShows(query: string): Promise<SearchShowItem[]> {
  const q = query.trim()
  if (!q) return []
  const encoded = encodeURIComponent(q)
  return fetchJson<SearchShowItem[]>(`/search/shows?q=${encoded}`, {
    useCache: false,
  })
}

export async function fetchShowById(id: number): Promise<TVShow> {
  return fetchJson<TVShow>(`/shows/${id}`)
}
