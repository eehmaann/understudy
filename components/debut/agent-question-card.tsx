'use client'

import Image from 'next/image'
import { useId, useState, type FormEvent } from 'react'
import { SendIcon } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { DecoCorners, Eyebrow } from '@/components/debut/ornaments'
import type { Photo } from '@/lib/debut-data'
import { cn } from '@/lib/utils'

export function AgentQuestionCard({
  question,
  context,
  photos = [],
  replies = [],
  onAnswer,
  className,
}: {
  question: string
  context?: string
  photos?: Photo[]
  replies?: string[]
  onAnswer?: (answer: string) => void
  className?: string
}) {
  const inputId = useId()
  const [answer, setAnswer] = useState<string | null>(null)
  const [draft, setDraft] = useState('')

  function submit(value: string) {
    const trimmed = value.trim()
    if (!trimmed) return
    setAnswer(trimmed)
    onAnswer?.(trimmed)
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    submit(draft)
  }

  return (
    <Card className={cn('relative shadow-gilded', className)}>
      <DecoCorners />
      <CardHeader className="flex items-start gap-3 px-6 pt-2">
        <Avatar className="size-9 ring-1 ring-gold/60">
          <AvatarFallback className="bg-velvet font-serif text-primary-foreground">SM</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <Eyebrow>Cue from the wings</Eyebrow>
          <h3 className="font-serif text-title text-balance">{question}</h3>
          {context && <p className="text-body-sm text-muted-foreground">{context}</p>}
        </div>
      </CardHeader>

      {photos.length > 0 && (
        <CardContent className="px-6">
          <ul className="flex gap-2" aria-label="Related photos">
            {photos.map((p) => (
              <li key={p.id} className="relative aspect-[4/3] w-24 overflow-hidden rounded-md ring-1 ring-border">
                <Image src={p.src || '/placeholder.svg'} alt={p.alt} fill sizes="96px" className="object-cover" />
              </li>
            ))}
          </ul>
        </CardContent>
      )}

      <CardFooter className="flex-col items-stretch gap-3 px-6 pb-4">
        {answer ? (
          <p aria-live="polite" className="text-body-sm">
            <span className="font-playbill text-gold">Your answer · </span>
            {answer}
          </p>
        ) : (
          <>
            {replies.length > 0 && (
              <div role="group" aria-label="Quick replies" className="flex flex-wrap gap-2">
                {replies.map((r) => (
                  <Button key={r} size="sm" variant="outline" className="rounded-full" onClick={() => submit(r)}>
                    {r}
                  </Button>
                ))}
              </div>
            )}
            <form onSubmit={onSubmit} className="flex gap-2">
              <label htmlFor={inputId} className="sr-only">
                Answer the stage manager
              </label>
              <Input
                id={inputId}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Or tell me in your own words…"
              />
              <Button type="submit" size="icon" aria-label="Send answer">
                <SendIcon />
              </Button>
            </form>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
