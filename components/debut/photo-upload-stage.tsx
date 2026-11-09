'use client'

import { useId, useRef, useState, type DragEvent } from 'react'
import { ImagePlusIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { BulbLoader, Eyebrow } from '@/components/debut/ornaments'
import { cn } from '@/lib/utils'

type StageState = 'idle' | 'dragging' | 'uploading' | 'error'

export function PhotoUploadStage({
  onFiles,
  initialState = 'idle',
  className,
}: {
  onFiles?: (files: File[]) => void
  initialState?: StageState
  className?: string
}) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [state, setState] = useState<StageState>(initialState)
  const [count, setCount] = useState(0)

  function accept(fileList: FileList | null) {
    const files = Array.from(fileList ?? []).filter((f) => f.type.startsWith('image/'))
    if (files.length === 0) {
      setState('error')
      return
    }
    setCount(files.length)
    setState('uploading')
    onFiles?.(files)
    toast.success(`${files.length} photo${files.length === 1 ? '' : 's'} sent to the green room`)
    window.setTimeout(() => setState('idle'), 2200)
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    accept(e.dataTransfer.files)
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        if (state !== 'uploading') setState('dragging')
      }}
      onDragLeave={() => state === 'dragging' && setState('idle')}
      onDrop={onDrop}
      data-state={state}
      className={cn(
        'relative isolate flex min-h-72 flex-col items-center justify-end gap-4 overflow-hidden rounded-lg border border-dashed border-gold/40 bg-card px-6 pt-16 pb-10 text-center transition-[border-color,box-shadow] duration-(--dur-base) ease-stage',
        'data-[state=dragging]:border-solid data-[state=dragging]:border-gold data-[state=dragging]:shadow-spotlight',
        'data-[state=error]:border-destructive',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          'spotlight absolute inset-0 -z-10 opacity-70 transition-opacity duration-(--dur-spotlight) ease-spotlight',
          state === 'dragging' && 'opacity-100',
        )}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-[12%] bottom-6 -z-10 h-6 rounded-[50%] bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--spotlight)_28%,transparent),transparent_70%)]"
      />

      <span aria-hidden="true" className="flex size-12 items-center justify-center rounded-full ring-1 ring-gold/50">
        <ImagePlusIcon className="size-5 text-gold" />
      </span>

      <div className="flex flex-col gap-2">
        <Eyebrow>{state === 'dragging' ? 'Release to cast' : 'Act I · Load-in'}</Eyebrow>
        <h3 className="font-serif text-display-sm text-balance">Bring your story to the stage</h3>
        <p className="max-w-md text-body-sm text-pretty text-muted-foreground">
          Drop 20 to 40 photos from your life. Your stage manager will cast the best ones and set the rest aside as
          understudies.
        </p>
      </div>

      <div aria-live="polite" className="flex min-h-9 items-center">
        {state === 'uploading' ? (
          <span className="flex items-center gap-3 text-body-sm">
            <BulbLoader label={`Uploading ${count} photos`} />
            {`Sending ${count} photo${count === 1 ? '' : 's'} backstage…`}
          </span>
        ) : state === 'error' ? (
          <span className="flex items-center gap-3 text-body-sm text-destructive">
            Only image files can take the stage.
            <Button size="sm" variant="ghost" onClick={() => setState('idle')}>
              Try again
            </Button>
          </span>
        ) : (
          <Button onClick={() => inputRef.current?.click()}>Choose photos</Button>
        )}
      </div>

      <label htmlFor={inputId} className="sr-only">
        Upload photos
      </label>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => accept(e.target.files)}
      />
    </div>
  )
}
