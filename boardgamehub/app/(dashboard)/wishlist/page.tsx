import type { Metadata } from 'next'
import Image from 'next/image'
import { Heart, Trash2, BookOpen } from 'lucide-react'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getWishlist } from '@/lib/supabase/queries/wishlist'
import { removeFromWishlist } from '@/app/actions/wishlist'
import { AddWishlistButton } from '@/components/wishlist/AddWishlistButton'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Wishlist' }

const priority: Record<number, { label: string; dot: string }> = {
  1: { label: 'Must have', dot: 'bg-red-500' },
  2: { label: 'High', dot: 'bg-orange-500' },
  3: { label: 'Medium', dot: 'bg-yellow-500' },
  4: { label: 'Low', dot: 'bg-muted-foreground' },
  5: { label: 'Someday', dot: 'bg-muted-foreground/40' },
}

export default async function WishlistPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  const items = await getWishlist(supabase, user!.id)

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Wishlist</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {items.length} {items.length === 1 ? 'game' : 'games'} you want to own
          </p>
        </div>
        <AddWishlistButton />
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4 rounded-2xl border border-dashed border-border">
          <Heart className="size-12 text-muted-foreground/30" />
          <div>
            <p className="font-semibold">Your wishlist is empty</p>
            <p className="text-sm text-muted-foreground mt-1">Add games you'd like to own someday.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => {
            const p = priority[item.priority] ?? priority[3]
            return (
              <div
                key={item.id}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 hover:border-primary/20 transition-colors"
              >
                {/* Thumbnail */}
                <div className="relative size-14 rounded-xl overflow-hidden bg-muted shrink-0">
                  {item.thumbnail_url ? (
                    <Image src={item.thumbnail_url} alt={item.title} fill sizes="56px" className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="size-5 text-muted-foreground/30" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{item.title}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={cn('size-1.5 rounded-full shrink-0', p.dot)} />
                    <span className="text-xs text-muted-foreground">{p.label}</span>
                  </div>
                  {item.notes && (
                    <p className="text-xs text-muted-foreground mt-1 italic truncate">{item.notes}</p>
                  )}
                </div>

                {/* Delete */}
                <form action={removeFromWishlist.bind(null, item.id)}>
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon-sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="size-4 text-muted-foreground" />
                  </Button>
                </form>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
