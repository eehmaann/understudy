import type { ReactNode } from 'react'
import { DoubleRule, Eyebrow } from '@/components/debut/ornaments'
import { cn } from '@/lib/utils'

export function ShowcaseSection({
  id,
  act,
  title,
  description,
  children,
  className,
}: {
  id: string
  act: string
  title: string
  description?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn('scroll-mt-24 flex flex-col gap-10 py-20', className)}>
      <header className="flex flex-col items-center gap-3 text-center">
        <Eyebrow>{act}</Eyebrow>
        <h2 id={`${id}-title`} className="font-serif text-display-md text-balance sm:text-display-lg">
          {title}
        </h2>
        {description && <p className="max-w-2xl text-body text-pretty text-muted-foreground">{description}</p>}
        <DoubleRule className="mt-2 w-40" />
      </header>
      {children}
    </section>
  )
}

export function DemoBlock({
  title,
  note,
  children,
  className,
}: {
  title: string
  note?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-4 rounded-lg bg-card p-5 ring-1 ring-border', className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-serif text-title">{title}</h3>
        {note && <span className="font-playbill text-muted-foreground">{note}</span>}
      </div>
      {children}
    </div>
  )
}

export function StateLabel({ children }: { children: ReactNode }) {
  return <span className="font-playbill text-muted-foreground">{children}</span>
}
