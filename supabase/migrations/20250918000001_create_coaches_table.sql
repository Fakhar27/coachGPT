CREATE TABLE coaches (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
name TEXT NOT NULL,
instructions TEXT NOT NULL, -- Their specialized system prompt
description TEXT,
icon TEXT DEFAULT '🤖',
created_at TIMESTAMPTZ DEFAULT NOW()
);