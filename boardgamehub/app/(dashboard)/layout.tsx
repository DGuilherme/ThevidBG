import { redirect } from 'next/navigation'
import { Dices, LogOut } from 'lucide-react'
import { getSession } from '@/lib/session'
import { logout } from '@/app/actions/auth'
import { NavLinks } from '@/components/layouts/NavLinks'
import { MobileNav } from '@/components/layouts/MobileNav'
import { Button } from '@/components/ui/button'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session.userId) redirect('/login')

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 flex-col bg-sidebar border-r border-sidebar-border shrink-0">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-5 border-b border-sidebar-border">
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Dices className="size-4 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-base tracking-tight">BoardGameHub</span>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto">
          <NavLinks />
        </div>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-3 space-y-1">
          <p className="px-3 text-xs text-muted-foreground truncate">{session.email}</p>
          <form action={logout}>
            <Button
              variant="ghost"
              size="sm"
              type="submit"
              className="w-full justify-start gap-2.5 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="size-4" />
              Sign out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile header */}
        <header className="md:hidden flex h-14 items-center gap-3 border-b border-border px-4 shrink-0 bg-sidebar">
          <div className="size-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Dices className="size-3.5 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-sm tracking-tight">BoardGameHub</span>
        </header>

        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">{children}</main>
      </div>

      {/* Mobile bottom bar */}
      <MobileNav />
    </div>
  )
}
