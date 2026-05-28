import { db } from '@/lib/db'
import { match_logs, match_players, games_collection, players } from '@/lib/db/schema'
import { eq, desc, inArray, count } from 'drizzle-orm'
import type { MatchWithDetails } from '@/types/app'

type FlatRow = {
  match: typeof match_logs.$inferSelect
  game: { id: string; title: string; image_url: string | null; thumbnail_url: string | null }
  match_player: typeof match_players.$inferSelect
  player: typeof players.$inferSelect
}

function groupMatchRows(rows: FlatRow[]): MatchWithDetails[] {
  const map = new Map<string, MatchWithDetails>()
  for (const row of rows) {
    if (!map.has(row.match.id)) {
      map.set(row.match.id, { ...row.match, game: row.game, players: [] })
    }
    map.get(row.match.id)!.players.push({ ...row.match_player, player: row.player })
  }
  return [...map.values()]
}

async function fetchMatchRows(matchIds: string[]): Promise<FlatRow[]> {
  return db
    .select({
      match: match_logs,
      game: {
        id: games_collection.id,
        title: games_collection.title,
        image_url: games_collection.image_url,
        thumbnail_url: games_collection.thumbnail_url,
      },
      match_player: match_players,
      player: players,
    })
    .from(match_logs)
    .innerJoin(games_collection, eq(match_logs.game_id, games_collection.id))
    .innerJoin(match_players, eq(match_players.match_id, match_logs.id))
    .innerJoin(players, eq(match_players.player_id, players.id))
    .where(inArray(match_logs.id, matchIds))
    .orderBy(desc(match_logs.date), desc(match_logs.created_at))
}

export async function getMatches(
  userId: string,
  limit = 20,
  offset = 0
): Promise<MatchWithDetails[]> {
  const page = await db
    .select({ id: match_logs.id })
    .from(match_logs)
    .where(eq(match_logs.user_id, userId))
    .orderBy(desc(match_logs.date), desc(match_logs.created_at))
    .limit(limit)
    .offset(offset)

  if (page.length === 0) return []

  const rows = await fetchMatchRows(page.map((r) => r.id))
  return groupMatchRows(rows)
}

export async function countMatches(userId: string): Promise<number> {
  const result = await db
    .select({ n: count(match_logs.id) })
    .from(match_logs)
    .where(eq(match_logs.user_id, userId))
  return Number(result[0]?.n ?? 0)
}

export async function getMatchById(id: string): Promise<MatchWithDetails | null> {
  const rows = await fetchMatchRows([id])
  return rows.length === 0 ? null : groupMatchRows(rows)[0]
}

export async function getMatchesByGame(gameId: string): Promise<MatchWithDetails[]> {
  const matchIds = await db
    .select({ id: match_logs.id })
    .from(match_logs)
    .where(eq(match_logs.game_id, gameId))
    .orderBy(desc(match_logs.date))

  if (matchIds.length === 0) return []

  const rows = await fetchMatchRows(matchIds.map((r) => r.id))
  return groupMatchRows(rows)
}
