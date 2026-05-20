import type { Metadata } from 'next'
import Image from 'next/image'
import { Swords, Crown, Clock, MapPin, Trash2 } from 'lucide-react'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getMatches } from '@/lib/supabase/queries/matches'
import { getCollection } from '@/lib/supabase/queries/collection'
import { getPlayers } from '@/lib/supabase/queries/players'
import { deleteMatchAction } from '@/app/actions/matches'
import { LogMatchFlow } from '@/components/matches/LogMatchFlow'
import { Button } from '@/components/ui/button'
import { BookOpen } from 'lucide-react'

export const metadata: Metadata = { title: 'Matches' }

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default async function MatchesPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [matches, games, players] = await Promise.all([
    getMatches(supabase, user!.id, 50),
    getCollection(supabase, user!.id),
    getPlayers(supabase, user!.id),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Matches</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {matches.length} {matches.length === 1 ? 'match' : 'matches'} logged
          </p>
        </div>
        <LogMatchFlow games={games ?? []} players={players ?? []} />
      </div>

      {matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4 rounded-2xl border border-dashed border-border">
          <Swords className="size-12 text-muted-foreground/30" />
          <div>
            <p className="font-semibold">No matches yet</p>
            <p className="text-sm text-muted-foreground mt-1">Log your first match to see history here.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map((match) => {
            const winners = match.players.filter((p) => p.is_winner)
            const losers = match.players.filter((p) => !p.is_winner)
            return (
              <div
                key={match.id}
                className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/20 transition-colors"
              >
                <div className="flex gap-4 p-4">
                  {/* Game thumbnail */}
                  <div className="relative size-16 rounded-xl overflow-hidden bg-muted shrink-0">
                    {match.game.thumbnail_url ? (
                      <Image
                        src={match.game.thumbnail_url}
                        alt={match.game.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="size-6 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{match.game.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{formatDate(match.date)}</p>

                    <div className="flex items-center gap-3 mt-1.5">
                      {match.duration_minutes && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="size-3" />
                          {match.duration_minutes}m
                        </span>
                      )}
                      {match.location && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="size-3" />
                          {match.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Delete */}
                  <form action={deleteMatchAction.bind(null, match.id)} className="self-start">
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon-sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="size-4 text-muted-foreground" />
                    </Button>
                  </form>
                </div>

                {/* Players */}
                <div className="px-4 pb-4 flex flex-wrap gap-2">
                  {winners.map((mp) => (
                    <span
                      key={mp.player_id}
                      className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20"
                    >
                      <Crown className="size-3" />
                      {mp.player.name}
                      {mp.score != null && <span className="opacity-70">· {mp.score}</span>}
                    </span>
                  ))}
                  {losers.map((mp) => (
                    <span
                      key={mp.player_id}
                      className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
                    >
                      {mp.player.name}
                      {mp.score != null && <span className="opacity-70">· {mp.score}</span>}
                    </span>
                  ))}
                </div>

                {match.notes && (
                  <div className="px-4 pb-3 -mt-1">
                    <p className="text-xs text-muted-foreground italic">{match.notes}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
