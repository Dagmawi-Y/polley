import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getClientIP } from '@/lib/utils/ip'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseServerClient()
    const pollId = params.id
    const voterIp = getClientIP(request)

    // Check if user has voted using database function
    const { data: hasVoted, error } = await supabase.rpc('has_user_voted', {
      poll_id: pollId,
      user_id: null, // Will be set automatically by the function if user is authenticated
      voter_ip: voterIp
    })

    if (error) {
      console.error('Database error checking vote status:', error)
      return NextResponse.json(
        { error: 'Failed to check vote status' },
        { status: 500 }
      )
    }

    return NextResponse.json({ hasVoted: hasVoted || false })
  } catch (error) {
    console.error('API error checking vote status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}