import { db } from '@/lib/db'
import { games_collection } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import type { NewGameCollection } from '@/lib/db/schema'

export async function addGame(game: NewGameCollection) {
  const rows = await db.insert(games_collection).values(game).returning()
  return rows[0]
}

export async function updateGame(id: string, updates: Partial<NewGameCollection>) {
  const rows = await db
    .update(games_collection)
    .set(updates)
    .where(eq(games_collection.id, id))
    .returning()
  return rows[0]
}

export async function removeGame(id: string) {
  await db.delete(games_collection).where(eq(games_collection.id, id))
}

export async function toggleShelfOfShame(id: string, value: boolean) {
  return updateGame(id, { shelf_of_shame: value })
}
