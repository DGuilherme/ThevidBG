import type {
  User,
  GameCollection,
  Player,
  MatchLog,
  MatchPlayer,
  WishlistItem,
} from '@/lib/db/schema'

export type { User, GameCollection, Player, MatchLog, MatchPlayer, WishlistItem }

export type MatchWithDetails = MatchLog & {
  game: Pick<GameCollection, 'id' | 'title' | 'image_url' | 'thumbnail_url'>
  players: (MatchPlayer & { player: Player })[]
}

export type GameWithStats = GameCollection & {
  total_plays: number
  last_played: string | null
  win_rate: number | null
}

export type PlayerWithLink = Player & {
  linked_user: { id: string; email: string; username: string | null } | null
}

export type PlayerStats = Player & {
  total_matches: number
  wins: number
  win_rate: number
  favourite_game: Pick<GameCollection, 'id' | 'title' | 'thumbnail_url'> | null
}

export type CollectionStatus = GameCollection['status']
