-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create polls table
CREATE TABLE polls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'closed')),
    is_public BOOLEAN NOT NULL DEFAULT true,
    allow_multiple BOOLEAN NOT NULL DEFAULT false,
    require_auth BOOLEAN NOT NULL DEFAULT false,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Constraints
    CONSTRAINT polls_title_length CHECK (char_length(title) >= 1 AND char_length(title) <= 100),
    CONSTRAINT polls_description_length CHECK (char_length(description) <= 300),
    CONSTRAINT polls_expires_at_future CHECK (expires_at IS NULL OR expires_at > created_at)
);

-- Create poll_options table
CREATE TABLE poll_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    text VARCHAR(80) NOT NULL,
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT poll_options_text_length CHECK (char_length(text) >= 1 AND char_length(text) <= 80),
    CONSTRAINT poll_options_position_positive CHECK (position > 0),
    
    -- Unique constraint to prevent duplicate positions within a poll
    UNIQUE(poll_id, position)
);

-- Create votes table
CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    option_id UUID NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    voter_ip INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Prevent duplicate votes from same user (when authenticated)
    UNIQUE(poll_id, user_id) WHERE user_id IS NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_polls_status ON polls(status);
CREATE INDEX idx_polls_created_by ON polls(created_by);
CREATE INDEX idx_polls_created_at ON polls(created_at DESC);
CREATE INDEX idx_polls_expires_at ON polls(expires_at);
CREATE INDEX idx_poll_options_poll_id ON poll_options(poll_id);
CREATE INDEX idx_poll_options_position ON poll_options(poll_id, position);
CREATE INDEX idx_votes_poll_id ON votes(poll_id);
CREATE INDEX idx_votes_option_id ON votes(option_id);
CREATE INDEX idx_votes_user_id ON votes(user_id);
CREATE INDEX idx_votes_created_at ON votes(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for polls updated_at
CREATE TRIGGER update_polls_updated_at 
    BEFORE UPDATE ON polls 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create view for poll statistics
CREATE VIEW poll_stats AS
SELECT 
    p.id,
    p.title,
    p.description,
    p.status,
    p.is_public,
    p.allow_multiple,
    p.require_auth,
    p.expires_at,
    p.created_at,
    p.updated_at,
    p.created_by,
    COUNT(DISTINCT po.id) as option_count,
    COUNT(v.id) as total_votes,
    COUNT(DISTINCT v.user_id) as unique_voters
FROM polls p
LEFT JOIN poll_options po ON p.id = po.poll_id
LEFT JOIN votes v ON p.id = v.poll_id
GROUP BY p.id, p.title, p.description, p.status, p.is_public, p.allow_multiple, 
         p.require_auth, p.expires_at, p.created_at, p.updated_at, p.created_by;

-- Create view for option statistics
CREATE VIEW option_stats AS
SELECT 
    po.id,
    po.poll_id,
    po.text,
    po.position,
    po.created_at,
    COUNT(v.id) as vote_count,
    ROUND(
        CASE 
            WHEN poll_totals.total_votes > 0 
            THEN (COUNT(v.id)::DECIMAL / poll_totals.total_votes) * 100 
            ELSE 0 
        END, 
        2
    ) as vote_percentage
FROM poll_options po
LEFT JOIN votes v ON po.id = v.option_id
LEFT JOIN (
    SELECT 
        poll_id, 
        COUNT(*) as total_votes 
    FROM votes 
    GROUP BY poll_id
) poll_totals ON po.poll_id = poll_totals.poll_id
GROUP BY po.id, po.poll_id, po.text, po.position, po.created_at, poll_totals.total_votes
ORDER BY po.poll_id, po.position;