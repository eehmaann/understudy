import { CheckIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DoubleRule } from '@/components/debut/ornaments'
import { padSlide, type CoverageItem } from '@/lib/debut-data'
import { cn } from '@/lib/utils'

export function CoverageChecklist({ items, className }: { items: CoverageItem[]; className?: string }) {
  const cast = items.filter((i) => i.slides.length > 0).length

  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <CardTitle className="font-serif text-heading">Cast List</CardTitle>
        <CardDescription className="font-playbill">{`${cast} of ${items.length} roles cast`}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <DoubleRule />
        <ul className="flex flex-col gap-2.5">
          {items.map((item) => {
            const covered = item.slides.length > 0
            return (
              <li key={item.id} className="flex items-baseline gap-3">
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex size-4 shrink-0 translate-y-0.5 items-center justify-center rounded-full ring-1',
                    covered ? 'bg-gold text-gold-foreground ring-gold' : 'ring-muted-foreground/60',
                  )}
                >
                  {covered && <CheckIcon className="size-2.5" strokeWidth={3} />}
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className={cn('font-serif text-body', !covered && 'text-muted-foreground italic')}>{item.role}</span>
                  <span className="text-caption text-muted-foreground">{item.detail}</span>
                </span>
                <span aria-hidden="true" className="min-w-4 flex-1 translate-y-[-3px] border-b border-dotted border-muted-foreground/50" />
                <span className={cn('shrink-0 font-playbill tabular-nums', covered ? 'text-gold' : 'text-muted-foreground')}>
                  <span className="sr-only">{covered ? 'Covered in ' : 'Missing'}</span>
                  {covered ? item.slides.map(padSlide).join(' · ') : 'Vacant'}
                </span>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
