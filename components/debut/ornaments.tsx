import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('font-playbill text-gold', className)}>{children}</p>
}

export function DoubleRule({ label, className }: { label?: string; className?: string }) {
  if (!label) {
    return <div role="separator" className={cn('rule-double w-full', className)} />
  }
  return (
    <div role="separator" aria-label={label} className={cn('flex items-center gap-4', className)}>
      <span className="rule-double flex-1" />
      <span className="font-playbill text-gold" aria-hidden="true">
        {label}
      </span>
      <span className="rule-double flex-1" />
    </div>
  )
}

function Corner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 28"
      aria-hidden="true"
      className={cn('pointer-events-none absolute size-7 text-gold', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <path d="M1 27V1h26" />
      <path d="M5 27V5h22" opacity="0.6" />
      <path d="M9 9l4 0M9 9l0 4" />
      <rect x="11.5" y="11.5" width="3" height="3" transform="rotate(45 13 13)" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function DecoCorners({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-1.5', className)}>
      <Corner className="top-0 left-0" />
      <Corner className="top-0 right-0 rotate-90" />
      <Corner className="right-0 bottom-0 rotate-180" />
      <Corner className="bottom-0 left-0 -rotate-90" />
    </div>
  )
}

export function LiveBulb({ label = 'Live', className }: { label?: string; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span aria-hidden="true" className="size-2 animate-bulb-pulse rounded-full bg-gold" />
      <span className="font-playbill text-gold">{label}</span>
    </span>
  )
}

export function BulbLoader({ label = 'Loading', count = 7, className }: { label?: string; count?: number; className?: string }) {
  return (
    <span role="status" className={cn('inline-flex items-center gap-1.5', className)}>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="size-1.5 animate-bulb rounded-full bg-spotlight"
          style={{ animationDelay: `${i * 140}ms` }}
        />
      ))}
      <span className="sr-only">{label}</span>
    </span>
  )
}

type MarqueeBulbsProps = {
  total: number
  current: number
  label?: string
  onSelect?: (index: number) => void
  className?: string
}

export function MarqueeBulbs({ total, current, label = 'Progress', onSelect, className }: MarqueeBulbsProps) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current + 1}
      aria-valuetext={`Scene ${current + 1} of ${total}`}
      className={cn('flex flex-wrap items-center gap-1.5', className)}
    >
      {Array.from({ length: total }, (_, i) => {
        const state = i < current ? 'lit' : i === current ? 'current' : 'dark'
        const dot = (
          <span
            aria-hidden="true"
            className={cn(
              'block size-2.5 rounded-full transition-colors duration-(--dur-base)',
              state === 'lit' && 'bg-gold shadow-[0_0_6px_0_var(--gold)]',
              state === 'current' && 'animate-bulb-pulse bg-spotlight',
              state === 'dark' && 'bg-muted ring-1 ring-border',
            )}
          />
        )
        if (!onSelect) return <span key={i}>{dot}</span>
        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            className="rounded-full p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Go to scene ${i + 1}`}
            aria-current={i === current ? 'step' : undefined}
          >
            {dot}
          </button>
        )
      })}
    </div>
  )
}

const archRadius: CSSProperties = {
  borderRadius: '50% 50% var(--radius) var(--radius) / 2.75rem 2.75rem var(--radius) var(--radius)',
}

export function ProsceniumFrame({
  children,
  className,
  stageClassName,
}: {
  children: ReactNode
  className?: string
  stageClassName?: string
}) {
  return (
    <div className={cn('relative rounded-lg bg-velvet-deep p-2 shadow-spotlight sm:p-3', className)}>
      <div className="relative p-1.5 ring-1 ring-gold/60" style={archRadius}>
        <div
          className={cn('relative isolate overflow-hidden bg-background ring-1 ring-gold/40', stageClassName)}
          style={archRadius}
        >
          {children}
          <div aria-hidden="true" className="velvet pointer-events-none absolute inset-y-0 left-0 w-[5%] opacity-90" />
          <div aria-hidden="true" className="velvet pointer-events-none absolute inset-y-0 right-0 w-[5%] opacity-90" />
        </div>
      </div>
    </div>
  )
}

export function CurtainReveal({ playKey, className }: { playKey: string | number; className?: string }) {
  return (
    <div
      key={playKey}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 z-(--z-curtain) flex overflow-hidden', className)}
    >
      <div className="velvet h-full w-1/2 animate-curtain-left border-r border-gold/40" />
      <div className="velvet h-full w-1/2 animate-curtain-right border-l border-gold/40" />
    </div>
  )
}
