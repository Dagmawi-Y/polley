# Polley Database Schema

This directory contains the Supabase database schema and migrations for the Polley polling application.

## Schema Overview

The database consists of three main tables:

### Tables

1. **polls** - Main poll information
   - `id` (UUID, Primary Key)
   - `title` (VARCHAR(100)) - Poll question/title
   - `description` (TEXT) - Optional poll description
   - `status` (VARCHAR(20)) - 'draft', 'active', or 'closed'
   - `is_public` (BOOLEAN) - Whether poll is publicly accessible
   - `allow_multiple` (BOOLEAN) - Allow multiple option selection
   - `require_auth` (BOOLEAN) - Require authentication to vote
   - `expires_at` (TIMESTAMP) - Optional expiration date
   - `created_at`, `updated_at` (TIMESTAMP) - Audit fields
   - `created_by` (UUID) - References auth.users(id)

2. **poll_options** - Individual poll choices
   - `id` (UUID, Primary Key)
   - `poll_id` (UUID) - References polls(id)
   - `text` (VARCHAR(80)) - Option text
   - `position` (INTEGER) - Display order
   - `created_at` (TIMESTAMP)

3. **votes** - Individual vote records
   - `id` (UUID, Primary Key)
   - `poll_id` (UUID) - References polls(id)
   - `option_id` (UUID) - References poll_options(id)
   - `user_id` (UUID) - References auth.users(id), nullable for anonymous votes
   - `voter_ip` (INET) - IP address for anonymous vote tracking
   - `user_agent` (TEXT) - Browser information
   - `created_at` (TIMESTAMP)

### Views

- **poll_stats** - Aggregated poll statistics (vote counts, unique voters)
- **option_stats** - Option-level statistics with percentages

### Functions

- `create_poll_with_options()` - Create poll with options in single transaction
- `cast_vote()` - Cast a vote with validation
- `get_poll_results()` - Get complete poll results with statistics
- `close_expired_polls()` - Batch close expired polls
- `get_user_polls()` - Get user's polls with statistics
- `get_public_polls()` - Get public polls with pagination
- `has_user_voted()` - Check if user/IP has already voted

## Security

Row Level Security (RLS) is enabled on all tables with policies for:

- **Public Access**: Anyone can view public polls and their results
- **User Access**: Users can manage their own polls
- **Voting**: Controlled access based on poll settings (public/private, auth requirements)
- **Anonymous Voting**: IP-based duplicate prevention for anonymous users

## Migration Files

1. `001_initial_schema.sql` - Core tables, indexes, and views
2. `002_row_level_security.sql` - RLS policies and voting constraints
3. `003_functions_and_procedures.sql` - Database functions and procedures
4. `004_sample_data.sql` - Sample data for development/testing

## Usage

### Running Migrations

```bash
# Apply all migrations
supabase db reset

# Or apply individual migrations
supabase db push
```

### Example Queries

```sql
-- Create a poll with options
SELECT create_poll_with_options(
    'What is your favorite color?',
    'Help us choose our new brand colors',
    ARRAY['Red', 'Blue', 'Green', 'Yellow'],
    true,  -- is_public
    false, -- allow_multiple
    false, -- require_auth
    NOW() + INTERVAL '7 days' -- expires_at
);

-- Cast a vote
SELECT cast_vote(
    'poll-uuid-here',
    'option-uuid-here',
    '192.168.1.100'::inet,
    'Mozilla/5.0...'
);

-- Get poll results
SELECT * FROM get_poll_results('poll-uuid-here');

-- Get public polls
SELECT * FROM get_public_polls(10, 0, 'active');
```

## Environment Setup

Make sure your Supabase project has the following environment variables configured:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (for server-side operations)

## Development Notes

- The `004_sample_data.sql` migration includes sample polls for development
- Anonymous voting uses IP-based duplicate prevention with 1-hour cooldown
- Polls automatically close when `expires_at` is reached (requires cron job or manual trigger)
- All timestamps are stored in UTC with timezone information
- Vote validation happens at the database level through triggers

## Performance Considerations

- Indexes are created on frequently queried columns
- Views pre-aggregate statistics to avoid expensive joins
- Pagination is implemented for large result sets
- Consider adding database-level caching for high-traffic polls