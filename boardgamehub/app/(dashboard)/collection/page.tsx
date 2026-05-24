import type { Metadata } from 'next'
import Image from 'next/image'
import { Trash2, BookOpen } from 'lucide-react'
import { getSession } from '@/lib/session'
import { getCollection } from '@/lib/db/queries/collection'
import { removeGameFromCollection } from '@/app/actions/collection'
import { AddGameButton } from '@/components/collection/AddGameButton'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Collection' }

export default async function CollectionPage() {
  const session = await getSession()
  const games = await getCollection(session.userId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Collection</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {games.length} {games.length === 1 ? 'game' : 'games'} on your shelf
          </p>
        </div>
        <AddGameButton />
      </div>

      {/* Empty state */}
      {games.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4 rounded-2xl border border-dashed border-border">
          <BookOpen className="size-12 text-muted-foreground/30" />
          <div>
            <p className="font-semibold">Your shelf is empty</p>
            <p className="text-sm text-muted-foreground mt-1">Search for a game above to get started.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {games.map((game) => (
            <div
              key={game.id}
              className="group relative rounded-xl overflow-hidden bg-muted aspect-[2/3] cursor-pointer"
            >
              {/* Cover art */}
              {game.thumbnail_url ? (
                <Image
                  src={game.thumbnail_url}
                  alt={game.title}
                  fill
                  sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 17vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <BookOpen className="size-8 text-muted-foreground/30" />
                </div>
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

              {/* Title on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-2.5 translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-200">
                <p className="text-white text-xs font-semibold leading-tight line-clamp-2">{game.title}</p>
                {game.year_published && (
                  <p className="text-white/60 text-[10px] mt-0.5">{game.year_published}</p>
                )}
              </div>

              {/* Shelf of shame badge */}
              {game.shelf_of_shame && (
                <div className="absolute top-1.5 left-1.5 rounded-md bg-amber-500/90 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm">
                  UNPLAYED
                </div>
              )}

              {/* Delete */}
              <form
                action={removeGameFromCollection.bind(null, game.id)}
                className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Button type="submit" variant="secondary" size="icon-xs" className="shadow-lg">
                  <Trash2 className="size-3" />
                </Button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
