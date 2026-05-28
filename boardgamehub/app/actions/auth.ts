'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getSession } from '@/lib/session'
import bcrypt from 'bcryptjs'
import { autoLinkPlayersByEmail } from '@/lib/db/mutations/players'

function safeRedirect(formData: FormData): string {
  const raw = (formData.get('redirect') as string) || ''
  return raw.startsWith('/') && !raw.startsWith('//') ? raw : '/'
}

export async function login(
  _prevState: { error: string } | undefined,
  formData: FormData
): Promise<{ error: string } | undefined> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const rows = await db.select().from(users).where(eq(users.email, email)).limit(1)
  const user = rows[0]

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return { error: 'Invalid email or password' }
  }

  const session = await getSession()
  session.userId = user.id
  session.email = user.email
  await session.save()

  await autoLinkPlayersByEmail(user.email, user.id)

  revalidatePath('/', 'layout')
  redirect(safeRedirect(formData))
}

export async function register(
  _prevState: { error: string } | undefined,
  formData: FormData
): Promise<{ error: string } | undefined> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1)
  if (existing.length > 0) return { error: 'Email already registered' }

  const password_hash = await bcrypt.hash(password, 12)
  const [user] = await db.insert(users).values({ email, password_hash }).returning()

  const session = await getSession()
  session.userId = user.id
  session.email = user.email
  await session.save()

  await autoLinkPlayersByEmail(user.email, user.id)

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function logout() {
  const session = await getSession()
  session.destroy()
  revalidatePath('/', 'layout')
  redirect('/login')
}
