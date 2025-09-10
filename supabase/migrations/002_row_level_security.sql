-- Enable Row Level Security on all tables
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Policies for polls table
-- Anyone can view public polls
CREATE POLICY "Public polls are viewable by everyone" ON polls
    FOR SELECT USING (is_public = true);

-- Users can view their own polls (including private ones)
CREATE POLICY "Users can view own polls" ON polls
    FOR SELECT USING (auth.uid() = created_by);

-- Authenticated users can create polls
CREATE POLICY "Authenticated users can create polls" ON polls
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = created_by);

-- Users can update their own polls
CREATE POLICY "Users can update own polls" ON polls
    FOR UPDATE USING (auth.uid() = created_by);

-- Users can delete their own polls
CREATE POLICY "Users can delete own polls" ON polls
    FOR DELETE USING (auth.uid() = created_by);

-- Policies for poll_options table
-- Anyone can view options for public polls
CREATE POLICY "Poll options viewable for public polls" ON poll_options
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM polls 
            WHERE polls.id = poll_options.poll_id 
            AND polls.is_public = true
        )
    );

-- Users can view options for their own polls
CREATE POLICY "Users can view options for own polls" ON poll_options
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM polls 
            WHERE polls.id = poll_options.poll_id 
            AND polls.created_by = auth.uid()
        )
    );

-- Users can create options for their own polls
CREATE POLICY "Users can create options for own polls" ON poll_options
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM polls 
            WHERE polls.id = poll_options.poll_id 
            AND polls.created_by = auth.uid()
        )
    );

-- Users can update options for their own polls
CREATE POLICY "Users can update options for own polls" ON poll_options
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM polls 
            WHERE polls.id = poll_options.poll_id 
            AND polls.created_by = auth.uid()
        )
    );

-- Users can delete options for their own polls
CREATE POLICY "Users can delete options for own polls" ON poll_options
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM polls 
            WHERE polls.id = poll_options.poll_id 
            AND polls.created_by = auth.uid()
        )
    );

-- Policies for votes table
-- Anyone can view votes for public polls (for results)
CREATE POLICY "Votes viewable for public polls" ON votes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM polls 
            WHERE polls.id = votes.poll_id 
            AND polls.is_public = true
        )
    );

-- Poll creators can view votes for their polls
CREATE POLICY "Poll creators can view votes for own polls" ON votes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM polls 
            WHERE polls.id = votes.poll_id 
            AND polls.created_by = auth.uid()
        )
    );

-- Users can view their own votes
CREATE POLICY "Users can view own votes" ON votes
    FOR SELECT USING (auth.uid() = user_id);

-- Voting policies - more complex logic
-- Anyone can vote on public polls that don't require auth
CREATE POLICY "Anyone can vote on public polls without auth requirement" ON votes
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM polls 
            WHERE polls.id = votes.poll_id 
            AND polls.is_public = true 
            AND polls.require_auth = false
            AND polls.status = 'active'
            AND (polls.expires_at IS NULL OR polls.expires_at > NOW())
        )
    );

-- Authenticated users can vote on public polls that require auth
CREATE POLICY "Authenticated users can vote on public polls with auth requirement" ON votes
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' 
        AND auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM polls 
            WHERE polls.id = votes.poll_id 
            AND polls.is_public = true 
            AND polls.require_auth = true
            AND polls.status = 'active'
            AND (polls.expires_at IS NULL OR polls.expires_at > NOW())
        )
    );

-- Users can vote on private polls they have access to (would need additional access control table)
-- For now, only poll creators can vote on their private polls
CREATE POLICY "Poll creators can vote on own private polls" ON votes
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' 
        AND auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM polls 
            WHERE polls.id = votes.poll_id 
            AND polls.created_by = auth.uid()
            AND polls.status = 'active'
            AND (polls.expires_at IS NULL OR polls.expires_at > NOW())
        )
    );

-- Function to prevent multiple votes on single-choice polls
CREATE OR REPLACE FUNCTION check_single_vote_constraint()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if poll allows multiple votes
    IF EXISTS (
        SELECT 1 FROM polls 
        WHERE id = NEW.poll_id 
        AND allow_multiple = false
    ) THEN
        -- Check if user already voted (for authenticated users)
        IF NEW.user_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM votes 
            WHERE poll_id = NEW.poll_id 
            AND user_id = NEW.user_id
        ) THEN
            RAISE EXCEPTION 'User has already voted on this poll';
        END IF;
        
        -- For anonymous votes, check IP address (basic duplicate prevention)
        IF NEW.user_id IS NULL AND NEW.voter_ip IS NOT NULL AND EXISTS (
            SELECT 1 FROM votes 
            WHERE poll_id = NEW.poll_id 
            AND user_id IS NULL 
            AND voter_ip = NEW.voter_ip
            AND created_at > NOW() - INTERVAL '1 hour' -- Allow re-voting after 1 hour for anonymous users
        ) THEN
            RAISE EXCEPTION 'IP address has already voted on this poll recently';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for vote constraint
CREATE TRIGGER check_single_vote_constraint_trigger
    BEFORE INSERT ON votes
    FOR EACH ROW
    EXECUTE FUNCTION check_single_vote_constraint();

-- Function to validate vote against poll constraints
CREATE OR REPLACE FUNCTION validate_vote()
RETURNS TRIGGER AS $$
DECLARE
    poll_record polls%ROWTYPE;
BEGIN
    -- Get poll details
    SELECT * INTO poll_record FROM polls WHERE id = NEW.poll_id;
    
    -- Check if poll exists
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Poll not found';
    END IF;
    
    -- Check if poll is active
    IF poll_record.status != 'active' THEN
        RAISE EXCEPTION 'Poll is not active';
    END IF;
    
    -- Check if poll has expired
    IF poll_record.expires_at IS NOT NULL AND poll_record.expires_at <= NOW() THEN
        RAISE EXCEPTION 'Poll has expired';
    END IF;
    
    -- Check if option belongs to the poll
    IF NOT EXISTS (
        SELECT 1 FROM poll_options 
        WHERE id = NEW.option_id AND poll_id = NEW.poll_id
    ) THEN
        RAISE EXCEPTION 'Option does not belong to this poll';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for vote validation
CREATE TRIGGER validate_vote_trigger
    BEFORE INSERT ON votes
    FOR EACH ROW
    EXECUTE FUNCTION validate_vote();