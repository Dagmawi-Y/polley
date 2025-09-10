import { createSupabaseServerClient } from './server'
import type { Poll } from '../types/database'

// Server-side functions (for use in server components and API routes)
export async function getUserPolls(userId?: string): Promise<{ data: Poll[] | null; error: string | null }> {
  try {
    const supabaseServer = createSupabaseServerClient()
    
    const { data: pollStats, error } = await supabaseServer
      .from('poll_stats')
      .select('*')
      .eq('created_by', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error getting user polls:', error)
      return { data: null, error: error.message }
    }

    // Get options for each poll
    const pollsWithOptions = await Promise.all(
      (pollStats || []).map(async (pollStat) => {
        const { data: options, error: optionsError } = await supabaseServer
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
    console.error('Unexpected error getting user polls:', err)
    return { data: null, error: 'An unexpected error occurred' }
  }
}

export async function getPublicPollsServer(page = 0, pageSize = 20): Promise<{ data: Poll[] | null; error: string | null }> {
  try {
    const supabaseServer = createSupabaseServerClient()
    
    const { data: pollStats, error } = await supabaseServer
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
        const { data: options, error: optionsError } = await supabaseServer
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