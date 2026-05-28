import { db } from '@/lib/db'
import { players } from '@/lib/db/schema'
import { eq, and, ne, isNull } from 'drizzle-orm'
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

// Called after login/register — links any player records with matching email in other users' rosters.
export async function autoLinkPlayersByEmail(email: string, userId: string): Promise<void> {
  await db
    .update(players)
    .set({ linked_user_id: userId })
    .where(
      and(
        eq(players.email, email),
        isNull(players.linked_user_id),
        ne(players.user_id, userId),
      )
    )
}
