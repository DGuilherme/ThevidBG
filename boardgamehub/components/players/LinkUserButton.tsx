'use client'

import { useState, useEffect, useRef, useTransition } from 'react'
import { Link2, Link2Off, Search, Loader2 } from 'lucide-react'
import { linkPlayerAction, unlinkPlayerAction } from '@/app/actions/players'

type UserResult = { id: string; email: string; username: string | null }
type LinkedUser = { id: string; email: string; username: string | null } | null

export function LinkUserButton({ playerId, linkedUser }: { playerId: string; linkedUser: LinkedUser }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<UserResult[]>([])
  const [searching, setSearching] = useState(false)
  const [isPending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (query.length < 2) { setResults([]); return }
    const t = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`)
        setResults(await res.json())
      } finally {
        setSearching(false)
      }
    }, 300)
    return () => clearTimeout(t)
  }, [query])

  function handleLink(userId: string) {
    startTransition(async () => {
      await linkPlayerAction(playerId, userId)
      setOpen(false); setQuery(''); setResults([])
    })
  }

  function handleUnlink() {
    startTransition(async () => { await unlinkPlayerAction(playerId) })
  }

  if (linkedUser) {
    return (
      <div className="flex items-center gap-1.5 min-w-0">
        <div className="size-3.5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <span className="text-[7px] font-bold text-primary">
            {(linkedUser.username ?? linkedUser.email)[0].toUpperCase()}
          </span>
        </div>
        <span className="text-[10px] text-primary font-medium truncate">
          @{linkedUser.username ?? linkedUser.email.split('@')[0]}
        </span>
        <button
          onClick={handleUnlink}
          disabled={isPending}
          className="shrink-0 text-muted-foreground/50 hover:text-destructive transition-colors"
          title="Unlink account"
        >
          <Link2Off className="size-3" />
        </button>
      </div>
    )
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 text-[10px] text-muted-foreground/60 hover:text-primary transition-colors"
      >
        <Link2 className="size-3" />
        Link account
      </button>
    )
  }

  return (
    <div className="w-full space-y-1.5">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search username or email…"
          onKeyDown={(e) => { if (e.key === 'Escape') { setOpen(false); setQuery(''); setResults([]) } }}
          className="w-full text-[11px] pl-7 pr-3 py-1.5 rounded-lg border border-input bg-input/30 outline-none focus:border-primary/60 transition-all"
        />
        {searching && (
          <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3 animate-spin text-muted-foreground" />
        )}
      </div>

      {results.length > 0 && (
        <div className="rounded-lg border border-border bg-card shadow-lg overflow-hidden">
          {results.map((u) => (
            <button
              key={u.id}
              onClick={() => handleLink(u.id)}
              disabled={isPending}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted/60 transition-colors text-left"
            >
              <div className="size-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <span className="text-[9px] font-bold text-primary">
                  {(u.username ?? u.email)[0].toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                {u.username && <p className="text-xs font-medium truncate">@{u.username}</p>}
                <p className="text-[10px] text-muted-foreground truncate">{u.email}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {query.length >= 2 && !searching && results.length === 0 && (
        <p className="text-[10px] text-muted-foreground px-1">No users found.</p>
      )}
    </div>
  )
}
