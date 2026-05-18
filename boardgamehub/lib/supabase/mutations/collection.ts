import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

type Client = SupabaseClient<Database>
type InsertGame = Database['public']['Tables']['games_collection']['Insert']
type UpdateGame = Database['public']['Tables']['games_collection']['Update']

export async function addGame(client: Client, game: InsertGame) {
  const { data, error } = await client
    .from('games_collection')
    .insert(game)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateGame(client: Client, id: string, updates: UpdateGame) {
  const { data, error } = await client
    .from('games_collection')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removeGame(client: Client, id: string) {
  const { error } = await client.from('games_collection').delete().eq('id', id)
  if (error) throw error
}

export async function toggleShelfOfShame(client: Client, id: string, value: boolean) {
  return updateGame(client, id, { shelf_of_shame: value })
}
