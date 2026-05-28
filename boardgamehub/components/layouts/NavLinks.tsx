'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, BookOpen, Swords, Users, BarChart2, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

export const navLinks = [
  { href: '/', label: 'Overview', icon: LayoutGrid },
  { href: '/collection', label: 'Collection', icon: BookOpen },
  { href: '/matches', label: 'Matches', icon: Swords },
  { href: '/players', label: 'Players', icon: Users },
  { href: '/stats', label: 'Stats', icon: BarChart2 },
  { href: '/wishlist', label: 'Wishlist', icon: Heart },
]

export function NavLinks() {
  const pathname = usePathname()

  return (
    <nav className="space-y-0.5 px-2 py-3">
      {navLinks.map(({ href, label, icon: Icon }) => {
        const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary/15 text-primary'
                : 'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground'
            )}
          >
            <Icon
              className={cn('size-4 shrink-0', isActive ? 'text-primary' : 'opacity-70')}
            />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
