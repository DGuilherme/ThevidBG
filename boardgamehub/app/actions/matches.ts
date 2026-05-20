'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createMatch, deleteMatch } from '@/lib/supabase/mutations/matches'

interface LogMatchPayload {
  gameId: string
  date: string
  durationMinutes: number | null
  location: string | null
  notes: string | null
  players: {
    playerId: string
    isWinner: boolean
    score: number | null
  }[]
}

export async function logMatchAction(payload: LogMatchPayload): Promise<{ error: string } | undefined> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  try {
    await createMatch(supabase, {
      match: {
        user_id: user.id,
        game_id: payload.gameId,
        date: payload.date,
        duration_minutes: payload.durationMinutes,
        location: payload.location,
        notes: payload.notes,
      },
      players: payload.players.map((p, i) => ({
        player_id: p.playerId,
        is_winner: p.isWinner,
        score: p.score,
        position: i + 1,
      })),
    })
  } catch {
    return { error: 'Failed to save match. Please try again.' }
  }

  revalidatePath('/matches')
  revalidatePath('/stats')
  revalidatePath('/dashboard')
}

export async function deleteMatchAction(matchId: string): Promise<void> {
  const supabase = await createServerSupabaseClient()
  await deleteMatch(supabase, matchId).catch(() => {})
  revalidatePath('/matches')
  revalidatePath('/stats')
  revalidatePath('/dashboard')
}
