import { CircleAlertIcon, LightbulbIcon, StarIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { DecoCorners, Eyebrow } from '@/components/debut/ornaments'
import { padSlide, type CriticNote } from '@/lib/debut-data'
import { cn } from '@/lib/utils'

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <span role="img" aria-label={`Rated ${rating} out of ${max} stars`} className="flex gap-1">
      {Array.from({ length: max }, (_, i) => (
        <StarIcon
          key={i}
          aria-hidden="true"
          className={cn('size-4', i < rating ? 'fill-gold text-gold' : 'text-muted-foreground/50')}
        />
      ))}
    </span>
  )
}

function NoteList({ notes, kind }: { notes: CriticNote[]; kind: CriticNote['kind'] }) {
  const Icon = kind === 'blocking' ? CircleAlertIcon : LightbulbIcon
  return (
    <ul className="flex flex-col gap-3">
      {notes.map((note) => (
        <li key={note.id} className="flex gap-3">
          <Icon aria-hidden="true" className={cn('mt-0.5 size-4 shrink-0', kind === 'blocking' ? 'text-destructive' : 'text-gold')} />
          <p className="text-body-sm text-pretty">
            {note.slide && (
              <Badge variant="outline" className="mr-2 tabular-nums">{`Scene ${padSlide(note.slide)}`}</Badge>
            )}
            {note.text}
          </p>
        </li>
      ))}
    </ul>
  )
}

export function CriticNotes({
  rating,
  pullQuote,
  notes,
  className,
}: {
  rating: number
  pullQuote: string
  notes: CriticNote[]
  className?: string
}) {
  const blocking = notes.filter((n) => n.kind === 'blocking')
  const suggestions = notes.filter((n) => n.kind === 'suggestion')

  return (
    <Card className={cn('relative', className)}>
      <DecoCorners />
      <CardHeader className="items-center gap-2 px-8 pt-3 text-center">
        <Eyebrow>Opening Night Review</Eyebrow>
        <StarRating rating={rating} />
        <blockquote className="font-serif text-title italic text-balance">{`“${pullQuote}”`}</blockquote>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-6 pb-2">
        <section aria-labelledby="blocking-notes" className="flex flex-col gap-3">
          <h4 id="blocking-notes" className="font-playbill text-destructive">
            {`Blocking notes · ${blocking.length}`}
          </h4>
          <NoteList notes={blocking} kind="blocking" />
        </section>
        <Separator />
        <section aria-labelledby="suggestion-notes" className="flex flex-col gap-3">
          <h4 id="suggestion-notes" className="font-playbill text-gold">
            {`Suggestions · ${suggestions.length}`}
          </h4>
          <NoteList notes={suggestions} kind="suggestion" />
        </section>
      </CardContent>
    </Card>
  )
}
