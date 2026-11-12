export type CssBlock = {
  selector: string
  body: string
}

export type CssDecl = {
  name: string
  value: string
}

/** Drop comments so brace matching is not confused by braces inside them. */
export function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, '')
}

/**
 * Split a stylesheet into top-level blocks. Nested rules stay inside the
 * body of the block that contains them.
 */
export function parseTopLevelBlocks(css: string): CssBlock[] {
  const clean = stripComments(css)
  const blocks: CssBlock[] = []
  let depth = 0
  let preludeStart = 0
  let bodyStart = -1

  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i]
    if (ch === '{') {
      if (depth === 0) bodyStart = i + 1
      depth++
    } else if (ch === '}') {
      depth--
      if (depth < 0) throw new Error('Unbalanced CSS braces')
      if (depth === 0 && bodyStart >= 0) {
        const selector = selectorFromPrelude(clean.slice(preludeStart, bodyStart - 1))
        const body = clean.slice(bodyStart, i)
        if (selector) blocks.push({ selector, body })
        preludeStart = i + 1
        bodyStart = -1
      }
    }
  }

  if (depth !== 0) throw new Error('Unclosed CSS block')
  return blocks
}

export function parseDeclarations(block: string): CssDecl[] {
  const decls: CssDecl[] = []
  const re = /--([\w-]+)\s*:\s*([^;]+);/g
  for (const match of block.matchAll(re)) {
    decls.push({
      name: match[1],
      value: match[2].replace(/\s+/g, ' ').trim(),
    })
  }
  return decls
}

function selectorFromPrelude(prelude: string): string {
  const lines = prelude.split('\n').filter((line) => {
    const trimmed = line.trim()
    if (!trimmed) return false
    if (trimmed.startsWith('@import ')) return false
    if (trimmed.startsWith('@custom-variant ')) return false
    return true
  })
  return lines.join(' ').replace(/\s+/g, ' ').trim()
}
