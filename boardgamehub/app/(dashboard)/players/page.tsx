import type { Metadata } from 'next'
import { Users, Trash2, UserPlus, Mail } from 'lucide-react'
import { getSession } from '@/lib/session'
import { getPlayers } from '@/lib/db/queries/players'
import { createPlayerAction, deletePlayerAction } from '@/app/actions/players'
import { LinkUserButton } from '@/components/players/LinkUserButton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const metadata: Metadata = { title: 'Players' }

const avatarColors = [
  'bg-violet-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-cyan-500',
  'bg-orange-500',
  'bg-indigo-500',
  'bg-teal-500',
]

export default async function PlayersPage() {
  const session = await getSession()
  const players = await getPlayers(session.userId)

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold">Players</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {players.length} {players.length === 1 ? 'player' : 'players'} in your roster
        </p>
      </div>

      {/* Add player */}
      <form action={createPlayerAction} className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input name="name" placeholder="Player name…" required className="pl-9" />
          </div>
          <Button type="submit" size="sm">Add</Button>
        </div>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            name="email"
            type="email"
            placeholder="Email (optional)"
            className="pl-9 text-sm"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          If they sign up with this email, they&apos;ll be linked automatically.
        </p>
      </form>

      {/* Empty state */}
      {players.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4 rounded-2xl border border-dashed border-border">
          <Users className="size-12 text-muted-foreground/30" />
          <div>
            <p className="font-semibold">No players yet</p>
            <p className="text-sm text-muted-foreground mt-1">Add people you play with above.</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
              Link players to their BoardGameHub accounts so their stats sync automatically.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {players.map((player, i) => {
            const color = player.linked_user ? 'bg-primary' : avatarColors[i % avatarColors.length]
            return (
              <div
                key={player.id}
                className="group relative flex flex-col items-center gap-2.5 rounded-2xl border border-border bg-card p-5 hover:border-primary/30 transition-colors"
              >
                {/* Avatar */}
                <div className={`size-14 rounded-2xl ${color} flex items-center justify-center text-xl font-black text-white select-none`}>
                  {player.name[0].toUpperCase()}
                </div>

                <p className="text-sm font-semibold text-center leading-tight">{player.name}</p>

                {/* Link status */}
                <div className="w-full flex justify-center">
                  <LinkUserButton playerId={player.id} linkedUser={player.linked_user} />
                </div>

                {/* Delete */}
                <form
                  action={deletePlayerAction.bind(null, player.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Button type="submit" variant="ghost" size="icon-xs">
                    <Trash2 className="size-3.5 text-muted-foreground" />
                  </Button>
                </form>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
