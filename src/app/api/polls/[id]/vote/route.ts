import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getClientIP } from '@/lib/utils/ip'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createSupabaseServerClient()
    const { id: pollId } = await params

    // Parse request body
    const { optionId } = await request.json()

    if (!optionId) {
      return NextResponse.json(
        { error: 'Option ID is required' },
        { status: 400 }
      )
    }

    // Get client IP and user agent
    const voterIp = getClientIP(request)
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Cast vote using database function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: voteId, error } = await (supabase.rpc('cast_vote', {
      poll_id: pollId,
      option_id: optionId,
      voter_ip: voterIp,
      user_agent: userAgent
    } as any) as any)

    if (error) {
      console.error('Database error casting vote:', error)

      // Handle specific error cases
      if (error.message.includes('already voted')) {
        return NextResponse.json(
          { error: 'You have already voted on this poll' },
          { status: 409 }
        )
      }

      if (error.message.includes('not active')) {
        return NextResponse.json(
          { error: 'This poll is not currently accepting votes' },
          { status: 400 }
        )
      }

      if (error.message.includes('expired')) {
        return NextResponse.json(
          { error: 'This poll has expired' },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { error: 'Failed to cast vote' },
        { status: 500 }
      )
    }

    return NextResponse.json({ voteId, success: true })
  } catch (error) {
    console.error('API error casting vote:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}