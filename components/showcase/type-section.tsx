import { ShowcaseSection } from '@/components/showcase/section'
import { cn } from '@/lib/utils'

const scale = [
  { token: 'display-2xl', spec: '72 / 1.0 / −2.5%', className: 'font-serif text-display-2xl', sample: 'Opening Night' },
  { token: 'display-xl', spec: '60 / 1.05 / −2%', className: 'font-serif text-display-xl italic', sample: 'Starring You' },
  { token: 'display-lg', spec: '48 / 1.1 / −1.5%', className: 'font-serif text-display-lg', sample: 'Scene 07' },
  { token: 'display-md', spec: '36 / 1.15 / −1%', className: 'font-serif text-display-md', sample: 'The Harbor Years' },
  { token: 'display-sm', spec: '30 / 1.2', className: 'font-serif text-display-sm', sample: 'Bring your story to the stage' },
  { token: 'heading', spec: '24 / 1.3', className: 'font-serif text-heading', sample: 'Cast List' },
  { token: 'title', spec: '20 / 1.4', className: 'font-serif text-title', sample: "Stage Manager's Log" },
  { token: 'body-lg', spec: '18 / 1.6', className: 'text-body-lg', sample: 'Twenty photos, twenty seconds each. Six minutes and forty seconds to say who you are.' },
  { token: 'body', spec: '16 / 1.6', className: 'text-body', sample: 'Your stage manager drafts the script; you rehearse until it fits the cue.' },
  { token: 'body-sm', spec: '14 / 1.5', className: 'text-body-sm', sample: 'Moved “Sunrise (take 2)” to understudy — near-duplicate.' },
  { token: 'caption', spec: '12 / 1.4 / +2%', className: 'text-caption text-muted-foreground', sample: 'Port Ellery, where it all began' },
  { token: 'eyebrow', spec: '12 / 1.2 / +28% · caps', className: 'font-playbill text-gold', sample: 'Act I · Now showing · Scene 07 / 20' },
]

export function TypeSection() {
  return (
    <ShowcaseSection
      id="type"
      act="Act II · The playbill"
      title="Typography"
      description="Bodoni Moda — a high-contrast didone — for titles, marquees and slide numbers. DM Sans for everything you read and click. Letterspaced caps for playbill labels."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2 rounded-lg bg-card p-6 ring-1 ring-border">
          <span className="font-playbill text-gold">Display · font-serif</span>
          <span className="font-serif text-display-lg italic">Bodoni Moda</span>
          <span className="font-serif text-body-lg tabular-nums text-muted-foreground">01 02 03 … 20 — Aa Bb Cc &amp;</span>
        </div>
        <div className="flex flex-col gap-2 rounded-lg bg-card p-6 ring-1 ring-border">
          <span className="font-playbill text-gold">Body / UI · font-sans</span>
          <span className="text-display-lg font-medium tracking-tight">DM Sans</span>
          <span className="text-body-lg text-muted-foreground">Warm, open, easy at 14px and up.</span>
        </div>
      </div>

      <ol className="flex flex-col">
        {scale.map((s) => (
          <li key={s.token} className="grid gap-2 border-b border-border py-5 md:grid-cols-[10rem_1fr] md:items-baseline md:gap-6">
            <div className="flex flex-col">
              <code className="text-body-sm font-semibold">{`text-${s.token}`}</code>
              <span className="text-caption text-muted-foreground tabular-nums">{s.spec}</span>
            </div>
            <p className={cn('min-w-0 text-pretty', s.className)}>{s.sample}</p>
          </li>
        ))}
      </ol>
    </ShowcaseSection>
  )
}
