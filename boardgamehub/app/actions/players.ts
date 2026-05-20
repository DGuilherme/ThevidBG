'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createPlayer, deletePlayer } from '@/lib/supabase/mutations/players'

export async function createPlayerAction(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const name = (formData.get('name') as string | null)?.trim()
  if (!name) return

  await createPlayer(supabase, { user_id: user.id, name })
  revalidatePath('/players')
}

export async function deletePlayerAction(playerId: string) {
  const supabase = await createServerSupabaseClient()
  await deletePlayer(supabase, playerId)
  revalidatePath('/players')
}
