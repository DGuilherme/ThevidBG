import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq, ne, or, ilike, and } from 'drizzle-orm'

export async function getUser(userId: string) {
  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      username: users.username,
      avatar_url: users.avatar_url,
      created_at: users.created_at,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)
  return rows[0] ?? null
}

export async function searchUsers(query: string, excludeUserId: string) {
  return db
    .select({ id: users.id, email: users.email, username: users.username })
    .from(users)
    .where(
      and(
        ne(users.id, excludeUserId),
        or(
          ilike(users.username, `%${query}%`),
          ilike(users.email, `%${query}%`)
        )
      )
    )
    .limit(5)
}
