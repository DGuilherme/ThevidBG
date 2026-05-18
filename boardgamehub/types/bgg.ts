// Types for the BoardGameGeek XML API v2 responses (after XML→JSON parsing)

export interface BggSearchResult {
  id: number
  name: string
  yearPublished: number | null
  type: 'boardgame' | 'boardgameexpansion' | 'boardgameaccessory'
}

export interface BggGameDetail {
  id: number
  name: string
  description: string
  yearPublished: number | null
  minPlayers: number
  maxPlayers: number
  playTime: number
  minAge: number
  image: string
  thumbnail: string
  rating: number | null
  rank: number | null
  categories: string[]
  mechanics: string[]
  designers: string[]
  publishers: string[]
  complexity: number | null
}
