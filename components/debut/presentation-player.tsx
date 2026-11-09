'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, MaximizeIcon, MinimizeIcon, PauseIcon, PlayIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CurtainReveal, Eyebrow, MarqueeBulbs, ProsceniumFrame } from '@/components/debut/ornaments'
import { SLIDE_SECONDS, padSlide, photoById, type Slide } from '@/lib/debut-data'
import { cn } from '@/lib/utils'

export function PresentationPlayer({
  slides,
  seconds = SLIDE_SECONDS,
  className,
}: {
  slides: Slide[]
  seconds?: number
  className?: string
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [{ index, elapsed }, setPosition] = useState({ index: 0, elapsed: 0 })
  const [playing, setPlaying] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const isLastScene = index === slides.length - 1
  const finished = isLastScene && elapsed >= seconds

  const goTo = useCallback(
    (i: number) => {
      setPosition({ index: ((i % slides.length) + slides.length) % slides.length, elapsed: 0 })
    },
    [slides.length],
  )

  useEffect(() => {
    if (!playing) return
    const tick = 0.1
    const id = window.setInterval(() => {
      setPosition((p) => {
        const next = p.elapsed + tick
        if (next < seconds) return { ...p, elapsed: next }
        if (p.index + 1 >= slides.length) return { ...p, elapsed: seconds }
        return { index: p.index + 1, elapsed: 0 }
      })
    }, tick * 1000)
    return () => window.clearInterval(id)
  }, [playing, seconds, slides.length])

  useEffect(() => {
    if (finished) setPlaying(false)
  }, [finished])

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === rootRef.current)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  function togglePlay() {
    if (finished) goTo(0)
    setPlaying((p) => !p)
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen()
    else rootRef.current?.requestFullscreen?.()
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.target instanceof HTMLButtonElement && (e.key === ' ' || e.key === 'Enter')) return
    if (e.key === 'ArrowRight') goTo(index + 1)
    else if (e.key === 'ArrowLeft') goTo(index - 1)
    else if (e.key === ' ') {
      e.preventDefault()
      togglePlay()
    }
  }

  const slide = slides[index]
  const photo = photoById[slide.photoId]
  const remaining = Math.max(0, Math.ceil(seconds - elapsed))

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="presentation"
      aria-label="Presentation player"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className={cn(
        'flex flex-col gap-4 rounded-lg bg-background outline-none focus-visible:ring-2 focus-visible:ring-ring',
        fullscreen && 'justify-center p-6 sm:p-10',
        className,
      )}
    >
      <ProsceniumFrame stageClassName="aspect-video">
        <Image
          key={photo.id + index}
          src={photo.src || '/placeholder.svg'}
          alt={photo.alt}
          fill
          sizes="(min-width: 1024px) 900px, 100vw"
          className="animate-spotlight-in object-cover"
          priority={index === 0}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,color-mix(in_oklab,var(--velvet-deep)_92%,transparent))]" />
        <div className="absolute inset-x-[7%] bottom-0 flex flex-col gap-1 pb-4 sm:pb-6" aria-live="polite">
          <Eyebrow className="text-spotlight">{`Scene ${padSlide(index + 1)} / ${padSlide(slides.length)}`}</Eyebrow>
          <p className="font-serif text-heading text-balance text-primary-foreground sm:text-display-sm">{slide.title}</p>
          <p className="hidden max-w-2xl text-body-sm text-pretty text-primary-foreground/85 md:block">{slide.script}</p>
        </div>
        <CurtainReveal playKey={index} />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 z-(--z-curtain) h-1 origin-left bg-gold"
          style={{ transform: `scaleX(${elapsed / seconds})` }}
        />
      </ProsceniumFrame>

      <div className="flex flex-wrap items-center justify-between gap-4 px-1">
        <MarqueeBulbs total={slides.length} current={index} onSelect={goTo} label="Scene progress" />
        <div className="flex items-center gap-2">
          <span className="w-10 text-right font-playbill text-muted-foreground tabular-nums" aria-label={`${remaining} seconds remaining`}>
            {`0:${String(remaining).padStart(2, '0')}`}
          </span>
          <Button size="icon" variant="ghost" aria-label="Previous scene" onClick={() => goTo(index - 1)}>
            <ChevronLeftIcon />
          </Button>
          <Button size="icon-lg" aria-label={playing ? 'Pause' : 'Play'} onClick={togglePlay}>
            {playing ? <PauseIcon /> : <PlayIcon />}
          </Button>
          <Button size="icon" variant="ghost" aria-label="Next scene" onClick={() => goTo(index + 1)}>
            <ChevronRightIcon />
          </Button>
          <Button size="icon" variant="outline" aria-label={fullscreen ? 'Exit full screen' : 'Enter full screen'} onClick={toggleFullscreen}>
            {fullscreen ? <MinimizeIcon /> : <MaximizeIcon />}
          </Button>
        </div>
      </div>
    </div>
  )
}
