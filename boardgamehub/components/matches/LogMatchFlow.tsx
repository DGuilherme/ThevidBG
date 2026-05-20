'use client'

import { useState, useTransition, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  X, ChevronRight, ChevronLeft, Crown, Plus, Minus,
  Swords, BookOpen, Check, Loader2,
} from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { logMatchAction } from '@/app/actions/matches'
import { cn } from '@/lib/utils'
import type { GameCollection, Player } from '@/types/app'

interface PlayerEntry {
  player: Player
  isWinner: boolean
  score: string
}

interface Props {
  games: GameCollection[]
  players: Player[]
}

const STEPS = ['Select game', 'Add players', 'Match details'] as const

export function LogMatchFlow({ games, players }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [search, setSearch] = useState('')
  const [selectedGame, setSelectedGame] = useState<GameCollection | null>(null)
  const [entries, setEntries] = useState<PlayerEntry[]>([])
  const [date, setDate] = useState('')
  const [duration, setDuration] = useState('')
  const [location, setLocation] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function open() {
    setStep(0)
    setSearch('')
    setSelectedGame(null)
    setEntries([])
    setDate(new Date().toISOString().slice(0, 10))
    setDuration('')
    setLocation('')
    setNotes('')
    setError('')
    setIsOpen(true)
  }

  function close() { setIsOpen(false) }

  const filteredGames = useMemo(
    () => games.filter((g) => g.title.toLowerCase().includes(search.toLowerCase())),
    [games, search],
  )

  function togglePlayer(player: Player) {
    setEntries((prev) => {
      if (prev.find((e) => e.player.id === player.id))
        return prev.filter((e) => e.player.id !== player.id)
      return [...prev, { player, isWinner: false, score: '' }]
    })
  }

  function setWinner(playerId: string, value: boolean) {
    setEntries((prev) => prev.map((e) => e.player.id === playerId ? { ...e, isWinner: value } : e))
  }

  function setScore(playerId: string, value: string) {
    setEntries((prev) => prev.map((e) => e.player.id === playerId ? { ...e, score: value } : e))
  }

  function goToDetails() {
    if (entries.length === 0) { setError('Add at least one player'); return }
    setError('')
    setStep(2)
  }

  function handleSubmit() {
    if (!selectedGame) return
    setError('')
    startTransition(async () => {
      const result = await logMatchAction({
        gameId: selectedGame.id,
        date,
        durationMinutes: duration ? parseInt(duration, 10) : null,
        location: location.trim() || null,
        notes: notes.trim() || null,
        players: entries.map((e) => ({
          playerId: e.player.id,
          isWinner: e.isWinner,
          score: e.score ? parseFloat(e.score) : null,
        })),
      })
      if (result?.error) { setError(result.error); return }
      close()
      router.refresh()
    })
  }

  if (!isOpen) {
    return (
      <Button onClick={open} size="sm">
        <Swords className="size-4" />
        Log match
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />

      {/* Panel */}
      <div className="relative w-full md:max-w-lg bg-card border border-border rounded-t-3xl md:rounded-2xl shadow-2xl max-h-[90dvh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            {step > 0 && (
              <button
                onClick={() => { setError(''); setStep((s) => s - 1) }}
                className="size-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
              >
                <ChevronLeft className="size-4" />
              </button>
            )}
            <div>
              <p className="font-semibold text-sm">{STEPS[step]}</p>
              <div className="flex gap-1 mt-1">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1 rounded-full transition-all',
                      i === step ? 'w-4 bg-primary' : i < step ? 'w-2 bg-primary/50' : 'w-2 bg-muted',
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={close}
            className="size-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* ── Step 0: Game selection ── */}
        {step === 0 && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-border shrink-0">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter games…"
                autoFocus
              />
            </div>
            {filteredGames.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-8 text-center">
                <div>
                  <BookOpen className="size-10 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {games.length === 0 ? 'Add games to your collection first.' : 'No games match your search.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto divide-y divide-border">
                {filteredGames.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => { setSelectedGame(game); setStep(1) }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left"
                  >
                    <div className="relative size-10 rounded-lg overflow-hidden bg-muted shrink-0">
                      {game.thumbnail_url ? (
                        <Image src={game.thumbnail_url} alt={game.title} fill sizes="40px" className="object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookOpen className="size-4 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium flex-1 truncate">{game.title}</span>
                    <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Step 1: Player selection ── */}
        {step === 1 && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Selected players */}
            {entries.length > 0 && (
              <div className="p-3 border-b border-border space-y-2 shrink-0">
                {entries.map((e) => (
                  <div key={e.player.id} className="flex items-center gap-2">
                    <div className="size-6 rounded-md bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                      {e.player.name[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium flex-1 truncate min-w-0">{e.player.name}</span>
                    <Input
                      value={e.score}
                      onChange={(ev) => setScore(e.player.id, ev.target.value)}
                      placeholder="Score"
                      type="number"
                      className="w-20 text-center shrink-0"
                    />
                    <button
                      onClick={() => setWinner(e.player.id, !e.isWinner)}
                      className={cn(
                        'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold border transition-colors shrink-0',
                        e.isWinner
                          ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                          : 'bg-muted border-border text-muted-foreground hover:border-amber-500/30',
                      )}
                    >
                      <Crown className="size-3" />
                    </button>
                    <button
                      onClick={() => togglePlayer(e.player)}
                      className="size-6 flex items-center justify-center rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                    >
                      <Minus className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Roster to pick from */}
            <div className="flex-1 overflow-y-auto">
              {players.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-muted-foreground">No players yet — add some in the Players page.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {players
                    .filter((p) => !entries.find((e) => e.player.id === p.id))
                    .map((player) => (
                      <button
                        key={player.id}
                        onClick={() => togglePlayer(player)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left"
                      >
                        <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                          {player.name[0].toUpperCase()}
                        </div>
                        <span className="text-sm font-medium flex-1">{player.name}</span>
                        <Plus className="size-4 text-muted-foreground shrink-0" />
                      </button>
                    ))}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-border shrink-0 space-y-2">
              {error && <p className="text-xs text-destructive text-center">{error}</p>}
              <Button onClick={goToDetails} className="w-full" disabled={entries.length === 0}>
                Next
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 2: Match details ── */}
        {step === 2 && (
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Summary pill */}
              <div className="rounded-xl bg-muted/50 px-4 py-3 flex items-center gap-3">
                <div className="relative size-10 rounded-lg overflow-hidden bg-muted shrink-0">
                  {selectedGame?.thumbnail_url ? (
                    <Image src={selectedGame.thumbnail_url} alt={selectedGame.title} fill sizes="40px" className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="size-4 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{selectedGame?.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {entries.length} {entries.length === 1 ? 'player' : 'players'} ·{' '}
                    {entries.filter((e) => e.isWinner).map((e) => e.player.name).join(', ') || 'No winner set'}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Date</label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Duration <span className="normal-case">(minutes, optional)</span>
                </label>
                <Input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 90"
                  min={1}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Location <span className="normal-case">(optional)</span>
                </label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Home, Game café…"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Notes <span className="normal-case">(optional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Anything memorable about this match…"
                  rows={3}
                  className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none"
                />
              </div>

              {error && <p className="text-xs text-destructive">{error}</p>}

              <Button onClick={handleSubmit} disabled={isPending} className="w-full">
                {isPending ? (
                  <><Loader2 className="size-4 animate-spin" /> Saving…</>
                ) : (
                  <><Check className="size-4" /> Log match</>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
