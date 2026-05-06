/** TVMaze rating object on embedded show resources */
export interface Rating {
  average: number | null
}

export interface ImageSet {
  medium: string
  original: string
}

/** Core show fields used across dashboard, search, and detail views */
export interface TVShow {
  id: number
  name: string
  genres: string[]
  rating: Rating
  image: ImageSet | null
  summary: string | null
  premiered: string | null
  officialSite: string | null
  url: string
}

export interface SearchShowItem {
  score: number
  show: TVShow
}

export type DashboardLoadState = 'idle' | 'loading' | 'success' | 'error'

export type SearchLoadState = 'idle' | 'loading' | 'success' | 'error'
