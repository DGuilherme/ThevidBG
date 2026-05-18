import type { Database } from './database'

export type User = Database['public']['Tables']['users']['Row']
export type GameCollection = Database['public']['Tables']['games_collection']['Row']
export type Player = Database['public']['Tables']['players']['Row']
export type MatchLog = Database['public']['Tables']['match_logs']['Row']
export type MatchPlayer = Database['public']['Tables']['match_players']['Row']
export type WishlistItem = Database['public']['Tables']['wishlist']['Row']

// Composite types used in the UI
export type MatchWithDetails = MatchLog & {
  game: Pick<GameCollection, 'id' | 'title' | 'image_url' | 'thumbnail_url'>
  players: (MatchPlayer & { player: Player })[]
}

export type GameWithStats = GameCollection & {
  total_plays: number
  last_played: string | null
  win_rate: number | null
}

export type PlayerStats = Player & {
  total_matches: number
  wins: number
  win_rate: number
  favourite_game: Pick<GameCollection, 'id' | 'title' | 'thumbnail_url'> | null
}

export type CollectionStatus = GameCollection['status']
