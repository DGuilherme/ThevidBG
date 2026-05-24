'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/session'
import { createPlayer, deletePlayer } from '@/lib/db/mutations/players'

export async function createPlayerAction(formData: FormData) {
  const session = await getSession()
  if (!session.userId) throw new Error('Not authenticated')

  const name = (formData.get('name') as string | null)?.trim()
  if (!name) return

  await createPlayer({ user_id: session.userId, name })
  revalidatePath('/players')
}

export async function deletePlayerAction(playerId: string) {
  await deletePlayer(playerId)
  revalidatePath('/players')
}
