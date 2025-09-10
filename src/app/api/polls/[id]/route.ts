import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseServerClient()
    const pollId = params.id

    // Get poll results using database function
    const { data: results, error } = await supabase.rpc('get_poll_results', {
      poll_id: pollId
    })

    if (error) {
      console.error('Database error getting poll results:', error)
      return NextResponse.json(
        { error: 'Failed to fetch poll' },
        { status: 500 }
      )
    }

    if (!results || results.length === 0) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      )
    }

    const result = results[0]
    const pollInfo = result.poll_info
    const options = result.options || []

    const poll = {
      id: pollInfo.id,
      title: pollInfo.title,
      description: pollInfo.description,
      status: pollInfo.status,
      isPublic: pollInfo.is_public,
      allowMultiple: pollInfo.allow_multiple,
      requireAuth: pollInfo.require_auth,
      expiresAt: pollInfo.expires_at,
      createdAt: pollInfo.created_at,
      updatedAt: pollInfo.updated_at,
      createdBy: pollInfo.created_by,
      options: options.map((opt: any) => ({
        id: opt.id,
        text: opt.text,
        position: opt.position,
        votes: opt.vote_count,
        percentage: opt.vote_percentage
      })),
      totalVotes: result.total_votes,
      uniqueVoters: result.unique_voters
    }

    return NextResponse.json({ poll })
  } catch (error) {
    console.error('API error getting poll:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}