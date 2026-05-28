'use client'

import { useActionState, useState } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { changePasswordAction } from '@/app/actions/profile'
import { Button } from '@/components/ui/button'

function PasswordInput({ id, name, placeholder, autoComplete }: {
  id: string
  name: string
  placeholder: string
  autoComplete: string
}) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={show ? 'text' : 'password'}
        required
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-input bg-input/30 px-4 pr-11 py-2.5 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-primary/60 focus:ring-2 focus:ring-primary/15 transition-all"
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShow((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  )
}

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, undefined)

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="current_password" className="text-sm font-medium">Current password</label>
        <PasswordInput id="current_password" name="current_password" placeholder="••••••••" autoComplete="current-password" />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="new_password" className="text-sm font-medium">New password</label>
        <PasswordInput id="new_password" name="new_password" placeholder="Min. 8 characters" autoComplete="new-password" />
      </div>

      {state?.error && (
        <p className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-sm text-emerald-400">
          Password changed successfully.
        </p>
      )}

      <Button type="submit" disabled={pending} size="sm" className="gap-2">
        {pending && <Loader2 className="size-3.5 animate-spin" />}
        Change password
      </Button>
    </form>
  )
}
