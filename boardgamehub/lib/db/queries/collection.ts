import { db } from '@/lib/db'
import { games_collection, match_logs } from '@/lib/db/schema'
import { eq, desc, count, getTableColumns, and } from 'drizzle-orm'
import type { GameWithStats } from '@/types/app'

export async function getCollection(userId: string) {
  return db
    .select()
    .from(games_collection)
    .where(eq(games_collection.user_id, userId))
    .orderBy(desc(games_collection.added_at))
}

export async function getCollectionWithStats(userId: string): Promise<GameWithStats[]> {
  const results = await db
    .select({
      ...getTableColumns(games_collection),
      total_plays: count(match_logs.id),
    })
    .from(games_collection)
    .leftJoin(match_logs, eq(match_logs.game_id, games_collection.id))
    .where(eq(games_collection.user_id, userId))
    .groupBy(games_collection.id)
    .orderBy(desc(games_collection.added_at))

  return results.map((g) => ({
    ...g,
    total_plays: Number(g.total_plays),
    last_played: null,
    win_rate: null,
  }))
}

export async function getGameById(id: string) {
  const rows = await db
    .select()
    .from(games_collection)
    .where(eq(games_collection.id, id))
    .limit(1)
  return rows[0] ?? null
}

export async function getShelfOfShame(userId: string) {
  return db
    .select()
    .from(games_collection)
    .where(and(eq(games_collection.user_id, userId), eq(games_collection.shelf_of_shame, true)))
}
