import { NextResponse } from 'next/server'

const rateLimitMap = new Map<string, number>()

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const now = Date.now()
  const lastCall = rateLimitMap.get(ip) || 0

  if (now - lastCall < 3000) {
    return NextResponse.json({ error: 'Too many requests. Please wait 3 seconds.' }, { status: 429 })
  }

  rateLimitMap.set(ip, now)

  return NextResponse.json({ message: 'hello' })
}
