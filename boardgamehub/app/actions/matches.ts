'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/session'
import { createMatch, deleteMatch } from '@/lib/db/mutations/matches'

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
  const session = await getSession()
  if (!session.userId) return { error: 'Not authenticated' }

  try {
    await createMatch({
      match: {
        user_id: session.userId,
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
  await deleteMatch(matchId).catch(() => {})
  revalidatePath('/matches')
  revalidatePath('/stats')
  revalidatePath('/dashboard')
}
