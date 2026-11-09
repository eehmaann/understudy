'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ArrowLeftRightIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/debut/ornaments'
import type { Photo } from '@/lib/debut-data'
import { cn } from '@/lib/utils'

export function DuplicateCompare({
  a,
  b,
  reason,
  className,
}: {
  a: Photo
  b: Photo
  reason: string
  className?: string
}) {
  const [keptId, setKeptId] = useState(a.id)
  const pair = [a, b]

  return (
    <section aria-label="Duplicate photos" className={cn('flex flex-col gap-4 rounded-lg bg-card p-4 ring-1 ring-border', className)}>
      <div className="flex items-center justify-between gap-4">
        <Eyebrow>Casting call · Near duplicate</Eyebrow>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setKeptId((id) => (id === a.id ? b.id : a.id))}
        >
          <ArrowLeftRightIcon data-icon="inline-start" />
          Swap
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {pair.map((photo) => {
          const kept = photo.id === keptId
          return (
            <figure key={photo.id} className="flex flex-col gap-2">
              <div
                className={cn(
                  'relative aspect-[4/3] overflow-hidden rounded-md transition-[box-shadow,opacity] duration-(--dur-slow) ease-spotlight',
                  kept ? 'shadow-spotlight ring-2 ring-gold' : 'opacity-50 ring-1 ring-border',
                )}
              >
                <Image src={photo.src || '/placeholder.svg'} alt={photo.alt} fill sizes="240px" className={cn('object-cover', !kept && 'grayscale-[0.6]')} />
                {kept && (
                  <div
                    aria-hidden="true"
                    className="spotlight-center absolute inset-0 animate-spotlight-in mix-blend-screen"
                  />
                )}
              </div>
              <figcaption className="flex items-center gap-2">
                <Badge variant={kept ? 'gold' : 'outline'}>{kept ? 'Cast' : 'Understudy'}</Badge>
                <span className="truncate text-caption text-muted-foreground">{photo.caption}</span>
              </figcaption>
            </figure>
          )
        })}
      </div>

      <p className="font-serif text-body italic text-pretty">
        <span className="sr-only">Reason: </span>
        {reason}
      </p>
    </section>
  )
}
