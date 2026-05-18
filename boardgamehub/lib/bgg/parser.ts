import { XMLParser } from 'fast-xml-parser'
import type { BggSearchResult, BggGameDetail } from '@/types/bgg'

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' })

function attr(node: Record<string, unknown>, key: string): string {
  return (node?.[`@_${key}`] as string) ?? ''
}

function value(node: Record<string, unknown> | undefined): string {
  return (node?.['@_value'] as string) ?? ''
}

export function parseSearchResults(xml: string): BggSearchResult[] {
  const json = parser.parse(xml)
  const items = json?.items?.item ?? []
  const list = Array.isArray(items) ? items : [items]

  return list.map((item: Record<string, unknown>) => ({
    id: Number(attr(item, 'id')),
    name: value(
      Array.isArray(item.name)
        ? (item.name as Record<string, unknown>[]).find((n) => attr(n, 'type') === 'primary')
        : (item.name as Record<string, unknown>)
    ),
    yearPublished: item.yearpublished ? Number(value(item.yearpublished as Record<string, unknown>)) : null,
    type: (attr(item, 'type') as BggSearchResult['type']) ?? 'boardgame',
  }))
}

export function parseGameDetail(xml: string): BggGameDetail {
  const json = parser.parse(xml)
  const item = json?.items?.item

  const names: Record<string, unknown>[] = Array.isArray(item.name) ? item.name : [item.name]
  const primaryName = names.find((n) => attr(n, 'type') === 'primary') ?? names[0]

  const statistics = item?.statistics?.ratings ?? {}

  return {
    id: Number(attr(item, 'id')),
    name: value(primaryName),
    description: item.description ?? '',
    yearPublished: item.yearpublished ? Number(value(item.yearpublished)) : null,
    minPlayers: Number(value(item.minplayers)) || 1,
    maxPlayers: Number(value(item.maxplayers)) || 1,
    playTime: Number(value(item.playingtime)) || 0,
    minAge: Number(value(item.minage)) || 0,
    image: item.image ?? '',
    thumbnail: item.thumbnail ?? '',
    rating: statistics.average ? Number(value(statistics.average)) : null,
    rank: null,
    categories: extractLinks(item.link, 'boardgamecategory'),
    mechanics: extractLinks(item.link, 'boardgamemechanic'),
    designers: extractLinks(item.link, 'boardgamedesigner'),
    publishers: extractLinks(item.link, 'boardgamepublisher'),
    complexity: statistics.averageweight ? Number(value(statistics.averageweight)) : null,
  }
}

function extractLinks(links: unknown, type: string): string[] {
  if (!links) return []
  const list = Array.isArray(links) ? links : [links]
  return list
    .filter((l: Record<string, unknown>) => attr(l, 'type') === type)
    .map((l: Record<string, unknown>) => attr(l, 'value'))
}
