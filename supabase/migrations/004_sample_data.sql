-- Insert sample data for development and testing
-- Note: This should only be run in development environments

-- Create some sample users (these would normally be created through Supabase Auth)
-- For demo purposes, we'll create polls with NULL created_by to simulate system-generated polls

-- Sample Poll 1: Favorite Season
DO $$
DECLARE
    new_poll_id UUID;
BEGIN
    -- Create the poll
    INSERT INTO polls (
        title,
        description,
        status,
        is_public,
        allow_multiple,
        require_auth,
        expires_at,
        created_by
    ) VALUES (
        'What''s your favorite season?',
        'Help us understand seasonal preferences for our upcoming product launch.',
        'active',
        true,
        false,
        false,
        NOW() + INTERVAL '30 days',
        NULL
    ) RETURNING id INTO new_poll_id;
    
    -- Create options
    INSERT INTO poll_options (poll_id, text, position) VALUES
        (new_poll_id, 'Spring - Fresh starts and blooming flowers', 1),
        (new_poll_id, 'Summer - Warm weather and long days', 2),
        (new_poll_id, 'Fall - Cozy vibes and beautiful colors', 3),
        (new_poll_id, 'Winter - Snow and holiday magic', 4);
    
    -- Add some sample votes
    INSERT INTO votes (poll_id, option_id, voter_ip, created_at) 
    SELECT 
        new_poll_id,
        po.id,
        ('192.168.1.' || (random() * 254 + 1)::int)::inet,
        NOW() - (random() * INTERVAL '7 days')
    FROM poll_options po
    CROSS JOIN generate_series(1, 45) -- 45 votes for Spring
    WHERE po.poll_id = new_poll_id
    AND po.position = 1;
    
    INSERT INTO votes (poll_id, option_id, voter_ip, created_at) 
    SELECT 
        new_poll_id,
        po.id,
        ('192.168.1.' || (random() * 254 + 1)::int)::inet,
        NOW() - (random() * INTERVAL '7 days')
    FROM poll_options po
    CROSS JOIN generate_series(1, 78) -- 78 votes for Summer
    WHERE po.poll_id = new_poll_id
    AND po.position = 2;
    
    INSERT INTO votes (poll_id, option_id, voter_ip, created_at) 
    SELECT 
        new_poll_id,
        po.id,
        ('192.168.1.' || (random() * 254 + 1)::int)::inet,
        NOW() - (random() * INTERVAL '7 days')
    FROM poll_options po
    CROSS JOIN generate_series(1, 62) -- 62 votes for Fall
    WHERE po.poll_id = new_poll_id
    AND po.position = 3;
    
    INSERT INTO votes (poll_id, option_id, voter_ip, created_at) 
    SELECT 
        new_poll_id,
        po.id,
        ('192.168.1.' || (random() * 254 + 1)::int)::inet,
        NOW() - (random() * INTERVAL '7 days')
    FROM poll_options po
    CROSS JOIN generate_series(1, 23) -- 23 votes for Winter
    WHERE po.poll_id = new_poll_id
    AND po.position = 4;
END $$;

-- Sample Poll 2: Programming Languages
DO $$
DECLARE
    new_poll_id UUID;
BEGIN
    INSERT INTO polls (
        title,
        description,
        status,
        is_public,
        allow_multiple,
        require_auth,
        created_by
    ) VALUES (
        'Best programming language for beginners?',
        'Share your thoughts on which language newcomers should learn first.',
        'active',
        true,
        false,
        false,
        NULL
    ) RETURNING id INTO new_poll_id;
    
    INSERT INTO poll_options (poll_id, text, position) VALUES
        (new_poll_id, 'Python - Simple syntax and versatile', 1),
        (new_poll_id, 'JavaScript - Essential for web development', 2),
        (new_poll_id, 'Java - Strong fundamentals and job market', 3),
        (new_poll_id, 'C++ - Deep understanding of programming', 4),
        (new_poll_id, 'Go - Modern and efficient', 5);
    
    -- Add sample votes with different distributions
    INSERT INTO votes (poll_id, option_id, voter_ip, created_at) 
    SELECT 
        new_poll_id,
        po.id,
        ('10.0.0.' || (random() * 254 + 1)::int)::inet,
        NOW() - (random() * INTERVAL '5 days')
    FROM poll_options po
    CROSS JOIN generate_series(1, 156) -- Python
    WHERE po.poll_id = new_poll_id
    AND po.position = 1;
    
    INSERT INTO votes (poll_id, option_id, voter_ip, created_at) 
    SELECT 
        new_poll_id,
        po.id,
        ('10.0.0.' || (random() * 254 + 1)::int)::inet,
        NOW() - (random() * INTERVAL '5 days')
    FROM poll_options po
    CROSS JOIN generate_series(1, 134) -- JavaScript
    WHERE po.poll_id = new_poll_id
    AND po.position = 2;
    
    INSERT INTO votes (poll_id, option_id, voter_ip, created_at) 
    SELECT 
        new_poll_id,
        po.id,
        ('10.0.0.' || (random() * 254 + 1)::int)::inet,
        NOW() - (random() * INTERVAL '5 days')
    FROM poll_options po
    CROSS JOIN generate_series(1, 89) -- Java
    WHERE po.poll_id = new_poll_id
    AND po.position = 3;
    
    INSERT INTO votes (poll_id, option_id, voter_ip, created_at) 
    SELECT 
        new_poll_id,
        po.id,
        ('10.0.0.' || (random() * 254 + 1)::int)::inet,
        NOW() - (random() * INTERVAL '5 days')
    FROM poll_options po
    CROSS JOIN generate_series(1, 34) -- C++
    WHERE po.poll_id = new_poll_id
    AND po.position = 4;
    
    INSERT INTO votes (poll_id, option_id, voter_ip, created_at) 
    SELECT 
        new_poll_id,
        po.id,
        ('10.0.0.' || (random() * 254 + 1)::int)::inet,
        NOW() - (random() * INTERVAL '5 days')
    FROM poll_options po
    CROSS JOIN generate_series(1, 67) -- Go
    WHERE po.poll_id = new_poll_id
    AND po.position = 5;
END $$;

-- Sample Poll 3: Development Frameworks (Demo poll)
DO $$
DECLARE
    poll_id UUID;
BEGIN
    INSERT INTO polls (
        id,
        title,
        description,
        status,
        is_public,
        allow_multiple,
        require_auth,
        expires_at,
        created_by
    ) VALUES (
        'demo'::UUID,
        'What''s your favorite development framework?',
        'Help us understand the current preferences in the developer community.',
        'active',
        true,
        false,
        false,
        NOW() + INTERVAL '30 days',
        NULL
    );
    
    INSERT INTO poll_options (poll_id, text, position) VALUES
        ('demo'::UUID, 'React - Component-based and flexible', 1),
        ('demo'::UUID, 'Vue.js - Progressive and approachable', 2),
        ('demo'::UUID, 'Angular - Full-featured and structured', 3),
        ('demo'::UUID, 'Svelte - Compile-time optimized', 4),
        ('demo'::UUID, 'SolidJS - Fine-grained reactivity', 5);
    
    -- Add sample votes
    INSERT INTO votes (poll_id, option_id, voter_ip, created_at) 
    SELECT 
        'demo'::UUID,
        po.id,
        ('172.16.0.' || (random() * 254 + 1)::int)::inet,
        NOW() - (random() * INTERVAL '3 days')
    FROM poll_options po
    CROSS JOIN generate_series(1, 145) -- React
    WHERE po.poll_id = 'demo'::UUID
    AND po.position = 1;
    
    INSERT INTO votes (poll_id, option_id, voter_ip, created_at) 
    SELECT 
        'demo'::UUID,
        po.id,
        ('172.16.0.' || (random() * 254 + 1)::int)::inet,
        NOW() - (random() * INTERVAL '3 days')
    FROM poll_options po
    CROSS JOIN generate_series(1, 89) -- Vue
    WHERE po.poll_id = 'demo'::UUID
    AND po.position = 2;
    
    INSERT INTO votes (poll_id, option_id, voter_ip, created_at) 
    SELECT 
        'demo'::UUID,
        po.id,
        ('172.16.0.' || (random() * 254 + 1)::int)::inet,
        NOW() - (random() * INTERVAL '3 days')
    FROM poll_options po
    CROSS JOIN generate_series(1, 67) -- Angular
    WHERE po.poll_id = 'demo'::UUID
    AND po.position = 3;
    
    INSERT INTO votes (poll_id, option_id, voter_ip, created_at) 
    SELECT 
        'demo'::UUID,
        po.id,
        ('172.16.0.' || (random() * 254 + 1)::int)::inet,
        NOW() - (random() * INTERVAL '3 days')
    FROM poll_options po
    CROSS JOIN generate_series(1, 34) -- Svelte
    WHERE po.poll_id = 'demo'::UUID
    AND po.position = 4;
    
    INSERT INTO votes (poll_id, option_id, voter_ip, created_at) 
    SELECT 
        'demo'::UUID,
        po.id,
        ('172.16.0.' || (random() * 254 + 1)::int)::inet,
        NOW() - (random() * INTERVAL '3 days')
    FROM poll_options po
    CROSS JOIN generate_series(1, 23) -- SolidJS
    WHERE po.poll_id = 'demo'::UUID
    AND po.position = 5;
END $$;

-- Sample Poll 4: Closed poll for testing
DO $$
DECLARE
    new_poll_id UUID;
BEGIN
    INSERT INTO polls (
        title,
        description,
        status,
        is_public,
        allow_multiple,
        require_auth,
        expires_at,
        created_by
    ) VALUES (
        'Favorite IDE/Editor (Closed)',
        'This poll has ended. Results are final.',
        'closed',
        true,
        false,
        false,
        NOW() - INTERVAL '1 day',
        NULL
    ) RETURNING id INTO new_poll_id;
    
    INSERT INTO poll_options (poll_id, text, position) VALUES
        (new_poll_id, 'VS Code', 1),
        (new_poll_id, 'IntelliJ IDEA', 2),
        (new_poll_id, 'Vim/Neovim', 3),
        (new_poll_id, 'Sublime Text', 4);
    
    -- Add final votes
    INSERT INTO votes (poll_id, option_id, voter_ip, created_at) 
    SELECT 
        new_poll_id,
        po.id,
        ('203.0.113.' || (random() * 254 + 1)::int)::inet,
        NOW() - INTERVAL '2 days' - (random() * INTERVAL '1 day')
    FROM poll_options po
    CROSS JOIN generate_series(1, 234) -- VS Code
    WHERE po.poll_id = new_poll_id
    AND po.position = 1;
    
    INSERT INTO votes (poll_id, option_id, voter_ip, created_at) 
    SELECT 
        new_poll_id,
        po.id,
        ('203.0.113.' || (random() * 254 + 1)::int)::inet,
        NOW() - INTERVAL '2 days' - (random() * INTERVAL '1 day')
    FROM poll_options po
    CROSS JOIN generate_series(1, 123) -- IntelliJ
    WHERE po.poll_id = new_poll_id
    AND po.position = 2;
    
    INSERT INTO votes (poll_id, option_id, voter_ip, created_at) 
    SELECT 
        new_poll_id,
        po.id,
        ('203.0.113.' || (random() * 254 + 1)::int)::inet,
        NOW() - INTERVAL '2 days' - (random() * INTERVAL '1 day')
    FROM poll_options po
    CROSS JOIN generate_series(1, 87) -- Vim
    WHERE po.poll_id = new_poll_id
    AND po.position = 3;
    
    INSERT INTO votes (poll_id, option_id, voter_ip, created_at) 
    SELECT 
        new_poll_id,
        po.id,
        ('203.0.113.' || (random() * 254 + 1)::int)::inet,
        NOW() - INTERVAL '2 days' - (random() * INTERVAL '1 day')
    FROM poll_options po
    CROSS JOIN generate_series(1, 45) -- Sublime
    WHERE po.poll_id = new_poll_id
    AND po.position = 4;
END $$;