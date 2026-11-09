'use client'

import Image from 'next/image'
import { useId, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Eyebrow } from '@/components/debut/ornaments'
import { SLIDE_SECONDS, estimateSeconds, padSlide, type Photo } from '@/lib/debut-data'
import { cn } from '@/lib/utils'

export function TimingMeter({ seconds, className }: { seconds: number; className?: string }) {
  const over = seconds > SLIDE_SECONDS
  const segments = Math.max(SLIDE_SECONDS, Math.ceil(seconds))
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div
        role="meter"
        aria-label="Spoken length"
        aria-valuemin={0}
        aria-valuemax={SLIDE_SECONDS}
        aria-valuenow={Math.round(seconds * 10) / 10}
        aria-valuetext={`${seconds.toFixed(1)} of ${SLIDE_SECONDS} seconds${over ? ', runs over' : ''}`}
        className="flex h-2.5 gap-0.5"
      >
        {Array.from({ length: segments }, (_, i) => {
          const filled = i < seconds
          const overflow = i >= SLIDE_SECONDS
          return (
            <span
              key={i}
              aria-hidden="true"
              className={cn(
                'flex-1 rounded-[1px] transition-colors duration-(--dur-base)',
                !filled && 'bg-muted',
                filled && !over && 'bg-gold',
                filled && over && 'bg-primary',
                overflow && 'ring-1 ring-primary',
              )}
            />
          )
        })}
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="font-playbill text-muted-foreground tabular-nums">
          {seconds.toFixed(1)}s / {SLIDE_SECONDS}s
        </span>
        {over ? (
          <Badge>{`Runs over by ${(seconds - SLIDE_SECONDS).toFixed(1)}s`}</Badge>
        ) : (
          <Badge variant="gold">On cue</Badge>
        )}
      </div>
    </div>
  )
}

export function SlideScriptCard({
  number,
  title,
  photo,
  script: initialScript,
  className,
}: {
  number: number
  title: string
  photo: Photo
  script: string
  className?: string
}) {
  const id = useId()
  const [script, setScript] = useState(initialScript)
  const seconds = estimateSeconds(script)

  return (
    <Card className={cn('py-0', className)}>
      <CardContent className="grid gap-4 p-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-muted">
          <Image src={photo.src || '/placeholder.svg'} alt={photo.alt} fill sizes="(min-width: 640px) 240px, 100vw" className="object-cover" />
          <span className="absolute top-2 left-2 rounded-sm bg-background/85 px-2 py-1 font-serif text-title leading-none tabular-nums backdrop-blur-sm">
            {padSlide(number)}
          </span>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <Eyebrow>{`Scene ${padSlide(number)} / 20`}</Eyebrow>
            <h3 className="font-serif text-title">{title}</h3>
          </div>
          <label htmlFor={id} className="sr-only">
            {`Script for scene ${number}`}
          </label>
          <Textarea
            id={id}
            value={script}
            onChange={(e) => setScript(e.target.value)}
            rows={4}
            className="resize-none text-body-sm leading-relaxed"
          />
          <TimingMeter seconds={seconds} />
        </div>
      </CardContent>
    </Card>
  )
}
