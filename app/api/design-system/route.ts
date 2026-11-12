import { NextRequest, NextResponse } from 'next/server'
import { exportIndex, kitFile, type DesignSystemFileId } from '@/lib/design-system'
import { getDesignSystemFiles, getDesignSystemZip } from '@/lib/load-design-system'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const textFormats = new Set<DesignSystemFileId>(['css', 'tailwind', 'json', 'markdown'])

export function GET(request: NextRequest) {
  const format = request.nextUrl.searchParams.get('format')
  if (!format) return NextResponse.json(exportIndex())

  if (format === 'zip') {
    return new NextResponse(Buffer.from(getDesignSystemZip()), {
      headers: downloadHeaders(kitFile.mime, kitFile.filename),
    })
  }

  if (!textFormats.has(format as DesignSystemFileId)) {
    return NextResponse.json(
      { error: 'Unknown format. Use css, tailwind, json, markdown, or zip.' },
      { status: 400 },
    )
  }

  const file = getDesignSystemFiles().find((item) => item.id === format)
  if (!file) {
    return NextResponse.json({ error: 'Export failed to build.' }, { status: 500 })
  }

  return new NextResponse(file.contents, {
    headers: downloadHeaders(file.mime, file.filename),
  })
}

function downloadHeaders(mime: string, filename: string): HeadersInit {
  return {
    'Content-Type': mime,
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  }
}
