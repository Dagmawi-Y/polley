import { supabase } from './client'
import type { Database, Poll, PollOption, CreatePollData, VoteData } from '../types/database'

// Client-side functions
export async function createPoll(data: CreatePollData): Promise<{ data: string | null; error: string | null }> {
  try {
    const { data: result, error } = await supabase.rpc('create_poll_with_options', {
      poll_title: data.title,
      poll_options: data.options,
      poll_description: data.description || null,
      is_public: data.isPublic,
      allow_multiple: data.allowMultiple,
      require_auth: data.requireAuth,
      expires_at: data.expiresAt?.toISOString() || null
    })

    if (error) {
      console.error('Error creating poll:', error)
      return { data: null, error: error.message }
    }

    return { data: result, error: null }
  } catch (err) {
    console.error('Unexpected error creating poll:', err)
    return { data: null, error: 'An unexpected error occurred' }
  }
}

export async function castVote(data: VoteData): Promise<{ data: string | null; error: string | null }> {
  try {
    const response = await fetch(`/api/polls/${data.pollId}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        optionId: data.optionId
      })
    })

    const result = await response.json()

    if (!response.ok) {
      return { data: null, error: result.error || 'Failed to cast vote' }
    }

    return { data: result.voteId, error: null }
  } catch (err) {
    console.error('Unexpected error casting vote:', err)
    return { data: null, error: 'An unexpected error occurred' }
  }
}

export async function getPollResults(pollId: string): Promise<{ data: Poll | null; error: string | null }> {
  try {
    const { data: results, error } = await supabase.rpc('get_poll_results', {
      poll_id: pollId
    })

    if (error) {
      console.error('Error getting poll results:', error)
      return { data: null, error: error.message }
    }

    if (!results || results.length === 0) {
      return { data: null, error: 'Poll not found' }
    }

    const result = results[0]
    const pollInfo = result.poll_info
    const options = result.options || []

    const poll: Poll = {
      id: pollInfo.id,
      title: pollInfo.title,
      description: pollInfo.description,
      status: pollInfo.status,
      isPublic: pollInfo.is_public,
      allowMultiple: pollInfo.allow_multiple,
      requireAuth: pollInfo.require_auth,
      expiresAt: pollInfo.expires_at ? new Date(pollInfo.expires_at) : undefined,
      createdAt: new Date(pollInfo.created_at),
      updatedAt: new Date(pollInfo.updated_at),
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

    return { data: poll, error: null }
  } catch (err) {
    console.error('Unexpected error getting poll results:', err)
    return { data: null, error: 'An unexpected error occurred' }
  }
}

export async function hasUserVoted(pollId: string): Promise<{ data: boolean; error: string | null }> {
  try {
    const response = await fetch(`/api/polls/${pollId}/voted`)
    
    if (!response.ok) {
      const errorData = await response.json()
      return { data: false, error: errorData.error || 'Failed to check vote status' }
    }
    
    const { hasVoted } = await response.json()
    return { data: hasVoted, error: null }
  } catch (err) {
    console.error('Unexpected error checking vote status:', err)
    return { data: false, error: 'An unexpected error occurred' }
  }
}

export async function getPublicPolls(page = 0, pageSize = 20): Promise<{ data: Poll[] | null; error: string | null }> {
  try {
    const { data: pollStats, error } = await supabase
      .from('poll_stats')
      .select('*')
      .eq('is_public', true)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1)

    if (error) {
      console.error('Error getting public polls:', error)
      return { data: null, error: error.message }
    }

    // Get options for each poll
    const pollsWithOptions = await Promise.all(
      (pollStats || []).map(async (pollStat) => {
        const { data: options, error: optionsError } = await supabase
          .from('option_stats')
          .select('*')
          .eq('poll_id', pollStat.id)
          .order('position')

        if (optionsError) {
          console.error('Error getting poll options:', optionsError)
          return null
        }

        const poll: Poll = {
          id: pollStat.id,
          title: pollStat.title,
          description: pollStat.description,
          status: pollStat.status,
          isPublic: pollStat.is_public,
          allowMultiple: pollStat.allow_multiple,
          requireAuth: pollStat.require_auth,
          expiresAt: pollStat.expires_at ? new Date(pollStat.expires_at) : undefined,
          createdAt: new Date(pollStat.created_at),
          updatedAt: new Date(pollStat.updated_at),
          createdBy: pollStat.created_by,
          options: (options || []).map((opt) => ({
            id: opt.id,
            text: opt.text,
            position: opt.position,
            votes: opt.vote_count,
            percentage: opt.vote_percentage
          })),
          totalVotes: pollStat.total_votes,
          uniqueVoters: pollStat.unique_voters
        }

        return poll
      })
    )

    const validPolls = pollsWithOptions.filter((poll): poll is Poll => poll !== null)
    return { data: validPolls, error: null }
  } catch (err) {
    console.error('Unexpected error getting public polls:', err)
    return { data: null, error: 'An unexpected error occurred' }
  }
}

