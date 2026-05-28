'use client'

import { useActionState } from 'react'
import { Loader2 } from 'lucide-react'
import { updateUsernameAction } from '@/app/actions/profile'
import { Button } from '@/components/ui/button'

export function ProfileForm({ currentUsername }: { currentUsername: string | null }) {
  const [state, action, pending] = useActionState(updateUsernameAction, undefined)

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="username" className="text-sm font-medium">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          defaultValue={currentUsername ?? ''}
          placeholder="your_username"
          autoComplete="username"
          className="w-full rounded-xl border border-input bg-input/30 px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-primary/60 focus:ring-2 focus:ring-primary/15 transition-all"
        />
        <p className="text-xs text-muted-foreground">Letters, numbers, _ . and - only.</p>
      </div>

      {state?.error && (
        <p className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-sm text-emerald-400">
          Username updated.
        </p>
      )}

      <Button type="submit" disabled={pending} size="sm" className="gap-2">
        {pending && <Loader2 className="size-3.5 animate-spin" />}
        Save username
      </Button>
    </form>
  )
}
