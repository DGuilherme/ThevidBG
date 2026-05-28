import { NextRequest, NextResponse } from 'next/server'
import { searchUsers } from '@/lib/db/queries/users'
import { getSession } from '@/lib/session'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session.userId) return NextResponse.json([], { status: 401 })

  const q = req.nextUrl.searchParams.get('q') ?? ''
  if (q.length < 2) return NextResponse.json([])

  const results = await searchUsers(q, session.userId)
  return NextResponse.json(results)
}
