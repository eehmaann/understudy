import { DecoCorners, DoubleRule, MarqueeBulbs } from '@/components/debut/ornaments'
import { DemoBlock, ShowcaseSection } from '@/components/showcase/section'

const spacing = [1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24]

const radii = [
  { token: 'rounded-xs', value: '3px' },
  { token: 'rounded-sm', value: '4px' },
  { token: 'rounded-md', value: '6px · base' },
  { token: 'rounded-lg', value: '8px' },
  { token: 'rounded-full', value: 'pill · chips' },
]

const shadows = [
  { token: 'shadow-glow', note: 'Hover lift' },
  { token: 'shadow-ember', note: 'Primary actions' },
  { token: 'shadow-spotlight', note: 'Focal content' },
  { token: 'shadow-gilded', note: 'Inner gold border' },
]

const zIndex = [
  ['--z-base', '0'],
  ['--z-raised', '10'],
  ['--z-sticky', '20'],
  ['--z-curtain', '30'],
  ['--z-overlay', '40'],
  ['--z-modal', '50'],
  ['--z-toast', '60'],
]

const breakpoints = [
  ['xs', '480px'],
  ['sm', '640px'],
  ['md', '768px'],
  ['lg', '1024px'],
  ['xl', '1280px'],
  ['2xl', '1536px'],
]

export function TokensSection() {
  return (
    <ShowcaseSection
      id="tokens"
      act="Act III · Set & lighting"
      title="Space, shape, light"
      description="A 4px spacing grid, subtle radii with pill-shaped marquee chips, and warm glows in place of grey drop shadows."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <DemoBlock title="Spacing" note="4px base · --spacing">
          <ul className="flex flex-col gap-2">
            {spacing.map((s) => (
              <li key={s} className="flex items-center gap-3">
                <code className="w-10 text-caption text-muted-foreground tabular-nums">{s}</code>
                <span className="h-2.5 rounded-xs bg-gold" style={{ width: `calc(var(--spacing) * ${s})` }} />
                <span className="text-caption text-muted-foreground tabular-nums">{`${s * 4}px`}</span>
              </li>
            ))}
          </ul>
        </DemoBlock>

        <DemoBlock title="Radius" note="--radius: 0.375rem">
          <ul className="grid grid-cols-3 gap-4 sm:grid-cols-5">
            {radii.map((r) => (
              <li key={r.token} className="flex flex-col items-center gap-2 text-center">
                <span className={`size-14 bg-secondary ring-1 ring-gold/50 ${r.token}`} />
                <code className="text-caption">{r.token}</code>
                <span className="text-caption text-muted-foreground">{r.value}</span>
              </li>
            ))}
          </ul>
        </DemoBlock>

        <DemoBlock title="Shadows & glows" className="lg:col-span-2">
          <ul className="grid grid-cols-2 gap-6 p-2 md:grid-cols-4">
            {shadows.map((s) => (
              <li key={s.token} className="flex flex-col items-center gap-3 text-center">
                <span className={`flex h-20 w-full items-center justify-center rounded-lg bg-card ${s.token}`} />
                <code className="text-caption">{s.token}</code>
                <span className="text-caption text-muted-foreground">{s.note}</span>
              </li>
            ))}
          </ul>
        </DemoBlock>

        <DemoBlock title="Ornament" note="CSS / SVG only">
          <div className="flex flex-col gap-5">
            <DoubleRule />
            <DoubleRule label="Intermission" />
            <div className="relative flex h-24 items-center justify-center rounded-lg bg-background">
              <DecoCorners />
              <span className="font-playbill text-gold">Deco corners</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="bulb-dots h-6 flex-1 rounded-sm" />
              <MarqueeBulbs total={10} current={4} label="Marquee bulb sample" />
            </div>
            <div className="velvet h-16 rounded-md" aria-label="Velvet curtain texture" role="img" />
          </div>
        </DemoBlock>

        <div className="grid gap-4 sm:grid-cols-2">
          <DemoBlock title="Z-index">
            <ul className="flex flex-col gap-1.5">
              {zIndex.map(([k, v]) => (
                <li key={k} className="flex justify-between text-body-sm">
                  <code>{k}</code>
                  <span className="text-muted-foreground tabular-nums">{v}</span>
                </li>
              ))}
            </ul>
          </DemoBlock>
          <DemoBlock title="Breakpoints">
            <ul className="flex flex-col gap-1.5">
              {breakpoints.map(([k, v]) => (
                <li key={k} className="flex justify-between text-body-sm">
                  <code>{`${k}:`}</code>
                  <span className="text-muted-foreground tabular-nums">{v}</span>
                </li>
              ))}
            </ul>
          </DemoBlock>
        </div>
      </div>
    </ShowcaseSection>
  )
}
