import { hslToHex, parseHsl } from './color'
import { parseDeclarations, parseTopLevelBlocks, type CssBlock, type CssDecl } from './css-parse'
import {
  colorMeta,
  durationMeta,
  easingMeta,
  KIT_FILENAME,
  shadowMeta,
  spacingSteps,
  tailwindBreakpoints,
  transitionEasing,
  typeMeta,
} from './debut-meta'
import { createZip } from './zip'

export const DESIGN_SYSTEM_NAME = 'Debut'
export const DESIGN_SYSTEM_VERSION = '1.0.0'

export const FONT_STYLESHEET =
  'https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,400;1,6..96,500&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,600;1,9..40,400&display=swap'

const KIT_DIR = 'debut'

export type DesignSystemFileId = 'css' | 'tailwind' | 'json' | 'markdown'

export type DesignSystemFile = {
  id: DesignSystemFileId
  label: string
  filename: string
  mime: string
  description: string
  contents: string
}

type Dimension = { value: number; unit: 'px' | 'rem' | 'em' }

type ColorToken = {
  name: string
  role: string
  pair?: string
  stage: string
  matinee: string
}

type ShadowLayer = {
  inset: boolean
  offsetX: Dimension
  offsetY: Dimension
  blur: Dimension
  spread: Dimension
  token: string
  alpha: number
}

type ShadowToken = {
  name: string
  description: string
  css: string
  layers: ShadowLayer[]
}

type TypeToken = {
  name: string
  description: string
  family: 'sans' | 'serif'
  weight: 'regular' | 'medium' | 'semibold'
  fontSize: number
  lineHeight: number
  letterSpacing: number
  transform?: 'uppercase'
  utility?: string
}

export type DesignSystem = {
  colors: ColorToken[]
  grain: { stage: number; matinee: number }
  radiusBase: { css: string; rem: number }
  radii: { name: string; css: string; rem: number }[]
  durations: { name: string; css: string; value: number; unit: 'ms' | 's'; description: string }[]
  zIndex: { name: string; value: number }[]
  fonts: { id: 'sans' | 'serif'; cssVariable: string; families: string[]; themeValue: string; description: string }[]
  shadows: ShadowToken[]
  easings: { name: string; css: string; points: number[]; description: string }[]
  typography: TypeToken[]
  breakpoints: { name: string; rem: number; px: number; source: 'css' | 'tailwind' }[]
  animations: { name: string; css: string }[]
  transitions: { name: string; duration: string; easing: string; description: string }[]
  lightDecls: CssDecl[]
  darkDecls: CssDecl[]
  sharedDecls: CssDecl[]
  themeInlineDecls: CssDecl[]
  themeDecls: CssDecl[]
  keyframes: { name: string; body: string }[]
  utilities: { name: string; body: string }[]
  layerBody: string
  reducedMotion: { selector: string; body: string }
  selectionBody: string
  focusBody: string
  grainBody: string
}

export function parseDesignSystem(css: string): DesignSystem {
  const blocks = parseTopLevelBlocks(css)
  const light = requireBlock(blocks, ':root, .light')
  const dark = requireBlock(blocks, '.dark')
  const shared = requireBlock(blocks, ':root')
  const themeInline = requireBlock(blocks, '@theme inline')
  const theme = requireBlock(blocks, '@theme')
  const layer = requireBlock(blocks, '@layer base')
  const reduced = blocks.find((block) => block.selector.startsWith('@media (prefers-reduced-motion'))
  if (!reduced) throw new Error('Missing CSS block: prefers-reduced-motion')

  const lightDecls = parseDeclarations(light.body)
  const darkDecls = parseDeclarations(dark.body)
  const sharedDecls = parseDeclarations(shared.body)
  const themeInlineDecls = parseDeclarations(themeInline.body)
  const themeDecls = parseDeclarations(theme.body)

  const colors: ColorToken[] = []
  let grainMatinee: number | null = null
  let radiusBase: { css: string; rem: number } | null = null

  for (const decl of lightDecls) {
    if (decl.value.startsWith('hsl(')) {
      const meta = colorMeta[decl.name]
      if (!meta) throw new Error(`No description for color --${decl.name}`)
      const stage = darkDecls.find((item) => item.name === decl.name)
      if (!stage || !stage.value.startsWith('hsl(')) throw new Error(`Stage is missing hsl(--${decl.name})`)
      colors.push({ name: decl.name, role: meta.role, pair: meta.pair, matinee: decl.value, stage: stage.value })
    } else if (decl.name === 'grain-opacity') {
      grainMatinee = parseNumber(decl.value)
    } else if (decl.name === 'radius') {
      radiusBase = { css: decl.value, rem: parseRem(decl.value) }
    } else {
      throw new Error(`Unexpected matinee token --${decl.name}`)
    }
  }

  let grainStage: number | null = null
  for (const decl of darkDecls) {
    if (decl.value.startsWith('hsl(')) {
      if (!colors.some((color) => color.name === decl.name)) throw new Error(`Matinee is missing hsl(--${decl.name})`)
    } else if (decl.name === 'grain-opacity') {
      grainStage = parseNumber(decl.value)
    } else {
      throw new Error(`Unexpected stage token --${decl.name}`)
    }
  }
  if (grainMatinee === null || grainStage === null || !radiusBase) {
    throw new Error('Matinee and stage must define grain opacity, and matinee must define --radius')
  }

  const durations = sharedDecls
    .filter((decl) => decl.name.startsWith('dur-'))
    .map((decl) => {
      const name = decl.name.slice(4)
      const description = durationMeta[name]
      if (!description) throw new Error(`No description for duration --${decl.name}`)
      const parsed = parseDuration(decl.value)
      return { name, css: decl.value, description, ...parsed }
    })
  const zIndex = sharedDecls
    .filter((decl) => decl.name.startsWith('z-'))
    .map((decl) => ({ name: decl.name.slice(2), value: parseInteger(decl.value) }))
  for (const decl of sharedDecls) {
    if (!decl.name.startsWith('dur-') && !decl.name.startsWith('z-')) {
      throw new Error(`Unexpected shared token --${decl.name}`)
    }
  }

  const fonts = (['font-sans', 'font-serif'] as const).map((name) => {
    const decl = requireDecl(themeInlineDecls, name)
    const parsed = parseFontStack(decl.value)
    const id = name === 'font-sans' ? 'sans' : 'serif'
    return {
      id,
      cssVariable: parsed.cssVariable,
      families: parsed.families,
      themeValue: decl.value,
      description: id === 'sans' ? 'Body and UI. DM Sans.' : 'Titles, marquees, and slide numbers. Bodoni Moda.',
    } as const
  })

  const radii = themeInlineDecls
    .filter((decl) => decl.name.startsWith('radius-'))
    .map((decl) => ({
      name: decl.name.slice('radius-'.length),
      css: decl.value,
      rem: resolveRadius(decl.value, radiusBase.rem),
    }))

  const shadows = themeInlineDecls
    .filter((decl) => decl.name.startsWith('shadow-'))
    .map((decl) => {
      const name = decl.name.slice('shadow-'.length)
      const description = shadowMeta[name]
      if (!description) throw new Error(`No description for shadow --${decl.name}`)
      return { name, description, css: decl.value, layers: parseShadow(decl.value) }
    })

  const easings = themeInlineDecls
    .filter((decl) => decl.name.startsWith('ease-'))
    .map((decl) => {
      const name = decl.name.slice('ease-'.length)
      const description = easingMeta[name]
      if (!description) throw new Error(`No description for easing --${decl.name}`)
      return { name, css: decl.value, points: parseBezier(decl.value), description }
    })

  const animations = themeInlineDecls
    .filter((decl) => decl.name.startsWith('animate-'))
    .map((decl) => ({ name: decl.name.slice('animate-'.length), css: decl.value }))

  for (const decl of themeInlineDecls) {
    const known =
      decl.name === 'font-sans' ||
      decl.name === 'font-serif' ||
      decl.name.startsWith('color-') ||
      decl.name.startsWith('radius') ||
      decl.name.startsWith('shadow-') ||
      decl.name.startsWith('ease-') ||
      decl.name.startsWith('animate-')
    if (!known) throw new Error(`Unexpected theme token --${decl.name}`)
  }

  const typography = parseTypography(themeDecls)
  const cssBreakpoints = themeDecls
    .filter((decl) => decl.name.startsWith('breakpoint-'))
    .map((decl) => {
      const rem = parseRem(decl.value)
      return { name: decl.name.slice('breakpoint-'.length), rem, px: Math.round(rem * 16), source: 'css' as const }
    })
  for (const decl of themeDecls) {
    if (!decl.name.startsWith('text-') && !decl.name.startsWith('breakpoint-')) {
      throw new Error(`Unexpected type token --${decl.name}`)
    }
  }
  const breakpoints = [
    ...cssBreakpoints,
    ...tailwindBreakpoints
      .filter((item) => !cssBreakpoints.some((bp) => bp.name === item.name))
      .map((item) => ({ ...item, source: 'tailwind' as const })),
  ]

  const knownDurations = new Set(durations.map((item) => item.name))
  const knownEasings = new Set(easings.map((item) => item.name))
  const transitions = Object.entries(transitionEasing).map(([duration, easing]) => {
    if (!knownDurations.has(duration)) throw new Error(`Transition uses unknown duration ${duration}`)
    if (!knownEasings.has(easing)) throw new Error(`Transition uses unknown easing ${easing}`)
    return { name: duration, duration, easing, description: durationMeta[duration]! }
  })

  const layerBlocks = parseTopLevelBlocks(layer.body)
  const selection = layerBlocks.find((block) => block.selector === '::selection')
  const focus = layerBlocks.find((block) => block.selector === ':focus-visible')
  const grain = layerBlocks.find((block) => block.selector === 'body::before')
  if (!selection || !focus || !grain) throw new Error('Missing selection, focus, or grain rule in @layer base')

  const keyframes = blocks
    .filter((block) => block.selector.startsWith('@keyframes '))
    .map((block) => ({ name: block.selector.slice('@keyframes '.length), body: block.body }))
  const utilities = blocks
    .filter((block) => block.selector.startsWith('@utility '))
    .map((block) => ({ name: block.selector.slice('@utility '.length), body: block.body }))

  for (const shadow of shadows) {
    for (const layer of shadow.layers) {
      if (!colors.some((color) => color.name === layer.token)) {
        throw new Error(`Shadow ${shadow.name} references unknown color --${layer.token}`)
      }
    }
  }

  return {
    colors,
    grain: { stage: grainStage, matinee: grainMatinee },
    radiusBase,
    radii,
    durations,
    zIndex,
    fonts,
    shadows,
    easings,
    typography,
    breakpoints,
    animations,
    transitions,
    lightDecls,
    darkDecls,
    sharedDecls,
    themeInlineDecls,
    themeDecls,
    keyframes,
    utilities,
    layerBody: layer.body,
    reducedMotion: reduced,
    selectionBody: selection.body,
    focusBody: focus.body,
    grainBody: grain.body,
  }
}

export function designSystemFiles(ds: DesignSystem): DesignSystemFile[] {
  return [
    {
      id: 'css',
      label: 'CSS',
      filename: 'debut-tokens.css',
      mime: 'text/css; charset=utf-8',
      description: 'Custom properties, type, motion, and ornaments for any stylesheet.',
      contents: renderTokensCss(ds),
    },
    {
      id: 'tailwind',
      label: 'Tailwind',
      filename: 'debut-theme.css',
      mime: 'text/css; charset=utf-8',
      description: 'A Tailwind v4 entry file: tokens, theme, motion, and the base layer.',
      contents: renderTailwindCss(ds),
    },
    {
      id: 'json',
      label: 'JSON',
      filename: 'debut.tokens.json',
      mime: 'application/design-tokens+json; charset=utf-8',
      description: 'W3C design tokens (2025.10). Semantic colors use the stage.',
      contents: renderTokensJson(ds),
    },
    {
      id: 'markdown',
      label: 'Guide',
      filename: 'DEBUT.md',
      mime: 'text/markdown; charset=utf-8',
      description: 'A style guide you can read or hand to someone else.',
      contents: renderStyleGuide(ds),
    },
  ]
}

export const kitFile = {
  filename: KIT_FILENAME,
  mime: 'application/zip',
  description: 'Zip of the CSS, Tailwind theme, JSON tokens, style guide, and a readme.',
}

export function designSystemZip(ds: DesignSystem): Uint8Array {
  const files = designSystemFiles(ds)
  return createZip([
    { path: `${KIT_DIR}/README.md`, data: renderReadme() },
    ...files.map((file) => ({ path: `${KIT_DIR}/${file.filename}`, data: file.contents })),
  ])
}

export function exportIndex() {
  return {
    name: DESIGN_SYSTEM_NAME,
    version: DESIGN_SYSTEM_VERSION,
    defaultMode: 'stage',
    formats: {
      css: { filename: 'debut-tokens.css', href: '/api/design-system?format=css' },
      tailwind: { filename: 'debut-theme.css', href: '/api/design-system?format=tailwind' },
      json: { filename: 'debut.tokens.json', href: '/api/design-system?format=json' },
      markdown: { filename: 'DEBUT.md', href: '/api/design-system?format=markdown' },
      zip: { filename: kitFile.filename, href: '/api/design-system?format=zip' },
    },
  }
}

function renderTokensCss(ds: DesignSystem): string {
  return finish([
    `/**
 * ${DESIGN_SYSTEM_NAME} design tokens ${DESIGN_SYSTEM_VERSION}
 * Stage (dark) is the house default. Matinee (light) lives on :root,
 * and .dark replaces it — put class="dark" on <html> for the stage.
 * This file sets the page background, text, font, focus, and selection.
 * Add class "debut-grain" to <body> for the film grain.
 */`,
    `@import url("${FONT_STYLESHEET}");`,
    colorModes(ds),
    rule(':root', [
      ...fontDefinitions(ds),
      ...ds.fonts.map((font) => `--font-${font.id}: ${font.themeValue};`),
      ...declarations(ds.sharedDecls),
      ...ds.radii.map((item) => `--radius-${item.name}: ${item.css};`),
      ...ds.shadows.map((item) => `--shadow-${item.name}: ${item.css};`),
      ...ds.easings.map((item) => `--ease-${item.name}: ${item.css};`),
      ...ds.themeDecls.map((decl) => `--${decl.name}: ${decl.value};`),
    ]),
    renderKeyframes(ds),
    ds.animations.map((item) => rule(`.animate-${item.name}`, [`animation: ${item.css};`])).join('\n\n'),
    ds.utilities.map((item) => `.${item.name} {${item.body}}`).join('\n\n'),
    rule('body', [
      'background: var(--background);',
      'color: var(--foreground);',
      'font-family: var(--font-sans);',
    ]),
    `::selection {${ds.selectionBody}}`,
    `:focus-visible {${ds.focusBody}}`,
    `.debut-grain::before {${ds.grainBody}}`,
    `${ds.reducedMotion.selector} {${ds.reducedMotion.body}}`,
  ])
}

function renderTailwindCss(ds: DesignSystem): string {
  return finish([
    `/**
 * ${DESIGN_SYSTEM_NAME} for Tailwind CSS v4 — ${DESIGN_SYSTEM_VERSION}
 * Use this as the global stylesheet. class="dark" on <html> is the stage.
 * Grain, focus, and the page colors come from the base layer below.
 * If Tailwind is already imported, delete the two @import lines and
 * paste the rest beneath your existing imports.
 */`,
    '@import "tailwindcss";',
    `@import url("${FONT_STYLESHEET}");`,
    '@custom-variant dark (&:is(.dark *));',
    colorModes(ds),
    rule(':root', [...fontDefinitions(ds), ...declarations(ds.sharedDecls)]),
    emitTheme('@theme inline', ds.themeInlineDecls),
    emitTheme('@theme', ds.themeDecls),
    renderKeyframes(ds),
    ds.utilities.map((item) => `@utility ${item.name} {${item.body}}`).join('\n\n'),
    `@layer base {${ds.layerBody}}`,
    `${ds.reducedMotion.selector} {${ds.reducedMotion.body}}`,
  ])
}

function renderTokensJson(ds: DesignSystem): string {
  const stageColors: Record<string, unknown> = {}
  const matineeColors: Record<string, unknown> = {}
  const semantic: Record<string, unknown> = {}
  for (const color of ds.colors) {
    stageColors[color.name] = colorToken(color.stage, color.role)
    matineeColors[color.name] = colorToken(color.matinee, color.role)
    semantic[color.name] = {
      $type: 'color',
      $description: color.role,
      $value: `{color.stage.${color.name}}`,
    }
  }

  const shadowGroup = (mode: 'stage' | 'matinee') =>
    Object.fromEntries(
      ds.shadows.map((shadow) => [
        shadow.name,
        {
          $type: 'shadow',
          $description: shadow.description,
          $value: shadow.layers.map((layer) => shadowLayer(ds, shadow, layer, mode)),
          $extensions: {
            'com.debut': { cssVariable: `--shadow-${shadow.name}`, css: shadow.css },
          },
        },
      ]),
    )

  const doc = {
    $description: `${DESIGN_SYSTEM_NAME} ${DESIGN_SYSTEM_VERSION}. Theatrical design system. Semantic colors alias the stage (dark). Matinee is the light playbill. Specification: https://www.designtokens.org/tr/2025.10/format/`,
    $extensions: {
      'com.debut': {
        name: DESIGN_SYSTEM_NAME,
        version: DESIGN_SYSTEM_VERSION,
        defaultMode: 'stage',
        modes: ['stage', 'matinee'],
      },
    },
    color: {
      $description: 'Semantic colors alias the stage. Matinee values live under color.matinee.',
      ...semantic,
      stage: stageColors,
      matinee: matineeColors,
    },
    font: {
      ...Object.fromEntries(
        ds.fonts.map((font) => [
          font.id,
          { $type: 'fontFamily', $description: font.description, $value: font.families },
        ]),
      ),
      weight: {
        regular: { $type: 'fontWeight', $description: 'Running text', $value: 400 },
        medium: { $type: 'fontWeight', $description: 'Bodoni titles', $value: 500 },
        semibold: { $type: 'fontWeight', $description: 'Playbill labels', $value: 600 },
      },
    },
    typography: Object.fromEntries(ds.typography.map((token) => [token.name, typographyToken(token)])),
    spacing: {
      $description: '4px grid. Step n is n × 0.25rem, Tailwind’s default spacing scale.',
      $type: 'dimension',
      base: { $value: { value: 0.25, unit: 'rem' } },
      ...Object.fromEntries(
        spacingSteps.map((step) => [String(step), { $value: { value: round5(step * 0.25), unit: 'rem' } }]),
      ),
    },
    radius: {
      $description: 'Base corner radius. The named steps multiply it.',
      $type: 'dimension',
      base: {
        $description: 'Base radius',
        $value: { value: ds.radiusBase.rem, unit: 'rem' },
        $extensions: { 'com.debut': { css: ds.radiusBase.css } },
      },
      ...Object.fromEntries(
        ds.radii.map((item) => [
          item.name,
          {
            $value: { value: item.rem, unit: 'rem' },
            $extensions: { 'com.debut': { css: item.css } },
          },
        ]),
      ),
    },
    shadow: {
      $description:
        'Warm glows. stage and matinee resolve color-mix(in oklab, var(--token) P%, transparent) to that token at alpha P. The css extension is what the product renders, and it follows the active mode.',
      stage: shadowGroup('stage'),
      matinee: shadowGroup('matinee'),
    },
    duration: Object.fromEntries(
      ds.durations.map((item) => [
        item.name,
        {
          $type: 'duration',
          $description: item.description,
          $value: { value: item.value, unit: item.unit },
        },
      ]),
    ),
    easing: Object.fromEntries(
      ds.easings.map((item) => [
        item.name,
        { $type: 'cubicBezier', $description: item.description, $value: item.points },
      ]),
    ),
    transition: Object.fromEntries(
      ds.transitions.map((item) => [
        item.name,
        {
          $type: 'transition',
          $description: item.description,
          $value: {
            duration: `{duration.${item.duration}}`,
            delay: { value: 0, unit: 'ms' },
            timingFunction: `{easing.${item.easing}}`,
          },
        },
      ]),
    ),
    'z-index': Object.fromEntries(
      ds.zIndex.map((item) => [item.name, { $type: 'number', $value: item.value }]),
    ),
    breakpoint: Object.fromEntries(
      ds.breakpoints.map((item) => [
        item.name,
        {
          $type: 'dimension',
          $description:
            item.source === 'css'
              ? `Custom Debut breakpoint. ${item.px}px at a 16px root.`
              : `Tailwind default. ${item.px}px at a 16px root.`,
          $value: { value: item.rem, unit: 'rem' },
          $extensions: { 'com.debut': { px: item.px } },
        },
      ]),
    ),
    opacity: {
      grain: {
        $description: 'Film grain. The stage is heavier than the matinee. :root carries the matinee value; .dark carries the stage.',
        stage: { $type: 'number', $value: ds.grain.stage },
        matinee: { $type: 'number', $value: ds.grain.matinee },
      },
    },
  }

  return `${JSON.stringify(doc, null, 2)}\n`
}

function renderStyleGuide(ds: DesignSystem): string {
  const colorRows = ds.colors.map((color) => [
    `\`--${color.name}\``,
    color.role,
    color.pair ? `\`--${color.pair}\`` : '—',
    `\`${color.stage}\`<br>\`${hexOf(color.stage)}\``,
    `\`${color.matinee}\`<br>\`${hexOf(color.matinee)}\``,
  ])
  const typeRows = ds.typography.map((token) => [
    `\`text-${token.name}\``,
    token.description,
    `${token.fontSize}rem`,
    String(token.lineHeight),
    token.letterSpacing === 0 ? '0' : `${token.letterSpacing}em`,
    token.family === 'serif' ? 'Bodoni Moda' : 'DM Sans',
  ])
  const spaceRows = spacingSteps.map((step) => [`\`${step}\``, `${step * 4}px`, `${round5(step * 0.25)}rem`])

  return finish([
    `# ${DESIGN_SYSTEM_NAME}`,
    '',
    `Version ${DESIGN_SYSTEM_VERSION}. Tokens and ornaments for a dark stage and an ivory matinee playbill.`,
    '',
    'The product defaults to the stage by setting `class="dark"` on `<html>`. In the stylesheet, `:root` is the matinee and `.dark` replaces it.',
    '',
    '## Install',
    '',
    'Three files, one system. Pick the one that matches the project.',
    '',
    '- `debut-tokens.css` — CSS variables, motion, and ornaments. No Tailwind required.',
    '- `debut-theme.css` — a Tailwind v4 global stylesheet.',
    '- `debut.tokens.json` — [W3C Design Tokens](https://www.designtokens.org/tr/2025.10/format/), 2025.10. Semantic colors alias the stage.',
    '',
    '### CSS',
    '',
    fence(
      'html',
      `<link rel="stylesheet" href="debut-tokens.css">
<html class="dark">
  <body class="debut-grain">`,
    ),
    '',
    '`debut-grain` is optional film grain. The file already sets the page background, text color, font, focus ring, and selection.',
    '',
    '### Tailwind v4',
    '',
    'Use `debut-theme.css` as the global stylesheet. It imports Tailwind and the same fonts. If Tailwind is already imported, delete the two `@import` lines at the top and paste the rest below the existing imports. Put `class="dark"` on `<html>`. Grain is part of the base layer, on `body::before`.',
    '',
    '### JSON',
    '',
    'Tools that read DTCG can take `debut.tokens.json`. `{color.background}` resolves to the stage. The matinee palette is `color.matinee`. Shadow `css` extensions are the theme-aware source; the structured layers are each mode resolved.',
    '',
    '## Color',
    '',
    'Colours are HSL. Text and background pairs are tuned for WCAG AA. Gold has its own text-safe token so brass stays legible on ivory. Spotlight is for glows, not for type.',
    '',
    table(['Token', 'Role', 'Pair', 'Stage', 'Matinee'], colorRows),
    '',
    `Film grain opacity is ${ds.grain.stage} on stage and ${ds.grain.matinee} on the matinee (\`--grain-opacity\`).`,
    '',
    '## Typography',
    '',
    ds.fonts.map((font) => `- **${font.id}** — ${font.description} \`${font.families.join(', ')}\``).join('\n'),
    '',
    'Display, heading, and title use Bodoni Moda at medium (500). Body and captions use DM Sans at regular (400). The eyebrow is DM Sans semibold (600), uppercase, via `font-playbill`.',
    '',
    table(['Token', 'Use', 'Size', 'Line', 'Tracking', 'Face'], typeRows),
    '',
    '## Spacing',
    '',
    'A 4px grid. Tailwind’s default `--spacing` is `0.25rem`.',
    '',
    table(['Step', 'Pixels', 'Rem'], spaceRows),
    '',
    '## Radius',
    '',
    `Base \`--radius\` is \`${ds.radiusBase.css}\`. The scale multiplies it. Chips and the marquee use a pill (\`rounded-full\`).`,
    '',
    table(
      ['Token', 'Value', 'CSS'],
      [
        ['`--radius`', `${ds.radiusBase.rem}rem`, `\`${ds.radiusBase.css}\``],
        ...ds.radii.map((item) => [`\`--radius-${item.name}\``, `${item.rem}rem`, `\`${item.css}\``]),
      ],
    ),
    '',
    '## Shadow',
    '',
    'Glows stand in for grey drop shadows. The CSS follows the active mode.',
    '',
    ...ds.shadows.flatMap((shadow) => [
      `### \`--shadow-${shadow.name}\``,
      '',
      shadow.description,
      '',
      fence('css', `--shadow-${shadow.name}: ${shadow.css};`),
      '',
    ]),
    '## Motion',
    '',
    'Every cue has a duration. `prefers-reduced-motion: reduce` collapses animation and transition to an instant change.',
    '',
    table(
      ['Token', 'Value', 'Use'],
      ds.durations.map((item) => [`\`--dur-${item.name}\``, item.css, item.description]),
    ),
    '',
    table(
      ['Token', 'Curve', 'Use'],
      ds.easings.map((item) => [`\`--ease-${item.name}\``, `\`${item.css}\``, item.description]),
    ),
    '',
    'Named animation utilities: ' + ds.animations.map((item) => `\`animate-${item.name}\``).join(', ') + '.',
    '',
    '## Z-index',
    '',
    table(
      ['Token', 'Value'],
      ds.zIndex.map((item) => [`\`--z-${item.name}\``, String(item.value)]),
    ),
    '',
    '## Breakpoints',
    '',
    table(
      ['Name', 'Rem', 'Pixels'],
      ds.breakpoints.map((item) => [
        `\`${item.name}\``,
        `${item.rem}rem`,
        `${item.px}px${item.source === 'css' ? ' · custom' : ''}`,
      ]),
    ),
    '',
    '## Ornaments',
    '',
    'CSS utilities, with no images: ' + ds.utilities.map((item) => `\`${item.name}\``).join(', ') + '.',
    '',
    'Selection is gold at 45% over the text color. Focus is a 2px ring in `--ring`, 2px outside the element.',
    '',
  ])
}

function renderReadme(): string {
  return finish([
    `# ${DESIGN_SYSTEM_NAME} design system`,
    '',
    `Version ${DESIGN_SYSTEM_VERSION}. Theatrical tokens for a dark **stage** and an ivory **matinee**.`,
    '',
    'Put `class="dark"` on `<html>` for the stage. In the CSS file, `:root` is the matinee and `.dark` replaces it.',
    '',
    '| File | What it is |',
    '| --- | --- |',
    '| `debut-tokens.css` | CSS custom properties, motion, and ornaments |',
    '| `debut-theme.css` | Tailwind v4 global stylesheet |',
    '| `debut.tokens.json` | W3C design tokens, 2025.10 |',
    '| `DEBUT.md` | Style guide |',
    '',
    'Semantic JSON colors such as `{color.background}` alias the stage. Matinee values live under `color.matinee`.',
    '',
    `Fonts: [Bodoni Moda and DM Sans](${FONT_STYLESHEET}).`,
    '',
  ])
}

function colorModes(ds: DesignSystem): string {
  return [
    rule(':root,\n.light', ['color-scheme: light;', ...declarations(ds.lightDecls)]),
    rule('.dark', ['color-scheme: dark;', ...declarations(ds.darkDecls)]),
  ].join('\n\n')
}

function fontDefinitions(ds: DesignSystem): string[] {
  return ds.fonts.map((font) => `--${font.cssVariable}: ${font.families.map(formatFamily).join(', ')};`)
}

function renderKeyframes(ds: DesignSystem): string {
  return ds.keyframes.map((frame) => `@keyframes ${frame.name} {${frame.body}}`).join('\n\n')
}

function emitTheme(selector: string, decls: CssDecl[]): string {
  return rule(selector, declarations(decls))
}

function declarations(decls: CssDecl[]): string[] {
  return decls.map((decl) => `--${decl.name}: ${decl.value};`)
}

function rule(selector: string, lines: string[]): string {
  return `${selector} {\n${lines.map((line) => `  ${line}`).join('\n')}\n}`
}

function finish(parts: string[]): string {
  return `${parts.filter((part) => part !== '').join('\n\n')}\n`
}

function colorToken(cssValue: string, description: string, alpha?: number) {
  const hsl = parseHsl(cssValue)
  const value: Record<string, unknown> = {
    colorSpace: 'hsl',
    components: [hsl.h, hsl.s, hsl.l],
    hex: hslToHex(hsl),
  }
  if (alpha !== undefined && alpha < 1) value.alpha = round5(alpha)
  return { $type: 'color', $description: description, $value: value }
}

function hexOf(cssValue: string): string {
  return hslToHex(parseHsl(cssValue))
}

function shadowLayer(ds: DesignSystem, shadow: ShadowToken, layer: ShadowLayer, mode: 'stage' | 'matinee') {
  const color = ds.colors.find((item) => item.name === layer.token)
  if (!color) throw new Error(`Shadow ${shadow.name} references unknown color --${layer.token}`)
  const value: Record<string, unknown> = {
    color: colorToken(mode === 'stage' ? color.stage : color.matinee, layer.token, layer.alpha).$value,
    offsetX: layer.offsetX,
    offsetY: layer.offsetY,
    blur: layer.blur,
    spread: layer.spread,
  }
  if (layer.inset) value.inset = true
  return value
}

function typographyToken(token: TypeToken) {
  const value = {
    $type: 'typography',
    $description: token.description,
    $value: {
      fontFamily: `{font.${token.family}}`,
      fontSize: { value: token.fontSize, unit: 'rem' },
      fontWeight: `{font.weight.${token.weight}}`,
      letterSpacing: { value: token.letterSpacing, unit: 'em' },
      lineHeight: token.lineHeight,
    },
    $extensions: undefined as Record<string, unknown> | undefined,
  }
  if (token.transform) {
    value.$extensions = { 'com.debut': { textTransform: token.transform, utility: token.utility } }
  }
  return value
}

function parseTypography(decls: CssDecl[]): TypeToken[] {
  const parts = new Map<string, { fontSize?: string; lineHeight?: string; letterSpacing?: string }>()
  const order: string[] = []
  for (const decl of decls) {
    if (!decl.name.startsWith('text-')) continue
    const raw = decl.name.slice('text-'.length)
    const splitAt = raw.indexOf('--')
    const name = splitAt === -1 ? raw : raw.slice(0, splitAt)
    const sub = splitAt === -1 ? '' : raw.slice(splitAt + 2)
    if (!parts.has(name)) {
      parts.set(name, {})
      order.push(name)
    }
    const entry = parts.get(name)!
    if (!sub) entry.fontSize = decl.value
    else if (sub === 'line-height') entry.lineHeight = decl.value
    else if (sub === 'letter-spacing') entry.letterSpacing = decl.value
    else throw new Error(`Unknown text companion --${decl.name}`)
  }

  return order.map((name) => {
    const entry = parts.get(name)!
    const description = typeMeta[name]
    if (!description) throw new Error(`No description for type token text-${name}`)
    if (!entry.fontSize) throw new Error(`Missing font size for text-${name}`)
    if (!entry.lineHeight) throw new Error(`Missing line height for text-${name}`)
    const face = typeface(name)
    return {
      name,
      description,
      family: face.family,
      weight: face.weight,
      fontSize: parseRem(entry.fontSize),
      lineHeight: parseUnitless(entry.lineHeight),
      letterSpacing: entry.letterSpacing ? parseEm(entry.letterSpacing) : 0,
      transform: face.transform,
      utility: face.utility,
    }
  })
}

function typeface(name: string): Pick<TypeToken, 'family' | 'weight' | 'transform' | 'utility'> {
  if (name === 'eyebrow') return { family: 'sans', weight: 'semibold', transform: 'uppercase', utility: 'font-playbill' }
  if (name.startsWith('display') || name === 'heading' || name === 'title') return { family: 'serif', weight: 'medium' }
  return { family: 'sans', weight: 'regular' }
}

function parseShadow(value: string): ShadowLayer[] {
  return splitTopLevelCommas(value).map((part) => {
    const match = part.match(/^(inset\s+)?((?:-?(?:\d+\.?\d*|\.\d+)(?:px|rem)?\s+){2,4})(.+)$/)
    if (!match) throw new Error(`Unsupported shadow layer: ${part}`)
    const lengths = match[2]!.trim().split(/\s+/)
    const [offsetX, offsetY, blur = '0', spread = '0'] = lengths
    const color = parseShadowColor(match[3]!.trim())
    return {
      inset: Boolean(match[1]),
      offsetX: parseLength(offsetX!),
      offsetY: parseLength(offsetY!),
      blur: parseLength(blur),
      spread: parseLength(spread),
      token: color.token,
      alpha: color.alpha,
    }
  })
}

function parseShadowColor(raw: string): { token: string; alpha: number } {
  const mix = raw.match(/^color-mix\(in oklab, var\(--([\w-]+)\) (\d+(?:\.\d+)?)%, transparent\)$/)
  if (mix) return { token: mix[1]!, alpha: Number(mix[2]) / 100 }
  const ref = raw.match(/^var\(--([\w-]+)\)$/)
  if (ref) return { token: ref[1]!, alpha: 1 }
  throw new Error(`Unsupported shadow color: ${raw}`)
}

function parseFontStack(value: string): { cssVariable: string; families: string[] } {
  const parts = splitTopLevelCommas(value)
  const variable = parts[0]?.match(/^var\(--([\w-]+)\)$/)
  if (!variable) throw new Error(`Font stack must start with a var(): ${value}`)
  return {
    cssVariable: variable[1]!,
    families: parts.slice(1).map((part) => {
      const quoted = part.match(/^['"](.+)['"]$/)
      return quoted ? quoted[1]! : part
    }),
  }
}

function parseLength(raw: string): Dimension {
  if (raw === '0') return { value: 0, unit: 'px' }
  const match = raw.match(/^(-?(?:\d+\.?\d*|\.\d+))(px|rem|em)$/)
  if (!match) throw new Error(`Bad length: ${raw}`)
  return { value: round5(Number(match[1])), unit: match[2] as Dimension['unit'] }
}

function parseDuration(value: string): { value: number; unit: 'ms' | 's' } {
  const match = value.match(/^(-?(?:\d+\.?\d*|\.\d+))(ms|s)$/)
  if (!match) throw new Error(`Bad duration: ${value}`)
  return { value: round5(Number(match[1])), unit: match[2] as 'ms' | 's' }
}

function parseBezier(value: string): number[] {
  const match = value.match(
    /^cubic-bezier\(\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\)$/,
  )
  if (!match) throw new Error(`Bad easing: ${value}`)
  const points = match.slice(1).map((item) => round5(Number(item)))
  if (points[0]! < 0 || points[0]! > 1 || points[2]! < 0 || points[2]! > 1) {
    throw new Error(`Cubic bezier x coordinates must be between 0 and 1: ${value}`)
  }
  return points
}

function parseRem(value: string): number {
  const match = value.match(/^(-?(?:\d+\.?\d*|\.\d+))rem$/)
  if (!match) throw new Error(`Expected rem: ${value}`)
  return round5(Number(match[1]))
}

function parseEm(value: string): number {
  const match = value.match(/^(-?(?:\d+\.?\d*|\.\d+))em$/)
  if (!match) throw new Error(`Expected em: ${value}`)
  return round5(Number(match[1]))
}

function parseUnitless(value: string): number {
  if (!/^-?(?:\d+\.?\d*|\.\d+)$/.test(value)) throw new Error(`Expected a unitless number: ${value}`)
  return round5(Number(value))
}

function parseNumber(value: string): number {
  return parseUnitless(value)
}

function parseInteger(value: string): number {
  if (!/^-?\d+$/.test(value)) throw new Error(`Expected an integer: ${value}`)
  return Number(value)
}

function resolveRadius(css: string, baseRem: number): number {
  if (css === 'var(--radius)') return baseRem
  const match = css.match(/^calc\(var\(--radius\) \* (-?(?:\d+\.?\d*|\.\d+))\)$/)
  if (!match) throw new Error(`Bad radius: ${css}`)
  return round5(baseRem * Number(match[1]))
}

function splitTopLevelCommas(value: string): string[] {
  const parts: string[] = []
  let depth = 0
  let current = ''
  for (const ch of value) {
    if (ch === '(') depth++
    if (ch === ')') depth--
    if (ch === ',' && depth === 0) {
      parts.push(current.trim())
      current = ''
      continue
    }
    current += ch
  }
  if (current.trim()) parts.push(current.trim())
  return parts
}

function formatFamily(name: string): string {
  return /^[a-zA-Z-]+$/.test(name) ? name : `"${name}"`
}

function requireBlock(blocks: CssBlock[], selector: string): CssBlock {
  const block = blocks.find((item) => item.selector === selector)
  if (!block) throw new Error(`Missing CSS block: ${selector}`)
  return block
}

function requireDecl(decls: CssDecl[], name: string): CssDecl {
  const decl = decls.find((item) => item.name === name)
  if (!decl) throw new Error(`Missing declaration --${name}`)
  return decl
}

function round5(n: number): number {
  return Math.round(n * 100000) / 100000
}

function table(headers: string[], rows: string[][]): string {
  const head = `| ${headers.join(' | ')} |`
  const ruleLine = `| ${headers.map(() => '---').join(' | ')} |`
  const body = rows
    .map((row) => `| ${row.map((value) => value.replace(/\|/g, '\\|').replace(/\n/g, ' ')).join(' | ')} |`)
    .join('\n')
  return `${head}\n${ruleLine}\n${body}`
}

function fence(lang: string, code: string): string {
  return `\`\`\`${lang}\n${code.trim()}\n\`\`\``
}
