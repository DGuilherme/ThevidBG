'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { BggSearchResult } from '@/types/bgg'

interface Props {
  onAdd: (bggId: number) => Promise<void>
  label?: string
}

export function BggSearchFlow({ onAdd, label = 'Add game' }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<BggSearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [addingId, setAddingId] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  function handleClose() {
    setIsOpen(false)
    setQuery('')
    setResults([])
  }

  function handleQueryChange(value: string) {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (value.length < 2) { setResults([]); return }

    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(`/api/bgg/search?q=${encodeURIComponent(value)}`)
        const data = await res.json()
        setResults(Array.isArray(data) ? data.slice(0, 8) : [])
      } finally {
        setSearching(false)
      }
    }, 400)
  }

  async function handleSelect(result: BggSearchResult) {
    setAddingId(result.id)
    startTransition(async () => {
      try {
        await onAdd(result.id)
        handleClose()
        router.refresh()
      } finally {
        setAddingId(null)
      }
    })
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} size="sm">
        <Plus className="size-4" />
        {label}
      </Button>
    )
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search BoardGameGeek…"
          />
          {searching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin text-muted-foreground" />
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={handleClose}>
          <X className="size-4" />
        </Button>
      </div>

      {results.length > 0 && (
        <div className="rounded-lg border border-border bg-card divide-y divide-border overflow-hidden">
          {results.map((r) => (
            <button
              key={r.id}
              onClick={() => handleSelect(r)}
              disabled={isPending}
              className="w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-muted transition-colors text-left disabled:opacity-50"
            >
              <span className="font-medium truncate">{r.name}</span>
              <span className="text-muted-foreground shrink-0 ml-3">
                {addingId === r.id ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  r.yearPublished ?? ''
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
