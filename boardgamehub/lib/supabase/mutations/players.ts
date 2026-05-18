import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

type Client = SupabaseClient<Database>
type InsertPlayer = Database['public']['Tables']['players']['Insert']

export async function createPlayer(client: Client, player: InsertPlayer) {
  const { data, error } = await client.from('players').insert(player).select().single()
  if (error) throw error
  return data
}

export async function updatePlayer(
  client: Client,
  id: string,
  updates: Partial<InsertPlayer>
) {
  const { data, error } = await client
    .from('players')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deletePlayer(client: Client, id: string) {
  const { error } = await client.from('players').delete().eq('id', id)
  if (error) throw error
}
