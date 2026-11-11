'use client'

import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { ExportDialog } from '@/components/showcase/export-dialog'
import { Button } from '@/components/ui/button'
import type { DesignSystemFile } from '@/lib/design-system'

const links = [
  { href: '#color', label: 'Color' },
  { href: '#type', label: 'Type' },
  { href: '#tokens', label: 'Tokens' },
  { href: '#motion', label: 'Motion' },
  { href: '#components', label: 'Components' },
  { href: '#debut', label: 'App' },
  { href: '#workspace', label: 'Workspace' },
]

export function ShowcaseNav({ files }: { files: DesignSystemFile[] }) {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-(--z-sticky) border-b border-border bg-background/85 backdrop-blur-md">
      <nav aria-label="Showcase sections" className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="#top" className="flex items-baseline gap-2 rounded-sm">
          <span className="font-serif text-title font-semibold italic">Debut</span>
          <span className="hidden font-playbill text-gold sm:inline">Design System</span>
        </a>
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-sm px-2.5 py-1.5 text-body-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <ExportDialog files={files} />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle between stage (dark) and matinee (light) mode"
          >
            <SunIcon data-icon="inline-start" className="hidden dark:block" />
            <MoonIcon data-icon="inline-start" className="dark:hidden" />
            <span className="hidden dark:inline">Matinee</span>
            <span className="dark:hidden">Stage</span>
          </Button>
        </div>
      </nav>
    </header>
  )
}
