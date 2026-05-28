'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { navLinks } from './NavLinks'

const mobileLinks = navLinks.filter((l) =>
  ['/', '/collection', '/matches', '/players', '/wishlist'].includes(l.href)
)

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border bg-sidebar/95 backdrop-blur-md">
      <div className="flex items-center justify-around h-16 px-1 safe-area-bottom">
        {mobileLinks.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors min-w-0',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className="size-5 shrink-0" />
              <span className="text-[10px] font-medium truncate">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
