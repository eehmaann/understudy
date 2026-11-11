export type Hsl = {
  h: number
  s: number
  l: number
}

/** Parse `345 32% 6%` or `hsl(345 32% 6%)`. */
export function parseHsl(input: string): Hsl {
  const match = input
    .trim()
    .match(/^hsl\(\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)%\s+(-?\d+(?:\.\d+)?)%\s*\)$|^(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)%\s+(-?\d+(?:\.\d+)?)%$/)
  if (!match) throw new Error(`Invalid HSL color: ${input}`)
  const h = Number(match[1] ?? match[4])
  const s = Number(match[2] ?? match[5])
  const l = Number(match[3] ?? match[6])
  if (h < 0 || h >= 360) throw new Error(`Hue out of range: ${input}`)
  if (s < 0 || s > 100 || l < 0 || l > 100) throw new Error(`HSL out of range: ${input}`)
  return { h, s, l }
}

/** sRGB hex fallback for an HSL color. Alpha is ignored; hex is always 6 digits. */
export function hslToHex({ h, s, l }: Hsl): string {
  const sat = s / 100
  const lig = l / 100
  const a = sat * Math.min(lig, 1 - lig)
  const channel = (n: number) => {
    const k = (n + h / 30) % 12
    const color = lig - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(color * 255)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${channel(0)}${channel(8)}${channel(4)}`
}
