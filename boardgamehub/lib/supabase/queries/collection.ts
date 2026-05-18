import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import type { GameWithStats } from '@/types/app'

type Client = SupabaseClient<Database>

export async function getCollection(client: Client, userId: string) {
  const { data, error } = await client
    .from('games_collection')
    .select('*')
    .eq('user_id', userId)
    .order('added_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getCollectionWithStats(
  client: Client,
  userId: string
): Promise<GameWithStats[]> {
  // Joins match counts — extend as stats grow
  const { data, error } = await client
    .from('games_collection')
    .select(`
      *,
      match_logs(count)
    `)
    .eq('user_id', userId)
    .order('added_at', { ascending: false })

  if (error) throw error

  return (data ?? []).map((g) => ({
    ...g,
    total_plays: (g.match_logs as unknown as { count: number }[])[0]?.count ?? 0,
    last_played: null,
    win_rate: null,
  }))
}

export async function getGameById(client: Client, id: string) {
  const { data, error } = await client
    .from('games_collection')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function getShelfOfShame(client: Client, userId: string) {
  const { data, error } = await client
    .from('games_collection')
    .select('*')
    .eq('user_id', userId)
    .eq('shelf_of_shame', true)

  if (error) throw error
  return data
}
