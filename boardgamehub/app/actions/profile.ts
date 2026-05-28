'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getSession } from '@/lib/session'
import bcrypt from 'bcryptjs'

export async function updateUsernameAction(
  _prev: { error?: string; success?: boolean } | undefined,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const session = await getSession()
  if (!session.userId) return { error: 'Not authenticated' }

  const username = (formData.get('username') as string ?? '').trim()
  if (username.length < 2) return { error: 'Username must be at least 2 characters' }
  if (!/^[a-zA-Z0-9_.-]+$/.test(username)) return { error: 'Only letters, numbers, _ . and - allowed' }

  try {
    await db.update(users).set({ username }).where(eq(users.id, session.userId))
    revalidatePath('/profile')
    return { success: true }
  } catch {
    return { error: 'Username already taken' }
  }
}

export async function changePasswordAction(
  _prev: { error?: string; success?: boolean } | undefined,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const session = await getSession()
  if (!session.userId) return { error: 'Not authenticated' }

  const currentPassword = formData.get('current_password') as string
  const newPassword = formData.get('new_password') as string

  if (!currentPassword || !newPassword) return { error: 'All fields required' }
  if (newPassword.length < 8) return { error: 'New password must be at least 8 characters' }

  const rows = await db
    .select({ password_hash: users.password_hash })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1)

  if (!rows[0]) return { error: 'User not found' }

  const valid = await bcrypt.compare(currentPassword, rows[0].password_hash)
  if (!valid) return { error: 'Current password is incorrect' }

  const hash = await bcrypt.hash(newPassword, 12)
  await db.update(users).set({ password_hash: hash }).where(eq(users.id, session.userId))
  return { success: true }
}
