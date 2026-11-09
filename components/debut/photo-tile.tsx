import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import type { Photo } from '@/lib/debut-data'
import { cn } from '@/lib/utils'

export function PhotoTile({
  photo,
  understudyReason,
  selected,
  className,
}: {
  photo: Photo
  understudyReason?: string
  selected?: boolean
  className?: string
}) {
  const understudy = photo.status === 'understudy'

  return (
    <figure
      data-understudy={understudy || undefined}
      data-selected={selected || undefined}
      className={cn(
        'group/tile flex flex-col gap-3 rounded-lg bg-card p-2 ring-1 ring-border transition-shadow duration-(--dur-base) ease-stage hover:shadow-glow',
        'data-selected:shadow-gilded data-selected:ring-gold/60',
        'data-understudy:bg-transparent data-understudy:ring-0 data-understudy:outline-1 data-understudy:outline-dashed data-understudy:outline-muted-foreground/50',
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-muted">
        <Image
          src={photo.src || '/placeholder.svg'}
          alt={photo.alt}
          fill
          sizes="(min-width: 1024px) 240px, 50vw"
          className={cn(
            'object-cover transition-[filter,transform] duration-(--dur-slow) ease-stage group-hover/tile:scale-[1.03]',
            understudy && 'opacity-60 grayscale-[0.7] sepia-[0.25]',
          )}
        />
        <Badge variant={understudy ? 'outline' : 'gold'} className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm">
          {understudy ? 'Understudy' : photo.topic}
        </Badge>
      </div>
      <figcaption className="flex flex-col gap-1 px-1 pb-1">
        <span className={cn('font-serif text-body leading-snug', understudy && 'text-muted-foreground')}>
          {photo.caption}
        </span>
        {understudy ? (
          <span className="text-caption text-muted-foreground">{understudyReason ?? 'Set aside — similar to another shot'}</span>
        ) : (
          <span className="font-playbill text-muted-foreground">{photo.topic}</span>
        )}
      </figcaption>
    </figure>
  )
}
