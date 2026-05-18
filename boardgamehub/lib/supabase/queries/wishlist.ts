import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

type Client = SupabaseClient<Database>

export async function getWishlist(client: Client, userId: string) {
  const { data, error } = await client
    .from('wishlist')
    .select('*')
    .eq('user_id', userId)
    .order('priority')
    .order('added_at', { ascending: false })

  if (error) throw error
  return data
}
