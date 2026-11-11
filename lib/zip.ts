const CRC_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c >>> 0
  }
  return table
})()

/** ZIP stores a DOS date. Fixed so the same files always produce the same bytes. */
const ZIP_DATE = ((2026 - 1980) << 9) | (11 << 5) | 11

export function crc32(data: Uint8Array): number {
  let crc = 0xffffffff
  for (let i = 0; i < data.length; i++) crc = CRC_TABLE[(crc ^ data[i]!) & 0xff]! ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

export type ZipEntry = {
  path: string
  data: string | Uint8Array
}

const textEncoder = new TextEncoder()

/**
 * Build an uncompressed (STORE) zip. Enough for text design-system files,
 * and it round-trips through standard unzip tools.
 */
export function createZip(files: ZipEntry[]): Uint8Array {
  const encoded = files.map((file) => {
    if (!file.path || file.path.startsWith('/') || file.path.includes('\\') || file.path.split('/').includes('..')) {
      throw new Error(`Unsafe zip path: ${file.path}`)
    }
    return {
      name: textEncoder.encode(file.path),
      data: typeof file.data === 'string' ? textEncoder.encode(file.data) : file.data,
    }
  })

  const localParts: Uint8Array[] = []
  const centralParts: Uint8Array[] = []
  let offset = 0

  for (const file of encoded) {
    const crc = crc32(file.data)
    const local = new Uint8Array(30 + file.name.length)
    const view = new DataView(local.buffer)
    view.setUint32(0, 0x04034b50, true)
    view.setUint16(4, 20, true)
    view.setUint16(6, 0x0800, true)
    view.setUint16(8, 0, true)
    view.setUint16(10, 0, true)
    view.setUint16(12, ZIP_DATE, true)
    view.setUint32(14, crc, true)
    view.setUint32(18, file.data.length, true)
    view.setUint32(22, file.data.length, true)
    view.setUint16(26, file.name.length, true)
    view.setUint16(28, 0, true)
    local.set(file.name, 30)
    localParts.push(local, file.data)

    const central = new Uint8Array(46 + file.name.length)
    const centralView = new DataView(central.buffer)
    centralView.setUint32(0, 0x02014b50, true)
    centralView.setUint16(4, 20, true)
    centralView.setUint16(6, 20, true)
    centralView.setUint16(8, 0x0800, true)
    centralView.setUint16(10, 0, true)
    centralView.setUint16(12, 0, true)
    centralView.setUint16(14, ZIP_DATE, true)
    centralView.setUint32(16, crc, true)
    centralView.setUint32(20, file.data.length, true)
    centralView.setUint32(24, file.data.length, true)
    centralView.setUint16(28, file.name.length, true)
    centralView.setUint16(30, 0, true)
    centralView.setUint16(32, 0, true)
    centralView.setUint16(34, 0, true)
    centralView.setUint16(36, 0, true)
    centralView.setUint32(38, 0, true)
    centralView.setUint32(42, offset, true)
    central.set(file.name, 46)
    centralParts.push(central)

    offset += local.length + file.data.length
  }

  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0)
  const eocd = new Uint8Array(22)
  const endView = new DataView(eocd.buffer)
  endView.setUint32(0, 0x06054b50, true)
  endView.setUint16(4, 0, true)
  endView.setUint16(6, 0, true)
  endView.setUint16(8, files.length, true)
  endView.setUint16(10, files.length, true)
  endView.setUint32(12, centralSize, true)
  endView.setUint32(16, offset, true)
  endView.setUint16(20, 0, true)

  const out = new Uint8Array(offset + centralSize + eocd.length)
  let cursor = 0
  for (const part of [...localParts, ...centralParts, eocd]) {
    out.set(part, cursor)
    cursor += part.length
  }
  return out
}

export function readZip(buf: Uint8Array): { path: string; data: Uint8Array }[] {
  const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength)
  const files: { path: string; data: Uint8Array }[] = []
  let offset = 0

  while (offset + 30 <= buf.length && view.getUint32(offset, true) === 0x04034b50) {
    const method = view.getUint16(offset + 8, true)
    const size = view.getUint32(offset + 18, true)
    const nameLength = view.getUint16(offset + 26, true)
    const extraLength = view.getUint16(offset + 28, true)
    const nameStart = offset + 30
    const path = new TextDecoder().decode(buf.subarray(nameStart, nameStart + nameLength))
    const dataStart = nameStart + nameLength + extraLength
    if (method !== 0) throw new Error(`Unsupported zip method ${method} for ${path}`)
    files.push({ path, data: buf.slice(dataStart, dataStart + size) })
    offset = dataStart + size
  }

  return files
}
