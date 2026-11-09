import { ShowcaseSection } from '@/components/showcase/section'
import { cn } from '@/lib/utils'

type Token = { name: string; stage: string; matinee: string; fg?: string; role: string }

const tokens: Token[] = [
  { name: 'background', stage: '345 32% 6%', matinee: '42 45% 95%', fg: 'foreground', role: 'Velvet stage / playbill paper' },
  { name: 'card', stage: '345 26% 9%', matinee: '42 55% 98%', fg: 'card-foreground', role: 'Raised surfaces' },
  { name: 'primary', stage: '350 70% 44%', matinee: '350 72% 38%', fg: 'primary-foreground', role: 'Curtain crimson' },
  { name: 'accent', stage: '42 58% 56%', matinee: '42 70% 52%', fg: 'accent-foreground', role: 'Antique brass' },
  { name: 'secondary', stage: '40 38% 84%', matinee: '40 38% 88%', fg: 'secondary-foreground', role: 'Champagne' },
  { name: 'muted', stage: '345 16% 15%', matinee: '40 28% 90%', fg: 'muted-foreground', role: 'Smoky taupe text' },
  { name: 'destructive', stage: '8 88% 62%', matinee: '12 85% 40%', fg: 'destructive-foreground', role: 'Warning red' },
  { name: 'gold', stage: '42 62% 62%', matinee: '36 75% 30%', fg: 'gold-foreground', role: 'Text-safe gold' },
  { name: 'spotlight', stage: '44 90% 86%', matinee: '44 95% 80%', role: 'Radial glow only' },
  { name: 'velvet', stage: '350 68% 32%', matinee: '350 70% 30%', role: 'Curtain fabric' },
  { name: 'border', stage: '38 22% 22%', matinee: '38 30% 78%', role: 'Hairlines' },
  { name: 'ring', stage: '42 70% 60%', matinee: '38 80% 42%', role: 'Gold focus ring' },
]

const charts = ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5']

function Palette({ mode }: { mode: 'stage' | 'matinee' }) {
  const isStage = mode === 'stage'
  return (
    <div className={cn(isStage ? 'dark' : 'light', 'flex flex-col gap-5 rounded-lg bg-background p-5 text-foreground ring-1 ring-border')}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-serif text-heading italic">{isStage ? 'Stage' : 'Matinee'}</h3>
        <span className="font-playbill text-gold">{isStage ? '.dark · default' : '.light'}</span>
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {tokens.map((t) => (
          <li key={t.name} className="flex flex-col gap-2">
            <div
              className="flex aspect-[5/3] items-end rounded-md p-2 ring-1 ring-border"
              style={{ background: `var(--${t.name})`, color: t.fg ? `var(--${t.fg})` : undefined }}
            >
              {t.fg && <span className="font-serif text-title leading-none">Aa</span>}
            </div>
            <div className="flex flex-col">
              <code className="text-caption font-semibold">{`--${t.name}`}</code>
              <span className="text-caption text-muted-foreground tabular-nums">{`hsl(${isStage ? t.stage : t.matinee})`}</span>
              <span className="text-caption text-muted-foreground">{t.role}</span>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-2">
        <span className="font-playbill text-muted-foreground">Charts</span>
        <div className="flex gap-2">
          {charts.map((c) => (
            <div key={c} className="flex flex-1 flex-col gap-1">
              <div className="h-8 rounded-sm" style={{ background: `var(--${c})` }} />
              <code className="text-caption text-muted-foreground">{c}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ColorSection() {
  return (
    <ShowcaseSection
      id="color"
      act="Act I · The house"
      title="Color"
      description="HSL tokens mapped to shadcn roles. Every text/background pair meets WCAG AA. Gold has a dedicated text-safe token so brass stays legible on ivory paper."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Palette mode="stage" />
        <Palette mode="matinee" />
      </div>
    </ShowcaseSection>
  )
}
