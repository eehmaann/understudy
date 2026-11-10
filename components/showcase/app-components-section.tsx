import { AgentActivityFeed } from '@/components/debut/agent-activity-feed'
import { AgentQuestionCard } from '@/components/debut/agent-question-card'
import { CoverageChecklist } from '@/components/debut/coverage-checklist'
import { CriticNotes } from '@/components/debut/critic-notes'
import { DuplicateCompare } from '@/components/debut/duplicate-compare'
import { PhotoTile } from '@/components/debut/photo-tile'
import { PhotoUploadStage } from '@/components/debut/photo-upload-stage'
import { PresentationPlayer } from '@/components/debut/presentation-player'
import { SlideScriptCard } from '@/components/debut/slide-script-card'
import { SlideStrip } from '@/components/debut/slide-strip'
import { DemoBlock, ShowcaseSection } from '@/components/showcase/section'
import {
  agentQuestion,
  coverage,
  criticNotes,
  logEntries,
  overRunningScript,
  photoById,
  photos,
  slides,
} from '@/lib/debut-data'

export function AppComponentsSection() {
  return (
    <ShowcaseSection
      id="debut"
      act="Act VI · The production"
      title="Debut components"
      description="Purpose-built pieces for casting photos, working with the stage manager, timing scripts and taking the stage."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DemoBlock title="PhotoUploadStage" className="lg:col-span-2">
          <PhotoUploadStage />
        </DemoBlock>

        <DemoBlock title="PhotoTile" note="Cast · selected · understudy" className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <PhotoTile photo={photoById.hometown} />
            <PhotoTile photo={photoById.ramen} selected />
            <PhotoTile photo={photoById.guitar} />
            <PhotoTile photo={photoById['summit-b']} understudyReason="Blurry twin of “Sunrise on Mount Asahi”" />
          </div>
        </DemoBlock>

        <DemoBlock title="DuplicateCompare">
          <DuplicateCompare
            a={photoById['summit-a']}
            b={photoById['summit-b']}
            reason="Kept the first take — sharper focus, level horizon, and your arms tell the story."
          />
        </DemoBlock>

        <DemoBlock title="AgentQuestionCard">
          <AgentQuestionCard
            question={agentQuestion.question}
            context={agentQuestion.context}
            photos={agentQuestion.photoIds.map((id) => photoById[id])}
            replies={agentQuestion.replies}
          />
        </DemoBlock>

        <DemoBlock title="AgentActivityFeed">
          <AgentActivityFeed entries={logEntries} />
        </DemoBlock>

        <DemoBlock title="CoverageChecklist">
          <CoverageChecklist items={coverage} />
        </DemoBlock>

        <DemoBlock title="SlideStrip" note="Drag, or Alt + ← / →" className="lg:col-span-2">
          <SlideStrip slides={slides} activeIndex={6} />
        </DemoBlock>

        <DemoBlock title="SlideScriptCard" note="Fits the cue" className="lg:col-span-1">
          <SlideScriptCard number={8} title={slides[7].title} photo={photoById.ramen} script={slides[7].script} />
        </DemoBlock>

        <DemoBlock title="SlideScriptCard" note="Runs over — edit to fix">
          <SlideScriptCard number={10} title={slides[9].title} photo={photoById.dog} script={overRunningScript} />
        </DemoBlock>

        <DemoBlock title="CriticNotes" className="lg:col-span-2">
          <CriticNotes
            rating={4}
            pullQuote="A warm, funny debut with a harbor you can almost smell. Tighten act two and it sings."
            notes={criticNotes}
          />
        </DemoBlock>

        <DemoBlock title="PresentationPlayer" note="Space · ← / → · full screen" className="lg:col-span-2">
          <PresentationPlayer slides={slides} />
        </DemoBlock>
      </div>
      <p className="sr-only">{`${photos.length} sample photos loaded.`}</p>
    </ShowcaseSection>
  )
}
