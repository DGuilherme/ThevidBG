'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'
import { wishlist } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { addGame } from '@/lib/db/mutations/collection'
import type { BggGameDetail } from '@/types/bgg'

export async function addToWishlist(bggGame: BggGameDetail, priority = 3) {
  const session = await getSession()
  if (!session.userId) throw new Error('Not authenticated')

  await db.insert(wishlist).values({
    user_id: session.userId,
    bgg_id: bggGame.id,
    title: bggGame.name,
    image_url: bggGame.image || null,
    thumbnail_url: bggGame.thumbnail || null,
    priority,
  })

  revalidatePath('/wishlist')
}

export async function removeFromWishlist(itemId: string) {
  await db.delete(wishlist).where(eq(wishlist.id, itemId))
  revalidatePath('/wishlist')
}

export async function moveToCollection(itemId: string, bggGame: BggGameDetail) {
  const session = await getSession()
  if (!session.userId) throw new Error('Not authenticated')

  await Promise.all([
    addGame({
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
    }),
    db.delete(wishlist).where(eq(wishlist.id, itemId)),
  ])

  revalidatePath('/wishlist')
  revalidatePath('/collection')
}
