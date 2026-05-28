import type { Metadata } from 'next'
import Image from 'next/image'
import { UserCircle, Mail, Calendar, Crown, BookOpen, Swords } from 'lucide-react'
import { getSession } from '@/lib/session'
import { getUser } from '@/lib/db/queries/users'
import { getMatchesAsLinkedPlayer } from '@/lib/db/queries/matches'
import { logout } from '@/app/actions/auth'
import { ProfileForm } from '@/components/profile/ProfileForm'
import { PasswordForm } from '@/components/profile/PasswordForm'
import { Button } from '@/components/ui/button'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const metadata: Metadata = { title: 'Profile' }

export default async function ProfilePage() {
  const session = await getSession()
  const [user, sharedMatches] = await Promise.all([
    getUser(session.userId),
    getMatchesAsLinkedPlayer(session.userId),
  ])

  const initial = (user?.username ?? user?.email ?? '?')[0].toUpperCase()
  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    : null

  return (
    <div className="space-y-8 max-w-lg">
      <h1 className="text-2xl font-bold">Profile</h1>

      {/* Avatar + info */}
      <div className="rounded-2xl border border-border bg-card p-6 flex items-center gap-5">
        <div className="size-16 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
          <span className="text-2xl font-black text-primary">{initial}</span>
        </div>
        <div className="space-y-1.5 min-w-0">
          <p className="font-semibold text-lg truncate">{user?.username ?? 'No username set'}</p>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Mail className="size-3.5 shrink-0" />
            {user?.email}
          </p>
          {joinedDate && (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="size-3.5 shrink-0" />
              Member since {joinedDate}
            </p>
          )}
        </div>
      </div>

      {/* Username */}
      <section className="space-y-4">
        <div>
          <h2 className="font-semibold flex items-center gap-2">
            <UserCircle className="size-4 text-primary" />
            Display name
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">Used to identify you across the app.</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <ProfileForm currentUsername={user?.username ?? null} />
        </div>
      </section>

      {/* Password */}
      <section className="space-y-4">
        <div>
          <h2 className="font-semibold">Password</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Change your account password.</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <PasswordForm />
        </div>
      </section>

      {/* Matches played in other users' sessions */}
      {sharedMatches.length > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="font-semibold flex items-center gap-2">
              <Swords className="size-4 text-primary" />
              Matches you&apos;ve played in
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Logged by other players where you were linked.
            </p>
          </div>
          <div className="space-y-2">
            {sharedMatches.slice(0, 5).map((m) => {
              const winner = m.players.find((p) => p.is_winner)
              return (
                <div key={m.id} className="flex items-center gap-3 rounded-xl border border-border bg-card/50 px-4 py-3">
                  <div className="relative size-10 rounded-lg overflow-hidden bg-muted shrink-0">
                    {m.game.thumbnail_url ? (
                      <Image src={m.game.thumbnail_url} alt={m.game.title} fill sizes="40px" className="object-cover" />
                    ) : (
                      <BookOpen className="size-5 text-muted-foreground/30 m-auto" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{m.game.title}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(m.date)}</p>
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
          {sharedMatches.length > 5 && (
            <p className="text-xs text-muted-foreground text-center">
              +{sharedMatches.length - 5} more matches
            </p>
          )}
        </section>
      )}

      {/* Danger zone — mobile logout */}
      <section className="space-y-4 md:hidden">
        <div>
          <h2 className="font-semibold text-destructive/80">Sign out</h2>
        </div>
        <form action={logout}>
          <Button variant="destructive" size="sm" type="submit" className="w-full">
            Sign out
          </Button>
        </form>
      </section>
    </div>
  )
}
