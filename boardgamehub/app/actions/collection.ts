'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { addGame, removeGame, toggleShelfOfShame } from '@/lib/supabase/mutations/collection'
import type { BggGameDetail } from '@/types/bgg'

export async function addGameToCollection(bggGame: BggGameDetail) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  await addGame(supabase, {
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
  })

  revalidatePath('/collection')
}

export async function removeGameFromCollection(gameId: string) {
  const supabase = await createServerSupabaseClient()
  await removeGame(supabase, gameId)
  revalidatePath('/collection')
}

export async function toggleShelfOfShameAction(gameId: string, value: boolean) {
  const supabase = await createServerSupabaseClient()
  await toggleShelfOfShame(supabase, gameId, value)
  revalidatePath('/collection')
}
