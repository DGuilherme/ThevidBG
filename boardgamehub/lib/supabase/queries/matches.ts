import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import type { MatchWithDetails } from '@/types/app'

type Client = SupabaseClient<Database>

export async function getMatches(
  client: Client,
  userId: string,
  limit = 20,
  offset = 0
): Promise<MatchWithDetails[]> {
  const { data, error } = await client
    .from('match_logs')
    .select(`
      *,
      game:games_collection(id, title, image_url, thumbnail_url),
      players:match_players(*, player:players(*))
    `)
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return data as unknown as MatchWithDetails[]
}

export async function getMatchById(client: Client, id: string): Promise<MatchWithDetails> {
  const { data, error } = await client
    .from('match_logs')
    .select(`
      *,
      game:games_collection(id, title, image_url, thumbnail_url),
      players:match_players(*, player:players(*))
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data as unknown as MatchWithDetails
}

export async function getMatchesByGame(client: Client, gameId: string) {
  const { data, error } = await client
    .from('match_logs')
    .select(`*, players:match_players(*, player:players(*))`)
    .eq('game_id', gameId)
    .order('date', { ascending: false })

  if (error) throw error
  return data
}
