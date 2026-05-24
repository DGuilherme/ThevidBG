import { db } from '@/lib/db'
import { players } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'

export async function getPlayers(userId: string) {
  return db
    .select()
    .from(players)
    .where(eq(players.user_id, userId))
    .orderBy(asc(players.name))
}

export async function getPlayerById(id: string) {
  const rows = await db.select().from(players).where(eq(players.id, id)).limit(1)
  return rows[0] ?? null
}
