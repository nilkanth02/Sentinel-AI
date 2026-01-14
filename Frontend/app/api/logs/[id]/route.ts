import { NextResponse } from 'next/server'

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || process.env.API_BASE_URL || 'http://localhost:8000'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params

  try {
    const directUrl = new URL(`/api/logs/${id}`, BACKEND_BASE_URL)
    const directResponse = await fetch(directUrl.toString(), { cache: 'no-store' })

    if (directResponse.ok) {
      const directText = await directResponse.text()
      try {
        const json = directText ? JSON.parse(directText) : null
        return NextResponse.json(json, { status: directResponse.status })
      } catch {
        return NextResponse.json({ message: directText }, { status: directResponse.status })
      }
    }

    const listUrl = new URL('/api/logs', BACKEND_BASE_URL)
    listUrl.searchParams.set('limit', '200')

    const listResponse = await fetch(listUrl.toString(), { cache: 'no-store' })
    if (!listResponse.ok) {
      const msg = await listResponse.text()
      return NextResponse.json(
        { message: msg || `Backend error: ${listResponse.status}` },
        { status: listResponse.status }
      )
    }

    const logs = (await listResponse.json()) as any[]
    const found = Array.isArray(logs)
      ? logs.find((log) => String(log?.id) === String(id))
      : null

    if (!found) {
      return NextResponse.json({ message: 'Risk log not found' }, { status: 404 })
    }

    return NextResponse.json(found, { status: 200 })
  } catch {
    return NextResponse.json(
      { message: 'Network error: Unable to connect to backend' },
      { status: 502 }
    )
  }
}
