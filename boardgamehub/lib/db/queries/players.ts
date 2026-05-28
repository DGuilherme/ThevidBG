import { db } from '@/lib/db'
import { players, users } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import type { PlayerWithLink } from '@/types/app'

export async function getPlayers(userId: string): Promise<PlayerWithLink[]> {
  const rows = await db
    .select({
      id: players.id,
      user_id: players.user_id,
      name: players.name,
      avatar_url: players.avatar_url,
      is_anonymous: players.is_anonymous,
      linked_user_id: players.linked_user_id,
      created_at: players.created_at,
      lu_id: users.id,
      lu_email: users.email,
      lu_username: users.username,
    })
    .from(players)
    .leftJoin(users, eq(players.linked_user_id, users.id))
    .where(eq(players.user_id, userId))
    .orderBy(asc(players.name))

  return rows.map((r) => ({
    id: r.id,
    user_id: r.user_id,
    name: r.name,
    avatar_url: r.avatar_url,
    is_anonymous: r.is_anonymous,
    linked_user_id: r.linked_user_id,
    created_at: r.created_at,
    linked_user: r.lu_id ? { id: r.lu_id, email: r.lu_email!, username: r.lu_username } : null,
  }))
}

export async function getPlayerById(id: string) {
  const rows = await db.select().from(players).where(eq(players.id, id)).limit(1)
  return rows[0] ?? null
}
