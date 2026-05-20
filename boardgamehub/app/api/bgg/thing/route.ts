import type { NextRequest } from 'next/server'
import { parseGameDetail } from '@/lib/bgg/parser'

const BGG_API = 'https://boardgamegeek.com/xmlapi2'

export async function GET(req: NextRequest) {
  const id = Number(req.nextUrl.searchParams.get('id'))

  if (!id || isNaN(id)) {
    return Response.json({ error: 'Invalid id' }, { status: 400 })
  }

  const res = await fetch(`${BGG_API}/thing?id=${id}&stats=1`, {
    next: { revalidate: 86400 },
  })

  if (!res.ok) return Response.json({ error: 'BGG unavailable' }, { status: 502 })

  const xml = await res.text()
  return Response.json(parseGameDetail(xml))
}
