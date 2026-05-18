import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

type Client = SupabaseClient<Database>
type InsertMatch = Database['public']['Tables']['match_logs']['Insert']
type InsertMatchPlayer = Database['public']['Tables']['match_players']['Insert']

export interface CreateMatchPayload {
  match: InsertMatch
  players: Omit<InsertMatchPlayer, 'match_id'>[]
}

export async function createMatch(client: Client, payload: CreateMatchPayload) {
  const { data: match, error: matchError } = await client
    .from('match_logs')
    .insert(payload.match)
    .select()
    .single()

  if (matchError) throw matchError

  const matchPlayers = payload.players.map((p) => ({ ...p, match_id: match.id }))
  const { error: playersError } = await client.from('match_players').insert(matchPlayers)

  if (playersError) {
    // Roll back match if players insert fails
    await client.from('match_logs').delete().eq('id', match.id)
    throw playersError
  }

  return match
}

export async function deleteMatch(client: Client, id: string) {
  // match_players cascade-deletes via FK
  const { error } = await client.from('match_logs').delete().eq('id', id)
  if (error) throw error
}
