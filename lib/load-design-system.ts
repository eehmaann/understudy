import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { designSystemFiles, designSystemZip, parseDesignSystem, type DesignSystemFile } from './design-system'

/** Server-only. Reads the stylesheet that is the source of the export. */
export function readGlobalsCss(): string {
  return readFileSync(join(process.cwd(), 'app/globals.css'), 'utf8')
}

export function getDesignSystemFiles(): DesignSystemFile[] {
  return designSystemFiles(parseDesignSystem(readGlobalsCss()))
}

export function getDesignSystemZip(): Uint8Array {
  return designSystemZip(parseDesignSystem(readGlobalsCss()))
}
