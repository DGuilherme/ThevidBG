'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/session'
import { addGame, removeGame, toggleShelfOfShame } from '@/lib/db/mutations/collection'
import type { BggGameDetail } from '@/types/bgg'

export async function addGameToCollection(bggGame: BggGameDetail) {
  const session = await getSession()
  if (!session.userId) throw new Error('Not authenticated')

  await addGame({
    user_id: session.userId,
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
  await removeGame(gameId)
  revalidatePath('/collection')
}

export async function toggleShelfOfShameAction(gameId: string, value: boolean) {
  await toggleShelfOfShame(gameId, value)
  revalidatePath('/collection')
}
