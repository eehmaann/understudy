'use client'

import { useState } from 'react'
import { CopyIcon, DownloadIcon, PackageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Eyebrow } from '@/components/debut/ornaments'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { KIT_FILENAME } from '@/lib/debut-meta'
import type { DesignSystemFile } from '@/lib/design-system'
import { cn } from '@/lib/utils'

export function ExportDialog({ files }: { files: DesignSystemFile[] }) {
  const [format, setFormat] = useState<DesignSystemFile['id']>(files[0]?.id ?? 'css')
  const file = files.find((item) => item.id === format) ?? files[0]

  if (!file) return null

  async function copy() {
    if (!file) return
    try {
      await navigator.clipboard.writeText(file.contents)
      toast.success(`Copied ${file.filename}`)
    } catch {
      toast.error('Clipboard unavailable. Download the file instead.')
    }
  }

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" size="sm" aria-label="Export the design system" />}>
        <DownloadIcon data-icon="inline-start" />
        Export
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-3xl">
        <DialogHeader className="pr-8">
          <Eyebrow>Prompt book</Eyebrow>
          <DialogTitle className="font-serif text-title">Export Debut</DialogTitle>
          <DialogDescription>
            Download the tokens as CSS, a Tailwind v4 theme, W3C design tokens, or a style guide. Stage, the dark
            mode, is the default.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={format}
          onValueChange={(value) => {
            const next = files.find((item) => item.id === value)
            if (next) setFormat(next.id)
          }}
        >
          <TabsList
            className="grid h-auto w-full grid-cols-2 gap-1 sm:grid-cols-4"
            style={{ display: 'grid', width: '100%', height: 'auto' }}
          >
            {files.map((item) => (
              <TabsTrigger key={item.id} value={item.id} className="w-full px-2">
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {files.map((item) => (
            <TabsContent key={item.id} value={item.id} className="flex flex-col gap-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <p className="text-body-sm text-muted-foreground">{item.description}</p>
                <p className="text-caption text-muted-foreground">
                  <span className="text-gold">{item.filename}</span>
                  {` · ${formatBytes(new Blob([item.contents]).size)}`}
                </p>
              </div>
              <pre
                tabIndex={0}
                aria-label={`${item.label} preview`}
                className="max-h-[min(22rem,40vh)] overflow-auto rounded-md bg-background p-4 font-mono text-caption leading-relaxed text-foreground ring-1 ring-border"
              >
                <code>{item.contents}</code>
              </pre>
            </TabsContent>
          ))}
        </Tabs>

        <p className="text-caption text-muted-foreground">
          The kit is a zip of every file. Semantic JSON colors point at the stage. Matinee lives under{' '}
          <code>color.matinee</code>.
        </p>

        <DialogFooter>
          <a
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full sm:w-auto')}
            href="/api/design-system?format=zip"
            download={KIT_FILENAME}
          >
            <PackageIcon data-icon="inline-start" />
            Download kit
          </a>
          <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={copy}>
            <CopyIcon data-icon="inline-start" />
            Copy
          </Button>
          <a
            className={cn(buttonVariants({ variant: 'default', size: 'sm' }), 'w-full sm:w-auto')}
            href={`/api/design-system?format=${file.id}`}
            download={file.filename}
          >
            <DownloadIcon data-icon="inline-start" />
            Download
          </a>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const kilobytes = bytes / 1024
  return `${kilobytes.toFixed(kilobytes >= 10 ? 0 : 1)} KB`
}
