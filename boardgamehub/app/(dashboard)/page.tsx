import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, Swords, Users, TrendingUp, Crown, ArrowRight } from 'lucide-react'
import { getSession } from '@/lib/session'
import { getCollection } from '@/lib/db/queries/collection'
import { getMatches } from '@/lib/db/queries/matches'
import { getPlayers } from '@/lib/db/queries/players'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Overview' }

const statConfig = [
  { label: 'Games owned', icon: BookOpen, href: '/collection', color: 'text-violet-400', bg: 'bg-violet-500/10' },
  { label: 'Matches logged', icon: Swords, href: '/matches', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { label: 'Players', icon: Users, href: '/players', color: 'text-amber-400', bg: 'bg-amber-500/10' },
]

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export default async function DashboardPage() {
  const session = await getSession()

  const [collection, matches, players] = await Promise.all([
    getCollection(session.userId),
    getMatches(session.userId, 5),
    getPlayers(session.userId),
  ])

  const values = [collection.length, matches.length, players.length]

  // Most played game from matches
  const playCounts: Record<string, { title: string; thumbnail: string | null; count: number }> = {}
  matches.forEach((m) => {
    if (!playCounts[m.game.id])
      playCounts[m.game.id] = { title: m.game.title, thumbnail: m.game.thumbnail_url, count: 0 }
    playCounts[m.game.id].count++
  })
  const topGame = Object.values(playCounts).sort((a, b) => b.count - a.count)[0] ?? null

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold">
          {greeting()} 🎲
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Here&apos;s your board game command center.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3">
        {statConfig.map(({ label, icon: Icon, href, color, bg }, i) => (
          <Link
            key={label}
            href={href}
            className="group rounded-2xl border border-border bg-card p-4 hover:border-primary/30 hover:bg-card/80 transition-colors relative overflow-hidden"
          >
            <div className="absolute right-3 top-3 opacity-5 pointer-events-none">
              <Icon className="size-16" />
            </div>
            <div className={cn('size-9 rounded-xl flex items-center justify-center mb-3', bg)}>
              <Icon className={cn('size-4.5', color)} />
            </div>
            <p className="text-3xl font-black tabular-nums">{values[i]}</p>
            <p className="text-xs text-muted-foreground mt-1 font-medium">{label}</p>
          </Link>
        ))}
      </div>

      {/* Quick insight */}
      {topGame && (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            <TrendingUp className="size-4 text-primary" />
            <span className="text-sm font-semibold">Most played recently</span>
          </div>
          <div className="flex items-center gap-4 p-4">
            <div className="relative size-14 rounded-xl overflow-hidden bg-muted shrink-0">
              {topGame.thumbnail && (
                <Image src={topGame.thumbnail} alt={topGame.title} fill sizes="56px" className="object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{topGame.title}</p>
              <p className="text-sm text-muted-foreground">{topGame.count} play{topGame.count !== 1 ? 's' : ''} logged</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent matches */}
      {matches.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Recent matches</h2>
            <Link href="/matches" className="flex items-center gap-1 text-xs text-primary hover:underline">
              View all <ArrowRight className="size-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {matches.slice(0, 3).map((m) => {
              const winner = m.players.find((p) => p.is_winner)
              return (
                <div
                  key={m.id}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card/50 px-4 py-3"
                >
                  <div className="relative size-10 rounded-lg overflow-hidden bg-muted shrink-0">
                    {m.game.thumbnail_url && (
                      <Image src={m.game.thumbnail_url} alt={m.game.title} fill sizes="40px" className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{m.game.title}</p>
                    <p className="text-xs text-muted-foreground">{m.date}</p>
                  </div>
                  {winner && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Crown className="size-3.5 text-amber-400" />
                      <span className="text-xs text-muted-foreground">{winner.player.name}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Empty state CTA */}
      {collection.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center space-y-3">
          <p className="text-4xl">🎲</p>
          <p className="font-semibold">Start building your collection</p>
          <p className="text-sm text-muted-foreground">Search for games on BoardGameGeek and add them here.</p>
          <Link
            href="/collection"
            className="inline-flex items-center gap-2 mt-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Go to Collection <ArrowRight className="size-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
