'use client'

import Image from 'next/image'
import { useState } from 'react'
import { PlayIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AgentActivityFeed } from '@/components/debut/agent-activity-feed'
import { AgentQuestionCard } from '@/components/debut/agent-question-card'
import { CoverageChecklist } from '@/components/debut/coverage-checklist'
import { CriticNotes } from '@/components/debut/critic-notes'
import { Eyebrow, MarqueeBulbs, ProsceniumFrame } from '@/components/debut/ornaments'
import { SlideScriptCard } from '@/components/debut/slide-script-card'
import { SlideStrip } from '@/components/debut/slide-strip'
import { ShowcaseSection } from '@/components/showcase/section'
import {
  agentQuestion,
  coverage,
  criticNotes,
  logEntries,
  padSlide,
  photoById,
  slides,
} from '@/lib/debut-data'

export function WorkspaceMock() {
  const [active, setActive] = useState(0)
  const slide = slides[active]
  const photo = photoById[slide.photoId]

  return (
    <ShowcaseSection
      id="workspace"
      act="Finale · Dress rehearsal"
      title="The agent workspace"
      description="Everything on stage at once: the running order, the focused scene, the stage manager's log and the critic's notes."
    >
      <div className="flex flex-col gap-4 rounded-lg bg-card/40 p-3 ring-1 ring-border sm:p-4">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-1 pb-3">
          <div className="flex flex-col">
            <Eyebrow>Now in rehearsal</Eyebrow>
            <h3 className="font-serif text-heading italic">{"Mara's Debut"}</h3>
          </div>
          <div className="flex items-center gap-3">
            <MarqueeBulbs total={20} current={active} label="Scene being edited" className="hidden md:flex" />
            <Badge variant="gold">Draft 3</Badge>
            <Button>
              <PlayIcon data-icon="inline-start" />
              Run show
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[17rem_minmax(0,1fr)_19rem]">
          <aside aria-label="Coverage and activity" className="order-2 flex flex-col gap-4 xl:order-1">
            <CoverageChecklist items={coverage} />
            <AgentActivityFeed entries={logEntries} />
          </aside>

          <main className="order-1 flex min-w-0 flex-col gap-4 xl:order-2">
            <ProsceniumFrame stageClassName="aspect-video">
              <Image
                key={photo.id + active}
                src={photo.src || '/placeholder.svg'}
                alt={photo.alt}
                fill
                sizes="(min-width: 1280px) 640px, 100vw"
                className="animate-spotlight-in object-cover"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,color-mix(in_oklab,var(--velvet-deep)_90%,transparent))]" />
              <p className="absolute inset-x-[7%] bottom-4 font-serif text-title text-primary-foreground sm:text-heading">
                <span className="mr-3 tabular-nums">{padSlide(active + 1)}</span>
                {slide.title}
              </p>
            </ProsceniumFrame>
            <SlideScriptCard key={slide.id} number={active + 1} title={slide.title} photo={photo} script={slide.script} />
            <SlideStrip slides={slides} activeIndex={active} onSelect={setActive} />
          </main>

          <aside aria-label="Agent and review" className="order-3 flex flex-col gap-4">
            <AgentQuestionCard
              question={agentQuestion.question}
              photos={agentQuestion.photoIds.map((id) => photoById[id])}
              replies={agentQuestion.replies}
            />
            <CriticNotes rating={4} pullQuote="Warm, funny, nearly ready for opening night." notes={criticNotes} />
          </aside>
        </div>
      </div>
    </ShowcaseSection>
  )
}
