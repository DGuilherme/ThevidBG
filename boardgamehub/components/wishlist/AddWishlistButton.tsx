'use client'

import { BggSearchFlow } from '@/components/shared/BggSearchFlow'
import { addToWishlist } from '@/app/actions/wishlist'
import type { BggGameDetail } from '@/types/bgg'

export function AddWishlistButton() {
  async function handleAdd(bggId: number) {
    const res = await fetch(`/api/bgg/thing?id=${bggId}`)
    if (!res.ok) throw new Error('Failed to fetch game details')
    const game: BggGameDetail = await res.json()
    await addToWishlist(game)
  }

  return <BggSearchFlow onAdd={handleAdd} label="Add to wishlist" />
}
