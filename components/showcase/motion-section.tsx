'use client'

import Image from 'next/image'
import { useState } from 'react'
import { RotateCcwIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { BulbLoader, CurtainReveal, LiveBulb } from '@/components/debut/ornaments'
import { DemoBlock, ShowcaseSection } from '@/components/showcase/section'

const durations = [
  ['--dur-instant', '100ms', 'Press feedback'],
  ['--dur-fast', '160ms', 'Hover, color'],
  ['--dur-base', '260ms', 'Most transitions'],
  ['--dur-slow', '600ms', 'Gold shine sweep'],
  ['--dur-spotlight', '900ms', 'Spotlight fade-in'],
  ['--dur-curtain', '1100ms', 'Curtain reveal'],
  ['--dur-shimmer', '1600ms', 'Bulb shimmer loop'],
]

const easings = [
  ['ease-stage', 'cubic-bezier(.22, 1, .36, 1)'],
  ['ease-curtain', 'cubic-bezier(.77, 0, .18, 1)'],
  ['ease-spotlight', 'cubic-bezier(.16, 1, .3, 1)'],
]

export function MotionSection() {
  const [curtainKey, setCurtainKey] = useState(0)
  const [spotKey, setSpotKey] = useState(0)

  return (
    <ShowcaseSection
      id="motion"
      act="Act IV · Cues"
      title="Motion"
      description="Every movement has a theatrical cue. All animation collapses to an instant change under prefers-reduced-motion."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <DemoBlock title="Curtain reveal" note="animate-curtain-left / right">
          <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
            <Image src="/photos/kyoto.png" alt="A quiet Kyoto street at dusk" fill sizes="480px" className="object-cover" />
            <CurtainReveal playKey={curtainKey} />
          </div>
          <Button variant="outline" size="sm" className="self-start" onClick={() => setCurtainKey((k) => k + 1)}>
            <RotateCcwIcon data-icon="inline-start" />
            Replay curtain
          </Button>
        </DemoBlock>

        <DemoBlock title="Spotlight fade-in" note="animate-spotlight-in">
          <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-md bg-background">
            <div key={spotKey} aria-hidden="true" className="spotlight absolute inset-0 animate-spotlight-in" />
            <p key={`t-${spotKey}`} className="relative animate-spotlight-in font-serif text-display-sm italic">
              Starring you
            </p>
          </div>
          <Button variant="outline" size="sm" className="self-start" onClick={() => setSpotKey((k) => k + 1)}>
            <RotateCcwIcon data-icon="inline-start" />
            Replay spotlight
          </Button>
        </DemoBlock>

        <DemoBlock title="Marquee shimmer" note="Loading states">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-6">
              <BulbLoader label="Loading scenes" />
              <LiveBulb label="Agent working" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </DemoBlock>

        <DemoBlock title="Gold shine" note="Hover or focus the button">
          <div className="flex flex-1 items-center justify-center rounded-md bg-background py-10">
            <Button size="lg">Take your bow</Button>
          </div>
        </DemoBlock>

        <DemoBlock title="Durations" className="md:col-span-1">
          <ul className="flex flex-col gap-1.5">
            {durations.map(([k, v, use]) => (
              <li key={k} className="grid grid-cols-[1fr_auto] gap-x-4 text-body-sm sm:grid-cols-[9rem_5rem_1fr]">
                <code>{k}</code>
                <span className="text-right text-muted-foreground tabular-nums sm:text-left">{v}</span>
                <span className="hidden text-muted-foreground sm:block">{use}</span>
              </li>
            ))}
          </ul>
        </DemoBlock>

        <DemoBlock title="Easings">
          <ul className="flex flex-col gap-4">
            {easings.map(([k, v]) => (
              <li key={k} className="flex flex-col gap-2">
                <div className="flex justify-between gap-2 text-body-sm">
                  <code>{k}</code>
                  <span className="text-caption text-muted-foreground">{v}</span>
                </div>
                <div className="group/ease @container h-2 rounded-full bg-muted">
                  <span
                    className={`block size-2 rounded-full bg-gold transition-transform duration-(--dur-curtain) group-hover/ease:translate-x-[calc(100cqw-0.5rem)] ${k}`}
                  />
                </div>
              </li>
            ))}
          </ul>
          <span className="text-caption text-muted-foreground">Hover a track to preview the curve.</span>
        </DemoBlock>
      </div>
    </ShowcaseSection>
  )
}
