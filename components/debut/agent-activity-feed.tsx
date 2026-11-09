import { CheckIcon } from 'lucide-react'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BulbLoader, LiveBulb } from '@/components/debut/ornaments'
import type { LogEntry } from '@/lib/debut-data'
import { cn } from '@/lib/utils'

export function AgentActivityFeed({ entries, className }: { entries: LogEntry[]; className?: string }) {
  const live = entries.some((e) => e.state === 'live')

  return (
    <Card className={cn('spotlight', className)}>
      <CardHeader>
        <CardTitle>{"Stage Manager's Log"}</CardTitle>
        <CardDescription>What your agent is doing in the wings</CardDescription>
        <CardAction>{live ? <LiveBulb /> : <span className="font-playbill text-muted-foreground">Idle</span>}</CardAction>
      </CardHeader>
      <CardContent>
        <ol role="log" aria-live="polite" aria-label="Agent activity" className="flex flex-col">
          {entries.map((entry, i) => (
            <li
              key={entry.id}
              className="relative flex gap-3 pb-4 last:pb-0 animate-rise"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span aria-hidden="true" className="relative flex w-4 justify-center">
                <span className="absolute top-5 bottom-0 w-px bg-border [li:last-child_&]:hidden" />
                <span
                  className={cn(
                    'mt-1 flex size-4 items-center justify-center rounded-full ring-1',
                    entry.state === 'live' ? 'bg-gold/15 ring-gold' : 'bg-muted ring-border',
                  )}
                >
                  {entry.state === 'live' ? (
                    <span className="size-1.5 animate-bulb-pulse rounded-full bg-gold" />
                  ) : (
                    <CheckIcon className="size-2.5 text-gold" />
                  )}
                </span>
              </span>
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="flex items-baseline gap-2 font-playbill">
                  <time className="text-muted-foreground tabular-nums">{entry.time}</time>
                  <span className="text-gold">{entry.act}</span>
                </p>
                <p className="flex items-center gap-2 text-body-sm text-pretty">
                  {entry.message}
                  {entry.state === 'live' && <BulbLoader count={3} label="In progress" />}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}
