export interface Database {
  public: {
    Tables: {
      polls: {
        Row: {
          id: string
          title: string
          description: string | null
          status: 'draft' | 'active' | 'closed'
          is_public: boolean
          allow_multiple: boolean
          require_auth: boolean
          expires_at: string | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status?: 'draft' | 'active' | 'closed'
          is_public?: boolean
          allow_multiple?: boolean
          require_auth?: boolean
          expires_at?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          status?: 'draft' | 'active' | 'closed'
          is_public?: boolean
          allow_multiple?: boolean
          require_auth?: boolean
          expires_at?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      poll_options: {
        Row: {
          id: string
          poll_id: string
          text: string
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          text: string
          position: number
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          text?: string
          position?: number
          created_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          poll_id: string
          option_id: string
          user_id: string | null
          voter_ip: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          option_id: string
          user_id?: string | null
          voter_ip?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          option_id?: string
          user_id?: string | null
          voter_ip?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      poll_stats: {
        Row: {
          id: string
          title: string
          description: string | null
          status: 'draft' | 'active' | 'closed'
          is_public: boolean
          allow_multiple: boolean
          require_auth: boolean
          expires_at: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          option_count: number
          total_votes: number
          unique_voters: number
        }
      }
      option_stats: {
        Row: {
          id: string
          poll_id: string
          text: string
          position: number
          created_at: string
          vote_count: number
          vote_percentage: number
        }
      }
    }
    Functions: {
      create_poll_with_options: {
        Args: {
          poll_title: string
          poll_options: string[]
          poll_description?: string | null
          is_public?: boolean
          allow_multiple?: boolean
          require_auth?: boolean
          expires_at?: string | null
        }
        Returns: string
      }
      cast_vote: {
        Args: {
          poll_id: string
          option_id: string
          voter_ip?: string | null
          user_agent?: string | null
        }
        Returns: string
      }
      get_poll_results: {
        Args: {
          poll_id: string
        }
        Returns: {
          poll_info: any
          options: any
          total_votes: number
          unique_voters: number
        }[]
      }
      has_user_voted: {
        Args: {
          poll_id: string
          user_id?: string | null
          voter_ip?: string | null
        }
        Returns: boolean
      }
    }
  }
}

// Application types
export interface Poll {
  id: string
  title: string
  description?: string
  status: 'draft' | 'active' | 'closed'
  isPublic: boolean
  allowMultiple: boolean
  requireAuth: boolean
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
  createdBy?: string
  options: PollOption[]
  totalVotes: number
  uniqueVoters?: number
}

export interface PollOption {
  id: string
  text: string
  position: number
  votes: number
  percentage?: number
}

export interface CreatePollData {
  title: string
  description?: string
  options: string[]
  isPublic: boolean
  allowMultiple: boolean
  requireAuth: boolean
  expiresAt?: Date
}

export interface VoteData {
  pollId: string
  optionId: string
  voterIp?: string
  userAgent?: string
}