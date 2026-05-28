import type { Metadata } from 'next'
import { UserCircle, Mail, Calendar } from 'lucide-react'
import { getSession } from '@/lib/session'
import { getUser } from '@/lib/db/queries/users'
import { logout } from '@/app/actions/auth'
import { ProfileForm } from '@/components/profile/ProfileForm'
import { PasswordForm } from '@/components/profile/PasswordForm'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Profile' }

export default async function ProfilePage() {
  const session = await getSession()
  const user = await getUser(session.userId)

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
