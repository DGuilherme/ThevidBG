import type { NextRequest } from 'next/server'
import { parseSearchResults } from '@/lib/bgg/parser'

const BGG_API = 'https://boardgamegeek.com/xmlapi2'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()

  if (!q || q.length < 2) {
    return Response.json({ error: 'Query too short' }, { status: 400 })
  }

  const res = await fetch(
    `${BGG_API}/search?query=${encodeURIComponent(q)}&type=boardgame`,
    { next: { revalidate: 3600 } }
  )

  if (!res.ok) return Response.json({ error: 'BGG unavailable' }, { status: 502 })

  const xml = await res.text()
  return Response.json(parseSearchResults(xml))
}
