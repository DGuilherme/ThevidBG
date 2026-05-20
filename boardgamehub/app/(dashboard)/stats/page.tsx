import type { Metadata } from 'next'
import { BarChart2, Trophy, Flame, TrendingUp, Clock } from 'lucide-react'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getCollection, getShelfOfShame } from '@/lib/supabase/queries/collection'
import { getMatches } from '@/lib/supabase/queries/matches'
import { getPlayers } from '@/lib/supabase/queries/players'

export const metadata: Metadata = { title: 'Stats' }

export default async function StatsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [collection, shame, matches, players] = await Promise.all([
    getCollection(supabase, user!.id),
    getShelfOfShame(supabase, user!.id),
    getMatches(supabase, user!.id, 500),
    getPlayers(supabase, user!.id),
  ])

  if (collection.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-4 rounded-2xl border border-dashed border-border">
        <BarChart2 className="size-12 text-muted-foreground/30" />
        <div>
          <p className="font-semibold">No stats yet</p>
          <p className="text-sm text-muted-foreground mt-1">Add games and log matches to see your stats here.</p>
        </div>
      </div>
    )
  }

  // Derived
  const gamePlays: Record<string, { title: string; count: number }> = {}
  matches.forEach((m) => {
    if (!gamePlays[m.game.id]) gamePlays[m.game.id] = { title: m.game.title, count: 0 }
    gamePlays[m.game.id].count++
  })
  const topGames = Object.values(gamePlays).sort((a, b) => b.count - a.count).slice(0, 5)
  const maxPlays = topGames[0]?.count ?? 1

  const playerStats: Record<string, { name: string; wins: number; total: number }> = {}
  matches.forEach((m) => {
    m.players.forEach((mp) => {
      if (!playerStats[mp.player_id]) playerStats[mp.player_id] = { name: mp.player.name, wins: 0, total: 0 }
      playerStats[mp.player_id].total++
      if (mp.is_winner) playerStats[mp.player_id].wins++
    })
  })
  const topPlayers = Object.values(playerStats)
    .filter((p) => p.total >= 3)
    .map((p) => ({ ...p, rate: Math.round((p.wins / p.total) * 100) }))
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 5)

  const withDuration = matches.filter((m) => m.duration_minutes)
  const avgDuration = withDuration.length
    ? Math.round(withDuration.reduce((s, m) => s + m.duration_minutes!, 0) / withDuration.length)
    : null

  const summaryCards = [
    { label: 'Total games', value: collection.length, icon: BarChart2, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { label: 'Total matches', value: matches.length, icon: Flame, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Unique games played', value: Object.keys(gamePlays).length, icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Shelf of shame', value: shame.length, icon: Trophy, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { label: 'Players tracked', value: players.length, icon: Trophy, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'Avg match duration', value: avgDuration ? `${avgDuration}m` : '—', icon: Clock, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  ]

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="text-2xl font-bold">Stats</h1>

      {/* Summary grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {summaryCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-4 relative overflow-hidden">
            <div className="absolute right-3 top-3 opacity-[0.06] pointer-events-none">
              <Icon className="size-14" />
            </div>
            <div className={`size-8 rounded-lg ${bg} flex items-center justify-center mb-2.5`}>
              <Icon className={`size-4 ${color}`} />
            </div>
            <p className="text-2xl font-black tabular-nums">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Most played */}
      {topGames.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Most played</h2>
          <div className="space-y-2">
            {topGames.map((g, i) => (
              <div key={g.title} className="rounded-xl border border-border bg-card/50 px-4 py-3">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs text-muted-foreground w-4 tabular-nums">{i + 1}</span>
                  <span className="text-sm font-medium flex-1 truncate">{g.title}</span>
                  <span className="text-xs text-muted-foreground shrink-0 tabular-nums">{g.count}×</span>
                </div>
                {/* Bar */}
                <div className="ml-7 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${(g.count / maxPlays) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Win rates */}
      {topPlayers.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Win rates (min. 3 matches)</h2>
          <div className="space-y-2">
            {topPlayers.map((p, i) => (
              <div key={p.name} className="rounded-xl border border-border bg-card/50 px-4 py-3">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs text-muted-foreground w-4 tabular-nums">{i + 1}</span>
                  <span className="text-sm font-medium flex-1">{p.name}</span>
                  <span className="text-xs font-semibold text-amber-400 shrink-0 tabular-nums">{p.rate}%</span>
                </div>
                <div className="ml-7 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-500 transition-all"
                    style={{ width: `${p.rate}%` }}
                  />
                </div>
                <p className="ml-7 text-[10px] text-muted-foreground mt-1">{p.wins} wins / {p.total} matches</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
