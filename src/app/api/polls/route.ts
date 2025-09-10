import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getPublicPollsServer } from '@/lib/supabase/polls-server'
import type { CreatePollData } from '@/lib/types/database'

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse request body
    const body: CreatePollData = await request.json()

    // Validate required fields
    if (!body.title || !body.options || body.options.length < 2) {
      return NextResponse.json(
        { error: 'Title and at least 2 options are required' },
        { status: 400 }
      )
    }

    if (body.options.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 options allowed' },
        { status: 400 }
      )
    }

    // Create poll using database function
    const { data: pollId, error } = await supabase.rpc('create_poll_with_options', {
      poll_title: body.title,
      poll_options: body.options,
      poll_description: body.description || null,
      is_public: body.isPublic ?? true,
      allow_multiple: body.allowMultiple ?? false,
      require_auth: body.requireAuth ?? false,
      expires_at: body.expiresAt?.toISOString() || null
    })

    if (error) {
      console.error('Database error creating poll:', error)
      return NextResponse.json(
        { error: 'Failed to create poll' },
        { status: 500 }
      )
    }

    return NextResponse.json({ pollId })
  } catch (error) {
    console.error('API error creating poll:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '0')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')

    // Get public polls using server function
    const { data: polls, error } = await getPublicPollsServer(page, pageSize)

    if (error) {
      console.error('Error getting polls:', error)
      return NextResponse.json(
        { error: 'Failed to fetch polls' },
        { status: 500 }
      )
    }

    return NextResponse.json({ polls: polls || [] })
  } catch (error) {
    console.error('API error getting polls:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}