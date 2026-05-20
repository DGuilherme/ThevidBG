'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { addGame } from '@/lib/supabase/mutations/collection'
import type { BggGameDetail } from '@/types/bgg'

export async function addToWishlist(bggGame: BggGameDetail, priority = 3) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  await supabase.from('wishlist').insert({
    user_id: user.id,
    bgg_id: bggGame.id,
    title: bggGame.name,
    image_url: bggGame.image || null,
    thumbnail_url: bggGame.thumbnail || null,
    priority,
  })

  revalidatePath('/wishlist')
}

export async function removeFromWishlist(itemId: string) {
  const supabase = await createServerSupabaseClient()
  await supabase.from('wishlist').delete().eq('id', itemId)
  revalidatePath('/wishlist')
}

export async function moveToCollection(itemId: string, bggGame: BggGameDetail) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  await Promise.all([
    addGame(supabase, {
      user_id: user.id,
      bgg_id: bggGame.id,
      title: bggGame.name,
      image_url: bggGame.image || null,
      thumbnail_url: bggGame.thumbnail || null,
      min_players: bggGame.minPlayers || null,
      max_players: bggGame.maxPlayers || null,
      play_time: bggGame.playTime || null,
      year_published: bggGame.yearPublished || null,
      bgg_rating: bggGame.rating || null,
    }),
    supabase.from('wishlist').delete().eq('id', itemId),
  ])

  revalidatePath('/wishlist')
  revalidatePath('/collection')
}
