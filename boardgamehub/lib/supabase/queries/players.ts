import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

type Client = SupabaseClient<Database>

export async function getPlayers(client: Client, userId: string) {
  const { data, error } = await client
    .from('players')
    .select('*')
    .eq('user_id', userId)
    .order('name')

  if (error) throw error
  return data
}

export async function getPlayerById(client: Client, id: string) {
  const { data, error } = await client
    .from('players')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}
