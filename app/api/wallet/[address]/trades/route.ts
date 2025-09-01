import { NextRequest, NextResponse } from 'next/server'

const BASE_URL = "https://data.solanatracker.io"
const API_KEY = process.env.SOLANA_TRACKER_API_KEY

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params
  const { searchParams } = new URL(request.url)
  const cursor = searchParams.get('cursor')

  if (!address) {
    return NextResponse.json({}, { status: 400 })
  }

  if (!API_KEY) {
    return NextResponse.json({}, { status: 500 })
  }

  try {
    const url = new URL(`${BASE_URL}/wallet/${address}/trades`)
    if (cursor) {
      url.searchParams.append('cursor', cursor)
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'SolanaTracker-NextJS-App',
        'x-api-key': API_KEY,
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({}, { status: 401 })
      } else if (response.status === 404) {
        return NextResponse.json({}, { status: 404 })
      } else if (response.status === 429) {
        return NextResponse.json({}, { status: 429 })
      } else if (response.status >= 500) {
        return NextResponse.json({}, { status: 502 })
      }
      return NextResponse.json({}, { status: response.status })
    }

    const data = await response.json()

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate=120',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch {
    return NextResponse.json({}, { status: 500 })
  }
}


export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
