import { db } from '@/lib/db'
import { wishlist } from '@/lib/db/schema'
import { eq, asc, desc } from 'drizzle-orm'

export async function getWishlist(userId: string) {
  return db
    .select()
    .from(wishlist)
    .where(eq(wishlist.user_id, userId))
    .orderBy(asc(wishlist.priority), desc(wishlist.added_at))
}
