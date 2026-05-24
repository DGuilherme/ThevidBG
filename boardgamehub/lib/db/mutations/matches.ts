import { db } from '@/lib/db'
import { match_logs, match_players } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import type { NewMatchLog, NewMatchPlayer } from '@/lib/db/schema'

export interface CreateMatchPayload {
  match: NewMatchLog
  players: Omit<NewMatchPlayer, 'match_id'>[]
}

export async function createMatch(payload: CreateMatchPayload) {
  return db.transaction(async (tx) => {
    const [match] = await tx.insert(match_logs).values(payload.match).returning()
    await tx
      .insert(match_players)
      .values(payload.players.map((p) => ({ ...p, match_id: match.id })))
    return match
  })
}

export async function deleteMatch(id: string) {
  // match_players cascade-deletes via FK
  await db.delete(match_logs).where(eq(match_logs.id, id))
}
