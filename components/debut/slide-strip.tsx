'use client'

import Image from 'next/image'
import { useState, type KeyboardEvent } from 'react'
import { GripVerticalIcon } from 'lucide-react'
import { photoById, padSlide, type Slide } from '@/lib/debut-data'
import { cn } from '@/lib/utils'

export function SlideStrip({
  slides: initial,
  activeIndex,
  onSelect,
  onReorder,
  className,
}: {
  slides: Slide[]
  activeIndex?: number
  onSelect?: (index: number) => void
  onReorder?: (slides: Slide[]) => void
  className?: string
}) {
  const [slides, setSlides] = useState(initial)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)
  const [announcement, setAnnouncement] = useState('')

  function move(from: number, to: number) {
    if (to < 0 || to >= slides.length || from === to) return
    const next = [...slides]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    setSlides(next)
    onReorder?.(next)
    setAnnouncement(`${item.title} moved to scene ${to + 1} of ${slides.length}`)
  }

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!e.altKey) return
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault()
      const to = e.key === 'ArrowLeft' ? index - 1 : index + 1
      move(index, to)
      requestAnimationFrame(() => {
        document.querySelector<HTMLButtonElement>(`[data-strip-index="${to}"]`)?.focus()
      })
    }
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <p id="strip-help" className="sr-only">
        Press Alt plus Left or Right arrow to reorder a scene. Drag with a pointer to reorder.
      </p>
      <ol
        aria-label="Running order"
        aria-describedby="strip-help"
        className="flex snap-x gap-2 overflow-x-auto pb-3 [scrollbar-color:var(--border)_transparent]"
      >
        {slides.map((slide, i) => {
          const photo = photoById[slide.photoId]
          const active = i === activeIndex
          return (
            <li
              key={slide.id}
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => {
                e.preventDefault()
                setOverIndex(i)
              }}
              onDragEnd={() => {
                setDragIndex(null)
                setOverIndex(null)
              }}
              onDrop={(e) => {
                e.preventDefault()
                if (dragIndex !== null) move(dragIndex, i)
                setDragIndex(null)
                setOverIndex(null)
              }}
              className={cn(
                'shrink-0 snap-start transition-[transform,opacity] duration-(--dur-fast)',
                dragIndex === i && 'opacity-40',
                overIndex === i && dragIndex !== i && 'translate-y-[-3px]',
              )}
            >
              <button
                type="button"
                data-strip-index={i}
                onClick={() => onSelect?.(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                aria-current={active ? 'step' : undefined}
                aria-label={`Scene ${i + 1}: ${slide.title}`}
                className={cn(
                  'group/strip flex w-28 cursor-grab flex-col gap-1.5 rounded-md bg-card p-1.5 text-left ring-1 ring-border outline-none transition-shadow duration-(--dur-base) active:cursor-grabbing',
                  'hover:ring-gold/50 focus-visible:ring-2 focus-visible:ring-ring',
                  active && 'shadow-spotlight ring-2 ring-gold',
                )}
              >
                <span className="flex items-center justify-between px-0.5">
                  <span className={cn('font-serif text-title leading-none tabular-nums', active ? 'text-gold' : 'text-foreground')}>
                    {padSlide(i + 1)}
                  </span>
                  <GripVerticalIcon aria-hidden="true" className="size-3.5 text-muted-foreground" />
                </span>
                <span className="relative block aspect-[4/3] overflow-hidden rounded-sm bg-muted">
                  <Image src={photo.src || '/placeholder.svg'} alt="" fill sizes="112px" className="object-cover" draggable={false} />
                </span>
                <span className="truncate px-0.5 text-caption text-muted-foreground">{slide.title}</span>
              </button>
            </li>
          )
        })}
      </ol>
      <p aria-live="assertive" className="sr-only">
        {announcement}
      </p>
    </div>
  )
}
