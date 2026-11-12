import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { hslToHex, parseHsl } from './color'
import { parseTopLevelBlocks, stripComments } from './css-parse'
import { colorMeta, durationMeta, KIT_FILENAME } from './debut-meta'
import { designSystemFiles, designSystemZip, kitFile, parseDesignSystem } from './design-system'
import { readZip } from './zip'

const css = readFileSync('app/globals.css', 'utf8')
const system = parseDesignSystem(css)
const files = designSystemFiles(system)
const file = (id: 'css' | 'tailwind' | 'json' | 'markdown') => files.find((item) => item.id === id)!

test('finds every top-level block in the stylesheet', () => {
  assert.deepEqual(
    parseTopLevelBlocks(css).map((block) => block.selector),
    [
      ':root, .light',
      '.dark',
      ':root',
      '@theme inline',
      '@theme',
      '@keyframes curtain-left',
      '@keyframes curtain-right',
      '@keyframes spotlight-in',
      '@keyframes bulb-shimmer',
      '@keyframes bulb-pulse',
      '@keyframes gold-shimmer',
      '@keyframes rise',
      '@utility font-playbill',
      '@utility rule-double',
      '@utility spotlight',
      '@utility spotlight-center',
      '@utility velvet',
      '@utility bulb-dots',
      '@utility shine',
      '@layer base',
      '@media (prefers-reduced-motion: reduce)',
    ],
  )
})

test('converts known HSL colors to hex', () => {
  assert.equal(hslToHex(parseHsl('hsl(0 0% 0%)')), '#000000')
  assert.equal(hslToHex(parseHsl('hsl(0 0% 100%)')), '#ffffff')
  assert.equal(hslToHex(parseHsl('hsl(0 100% 50%)')), '#ff0000')
  assert.equal(hslToHex(parseHsl('hsl(120 100% 50%)')), '#00ff00')
  assert.equal(hslToHex(parseHsl('hsl(240 100% 50%)')), '#0000ff')
  assert.equal(hslToHex(parseHsl('hsl(345 32% 6%)')), '#140a0d')
})

test('describes every color and duration from the stylesheet', () => {
  assert.deepEqual(
    system.colors.map((color) => color.name).sort(),
    Object.keys(colorMeta).sort(),
  )
  assert.deepEqual(
    system.durations.map((item) => item.name).sort(),
    Object.keys(durationMeta).sort(),
  )
  assert.equal(system.colors.find((color) => color.name === 'background')?.stage, 'hsl(345 32% 6%)')
  assert.equal(system.grain.stage, 0.06)
  assert.equal(system.grain.matinee, 0.035)
})

test('keeps every custom property in the Tailwind export', () => {
  const tailwind = file('tailwind').contents
  const names = new Set([...stripComments(css).matchAll(/--([\w-]+)\s*:/g)].map((match) => match[1]))
  for (const name of names) {
    assert.ok(tailwind.includes(`--${name}:`), `missing --${name}`)
  }
  assert.ok(tailwind.includes('@import "tailwindcss";'))
  assert.ok(tailwind.includes('@custom-variant dark (&:is(.dark *));'))
  assert.ok(tailwind.includes('@layer base'))
})

test('CSS export carries both modes, motion, and ornaments', () => {
  const tokens = file('css').contents
  for (const decl of [...system.lightDecls, ...system.darkDecls, ...system.sharedDecls]) {
    assert.ok(tokens.includes(`--${decl.name}: ${decl.value};`), `missing --${decl.name}`)
  }
  assert.ok(tokens.includes('.font-playbill'))
  assert.ok(tokens.includes('@keyframes curtain-left'))
  assert.ok(tokens.includes('.debut-grain::before'))
  assert.ok(tokens.includes('feTurbulence'))
  assert.ok(tokens.includes('prefers-reduced-motion'))
})

test('JSON tokens follow the design tokens format', () => {
  const json = JSON.parse(file('json').contents) as {
    color: {
      background: { $value: string }
      stage: { background: { $value: { colorSpace: string; components: number[]; hex: string } }; gold: { $value: { components: number[] } } }
      matinee: { background: { $value: { components: number[]; hex: string } } }
    }
    shadow: { stage: { glow: { $value: { color: { alpha?: number; components: number[] }; inset?: boolean }[]; $extensions: { 'com.debut': { css: string } } } } }
    typography: { 'display-2xl': { $value: { fontFamily: string; fontSize: { value: number; unit: string }; fontWeight: string } }; eyebrow: { $extensions?: { 'com.debut': { textTransform: string } } } }
    duration: { instant: { $value: { value: number; unit: string } } }
    breakpoint: { xs: { $value: { value: number; unit: string } } }
  }

  assert.equal(json.color.background.$value, '{color.stage.background}')
  assert.equal(json.color.stage.background.$value.colorSpace, 'hsl')
  assert.deepEqual(json.color.stage.background.$value.components, [345, 32, 6])
  assert.equal(json.color.stage.background.$value.hex, '#140a0d')
  assert.deepEqual(json.color.matinee.background.$value.components, [42, 45, 95])
  assert.equal(json.shadow.stage.glow.$value[0]?.color.alpha, 0.22)
  assert.deepEqual(json.shadow.stage.glow.$value[0]?.color.components, json.color.stage.gold.$value.components)
  assert.match(json.shadow.stage.glow.$extensions['com.debut'].css, /color-mix\(in oklab, var\(--gold\) 22%/)
  assert.equal(json.typography['display-2xl'].$value.fontFamily, '{font.serif}')
  assert.equal(json.typography['display-2xl'].$value.fontSize.value, 4.5)
  assert.equal(json.typography['display-2xl'].$value.fontSize.unit, 'rem')
  assert.equal(json.typography['display-2xl'].$value.fontWeight, '{font.weight.medium}')
  assert.equal(json.typography.eyebrow.$extensions?.['com.debut'].textTransform, 'uppercase')
  assert.deepEqual(json.duration.instant.$value, { value: 100, unit: 'ms' })
  assert.deepEqual(json.breakpoint.xs.$value, { value: 30, unit: 'rem' })
  assert.equal(json.typography.eyebrow.$extensions?.['com.debut'].textTransform, 'uppercase')
})

test('style guide names both modes and the install files', () => {
  const guide = file('markdown').contents
  assert.match(guide, /^# Debut/)
  assert.ok(guide.includes('debut-tokens.css'))
  assert.ok(guide.includes('debut-theme.css'))
  assert.ok(guide.includes('debut.tokens.json'))
  assert.ok(guide.includes('--background'))
  assert.ok(guide.includes('#140a0d'))
  assert.ok(guide.includes('font-playbill'))
})

test('zip contains the kit and is deterministic', () => {
  assert.equal(kitFile.filename, KIT_FILENAME)
  const zip = designSystemZip(system)
  assert.deepEqual(zip, designSystemZip(system))
  const decoder = new TextDecoder()
  const unzipped = readZip(zip)
  assert.deepEqual(
    unzipped.map((entry) => entry.path).sort(),
    ['debut/DEBUT.md', 'debut/README.md', 'debut/debut-theme.css', 'debut/debut-tokens.css', 'debut/debut.tokens.json'],
  )
  const readme = decoder.decode(unzipped.find((entry) => entry.path === 'debut/README.md')!.data)
  assert.match(readme, /Debut design system/)
  const cssEntry = decoder.decode(unzipped.find((entry) => entry.path === 'debut/debut-tokens.css')!.data)
  assert.equal(cssEntry, file('css').contents)
})
