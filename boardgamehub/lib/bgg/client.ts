// All BGG calls go through our Next.js API proxy to avoid CORS and cache responses.
// Direct BGG API calls should never be made from the browser.

const BGG_PROXY = '/api/bgg'

export async function searchBggGames(query: string) {
  const res = await fetch(`${BGG_PROXY}/search?q=${encodeURIComponent(query)}`)
  if (!res.ok) throw new Error('BGG search failed')
  return res.json()
}

export async function getBggGameDetail(bggId: number) {
  const res = await fetch(`${BGG_PROXY}/thing?id=${bggId}`)
  if (!res.ok) throw new Error('BGG fetch failed')
  return res.json()
}
