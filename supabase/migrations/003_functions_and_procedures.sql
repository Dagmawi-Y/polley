-- Function to create a complete poll with options
CREATE OR REPLACE FUNCTION create_poll_with_options(
    poll_title VARCHAR(100),
    poll_options TEXT[],
    poll_description TEXT DEFAULT NULL,
    is_public BOOLEAN DEFAULT true,
    allow_multiple BOOLEAN DEFAULT false,
    require_auth BOOLEAN DEFAULT false,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    new_poll_id UUID;
    option_text TEXT;
    option_position INTEGER := 1;
BEGIN
    -- Validate inputs
    IF array_length(poll_options, 1) < 2 THEN
        RAISE EXCEPTION 'Poll must have at least 2 options';
    END IF;
    
    IF array_length(poll_options, 1) > 10 THEN
        RAISE EXCEPTION 'Poll cannot have more than 10 options';
    END IF;
    
    -- Create the poll
    INSERT INTO polls (
        title, 
        description, 
        is_public, 
        allow_multiple, 
        require_auth, 
        expires_at, 
        created_by,
        status
    ) VALUES (
        poll_title,
        poll_description,
        is_public,
        allow_multiple,
        require_auth,
        expires_at,
        auth.uid(),
        'active'
    ) RETURNING id INTO new_poll_id;
    
    -- Create poll options
    FOREACH option_text IN ARRAY poll_options
    LOOP
        IF trim(option_text) = '' THEN
            RAISE EXCEPTION 'Poll option cannot be empty';
        END IF;
        
        INSERT INTO poll_options (poll_id, text, position)
        VALUES (new_poll_id, trim(option_text), option_position);
        
        option_position := option_position + 1;
    END LOOP;
    
    RETURN new_poll_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cast a vote
CREATE OR REPLACE FUNCTION cast_vote(
    poll_id UUID,
    option_id UUID,
    voter_ip INET DEFAULT NULL,
    user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    new_vote_id UUID;
    current_user_id UUID;
BEGIN
    -- Get current user ID (null if anonymous)
    current_user_id := auth.uid();
    
    -- Insert the vote (triggers will handle validation)
    INSERT INTO votes (poll_id, option_id, user_id, voter_ip, user_agent)
    VALUES (poll_id, option_id, current_user_id, voter_ip, user_agent)
    RETURNING id INTO new_vote_id;
    
    RETURN new_vote_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get poll results with statistics
CREATE OR REPLACE FUNCTION get_poll_results(poll_id UUID)
RETURNS TABLE (
    poll_info JSONB,
    options JSONB,
    total_votes BIGINT,
    unique_voters BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        to_jsonb(p.*) as poll_info,
        jsonb_agg(
            jsonb_build_object(
                'id', os.id,
                'text', os.text,
                'position', os.position,
                'vote_count', os.vote_count,
                'vote_percentage', os.vote_percentage
            ) ORDER BY os.position
        ) as options,
        COALESCE(ps.total_votes, 0) as total_votes,
        COALESCE(ps.unique_voters, 0) as unique_voters
    FROM polls p
    LEFT JOIN poll_stats ps ON p.id = ps.id
    LEFT JOIN option_stats os ON p.id = os.poll_id
    WHERE p.id = poll_id
    GROUP BY p.id, p.title, p.description, p.status, p.is_public, p.allow_multiple, 
             p.require_auth, p.expires_at, p.created_at, p.updated_at, p.created_by,
             ps.total_votes, ps.unique_voters;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to close expired polls
CREATE OR REPLACE FUNCTION close_expired_polls()
RETURNS INTEGER AS $$
DECLARE
    closed_count INTEGER;
BEGIN
    UPDATE polls 
    SET status = 'closed', updated_at = NOW()
    WHERE status = 'active' 
    AND expires_at IS NOT NULL 
    AND expires_at <= NOW();
    
    GET DIAGNOSTICS closed_count = ROW_COUNT;
    RETURN closed_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's polls with statistics
CREATE OR REPLACE FUNCTION get_user_polls(user_id UUID DEFAULT NULL)
RETURNS TABLE (
    id UUID,
    title VARCHAR(100),
    description TEXT,
    status VARCHAR(20),
    is_public BOOLEAN,
    allow_multiple BOOLEAN,
    require_auth BOOLEAN,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    option_count BIGINT,
    total_votes BIGINT,
    unique_voters BIGINT
) AS $$
DECLARE
    target_user_id UUID;
BEGIN
    -- Use provided user_id or current authenticated user
    target_user_id := COALESCE(user_id, auth.uid());
    
    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'User ID is required';
    END IF;
    
    RETURN QUERY
    SELECT 
        ps.id,
        ps.title,
        ps.description,
        ps.status,
        ps.is_public,
        ps.allow_multiple,
        ps.require_auth,
        ps.expires_at,
        ps.created_at,
        ps.updated_at,
        ps.option_count,
        ps.total_votes,
        ps.unique_voters
    FROM poll_stats ps
    WHERE ps.created_by = target_user_id
    ORDER BY ps.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get public polls with pagination
CREATE OR REPLACE FUNCTION get_public_polls(
    page_size INTEGER DEFAULT 20,
    page_offset INTEGER DEFAULT 0,
    status_filter VARCHAR(20) DEFAULT 'active'
)
RETURNS TABLE (
    id UUID,
    title VARCHAR(100),
    description TEXT,
    status VARCHAR(20),
    is_public BOOLEAN,
    allow_multiple BOOLEAN,
    require_auth BOOLEAN,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    option_count BIGINT,
    total_votes BIGINT,
    unique_voters BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ps.id,
        ps.title,
        ps.description,
        ps.status,
        ps.is_public,
        ps.allow_multiple,
        ps.require_auth,
        ps.expires_at,
        ps.created_at,
        ps.updated_at,
        ps.option_count,
        ps.total_votes,
        ps.unique_voters
    FROM poll_stats ps
    WHERE ps.is_public = true
    AND (status_filter IS NULL OR ps.status = status_filter)
    ORDER BY ps.created_at DESC
    LIMIT page_size
    OFFSET page_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has voted on a poll
CREATE OR REPLACE FUNCTION has_user_voted(
    poll_id UUID,
    user_id UUID DEFAULT NULL,
    voter_ip INET DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    target_user_id UUID;
    vote_exists BOOLEAN := false;
BEGIN
    target_user_id := COALESCE(user_id, auth.uid());
    
    -- Check for authenticated user vote
    IF target_user_id IS NOT NULL THEN
        SELECT EXISTS (
            SELECT 1 FROM votes 
            WHERE votes.poll_id = has_user_voted.poll_id 
            AND votes.user_id = target_user_id
        ) INTO vote_exists;
    -- Check for anonymous vote by IP
    ELSIF voter_ip IS NOT NULL THEN
        SELECT EXISTS (
            SELECT 1 FROM votes 
            WHERE votes.poll_id = has_user_voted.poll_id 
            AND votes.user_id IS NULL 
            AND votes.voter_ip = voter_ip
            AND votes.created_at > NOW() - INTERVAL '1 hour'
        ) INTO vote_exists;
    END IF;
    
    RETURN vote_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;