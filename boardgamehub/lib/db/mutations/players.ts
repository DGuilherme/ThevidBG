import { db } from '@/lib/db'
import { players } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import type { NewPlayer } from '@/lib/db/schema'

export async function createPlayer(player: NewPlayer) {
  const rows = await db.insert(players).values(player).returning()
  return rows[0]
}

export async function updatePlayer(id: string, updates: Partial<NewPlayer>) {
  const rows = await db.update(players).set(updates).where(eq(players.id, id)).returning()
  return rows[0]
}

export async function deletePlayer(id: string) {
  await db.delete(players).where(eq(players.id, id))
}
