'use client'

import { BggSearchFlow } from '@/components/shared/BggSearchFlow'
import { addGameToCollection } from '@/app/actions/collection'
import type { BggGameDetail } from '@/types/bgg'

export function AddGameButton() {
  async function handleAdd(bggId: number) {
    const res = await fetch(`/api/bgg/thing?id=${bggId}`)
    if (!res.ok) throw new Error('Failed to fetch game details')
    const game: BggGameDetail = await res.json()
    await addGameToCollection(game)
  }

  return <BggSearchFlow onAdd={handleAdd} label="Add game" />
}
