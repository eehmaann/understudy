import { AppComponentsSection } from '@/components/showcase/app-components-section'
import { getDesignSystemFiles } from '@/lib/load-design-system'
import { ColorSection } from '@/components/showcase/color-section'
import { CoreComponentsSection } from '@/components/showcase/core-components-section'
import { Hero } from '@/components/showcase/hero'
import { MotionSection } from '@/components/showcase/motion-section'
import { ShowcaseNav } from '@/components/showcase/showcase-nav'
import { TokensSection } from '@/components/showcase/tokens-section'
import { TypeSection } from '@/components/showcase/type-section'
import { WorkspaceMock } from '@/components/showcase/workspace-mock'

export default function Page() {
  const files = getDesignSystemFiles()

  return (
    <>
      {/* v0 Design System Showcase Page */}
      <ShowcaseNav files={files} />
      <Hero />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ColorSection />
        <TypeSection />
        <TokensSection />
        <MotionSection />
        <CoreComponentsSection />
        <AppComponentsSection />
      </div>
      <div className="mx-auto max-w-[96rem] px-4 sm:px-6">
        <WorkspaceMock />
      </div>
      <footer className="border-t border-border py-10 text-center">
        <p className="font-playbill text-gold">Fin · Thank you for attending</p>
      </footer>
    </>
  )
}
