/** Human copy for tokens parsed from app/globals.css. Values stay in the stylesheet. */

export const KIT_FILENAME = 'debut-design-system.zip'

export const colorMeta: Record<string, { role: string; pair?: string }> = {
  background: { role: 'Velvet stage / playbill paper', pair: 'foreground' },
  foreground: { role: 'Champagne text on stage, ink on the playbill' },
  card: { role: 'Raised surfaces', pair: 'card-foreground' },
  'card-foreground': { role: 'Text on raised surfaces' },
  popover: { role: 'Menus and dialogs', pair: 'popover-foreground' },
  'popover-foreground': { role: 'Text on menus and dialogs' },
  primary: { role: 'Curtain crimson', pair: 'primary-foreground' },
  'primary-foreground': { role: 'Text on crimson' },
  secondary: { role: 'Champagne', pair: 'secondary-foreground' },
  'secondary-foreground': { role: 'Text on champagne' },
  muted: { role: 'Quiet surfaces', pair: 'muted-foreground' },
  'muted-foreground': { role: 'Smoky taupe text' },
  accent: { role: 'Antique brass', pair: 'accent-foreground' },
  'accent-foreground': { role: 'Text on brass' },
  destructive: { role: 'Warning red', pair: 'destructive-foreground' },
  'destructive-foreground': { role: 'Text on warning red' },
  border: { role: 'Hairlines' },
  input: { role: 'Field borders' },
  ring: { role: 'Gold focus ring' },
  gold: { role: 'Text-safe gold', pair: 'gold-foreground' },
  'gold-foreground': { role: 'Text on gold' },
  spotlight: { role: 'Radial glow only' },
  velvet: { role: 'Curtain fabric' },
  'velvet-deep': { role: 'Curtain shadow' },
  'chart-1': { role: 'Chart series 1' },
  'chart-2': { role: 'Chart series 2' },
  'chart-3': { role: 'Chart series 3' },
  'chart-4': { role: 'Chart series 4' },
  'chart-5': { role: 'Chart series 5' },
  sidebar: { role: 'Sidebar surface', pair: 'sidebar-foreground' },
  'sidebar-foreground': { role: 'Sidebar text' },
  'sidebar-primary': { role: 'Sidebar primary', pair: 'sidebar-primary-foreground' },
  'sidebar-primary-foreground': { role: 'Text on sidebar primary' },
  'sidebar-accent': { role: 'Sidebar accent surface', pair: 'sidebar-accent-foreground' },
  'sidebar-accent-foreground': { role: 'Sidebar accent text' },
  'sidebar-border': { role: 'Sidebar hairline' },
  'sidebar-ring': { role: 'Sidebar focus ring' },
}

export const durationMeta: Record<string, string> = {
  instant: 'Press feedback',
  fast: 'Hover, color',
  base: 'Most transitions',
  slow: 'Gold shine sweep',
  spotlight: 'Spotlight fade-in',
  curtain: 'Curtain reveal',
  shimmer: 'Bulb shimmer loop',
}

/** Durations that are transitions. Shimmer is a loop, so it is omitted. */
export const transitionEasing: Record<string, string> = {
  instant: 'stage',
  fast: 'stage',
  base: 'stage',
  slow: 'stage',
  spotlight: 'spotlight',
  curtain: 'curtain',
}

export const easingMeta: Record<string, string> = {
  stage: 'Entrances and most movement',
  curtain: 'Curtain open',
  spotlight: 'Spotlight fade',
}

export const shadowMeta: Record<string, string> = {
  glow: 'Hover lift',
  ember: 'Primary actions',
  spotlight: 'Focal content',
  gilded: 'Inner gold border',
}

export const typeMeta: Record<string, string> = {
  'display-2xl': 'Opening titles',
  'display-xl': 'Hero titles',
  'display-lg': 'Scene titles',
  'display-md': 'Section titles',
  'display-sm': 'Stage subheads',
  heading: 'Block headings',
  title: 'Card and panel titles',
  'body-lg': 'Lead paragraphs',
  body: 'Running text',
  'body-sm': 'Secondary text',
  caption: 'Captions and metadata',
  eyebrow: 'Playbill labels. Uppercase, wide tracking, semibold.',
}

/** Steps shown in the showcase. Each step is n × 0.25rem (Tailwind’s default scale). */
export const spacingSteps = [1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24] as const

/** Tailwind defaults. `xs` comes from the stylesheet. */
export const tailwindBreakpoints = [
  { name: 'sm', rem: 40, px: 640 },
  { name: 'md', rem: 48, px: 768 },
  { name: 'lg', rem: 64, px: 1024 },
  { name: 'xl', rem: 80, px: 1280 },
  { name: '2xl', rem: 96, px: 1536 },
] as const
