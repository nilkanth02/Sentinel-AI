import { NextResponse } from 'next/server'

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || process.env.API_BASE_URL || 'http://localhost:8000'

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/baselines/${id}`, { cache: 'no-store' })
    const text = await response.text()
    try {
      const json = text ? JSON.parse(text) : null
      return NextResponse.json(json, { status: response.status })
    } catch {
      return NextResponse.json({ message: text }, { status: response.status })
    }
  } catch {
    return NextResponse.json(
      { message: 'Network error: Unable to connect to backend' },
      { status: 502 }
    )
  }
}

export async function PATCH(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  try {
    const body = await _request.json()
    const response = await fetch(`${BACKEND_BASE_URL}/api/baselines/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const text = await response.text()
    try {
      const json = text ? JSON.parse(text) : null
      return NextResponse.json(json, { status: response.status })
    } catch {
      return NextResponse.json({ message: text }, { status: response.status })
    }
  } catch {
    return NextResponse.json(
      { message: 'Network error: Unable to connect to backend' },
      { status: 502 }
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/baselines/${id}`, {
      method: 'DELETE',
    })
    const text = await response.text()
    try {
      const json = text ? JSON.parse(text) : null
      return NextResponse.json(json, { status: response.status })
    } catch {
      return NextResponse.json({ message: text }, { status: response.status })
    }
  } catch {
    return NextResponse.json(
      { message: 'Network error: Unable to connect to backend' },
      { status: 502 }
    )
  }
}
