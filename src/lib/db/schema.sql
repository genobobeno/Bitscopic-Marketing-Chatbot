-- Drop the table if it exists to avoid conflicts
DROP TABLE IF EXISTS USER_INTERACTION;

-- Create the table with all required columns
CREATE TABLE USER_INTERACTION (
    INTERACTION_ID SERIAL PRIMARY KEY,
    USER_MESSAGE TEXT NOT NULL,
    AI_RESPONSE TEXT NOT NULL,
    USER_RATING SMALLINT NOT NULL CHECK (USER_RATING BETWEEN 1 AND 5),
    USER_COMMENTS TEXT,
    INTERACTION_TIME TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on INTERACTION_TIME for faster querying
CREATE INDEX idx_interaction_time ON USER_INTERACTION(INTERACTION_TIME);

-- Add a comment to the table
COMMENT ON TABLE USER_INTERACTION IS 'Stores user interactions with the AI assistant and their ratings';

-- Add comments to columns
COMMENT ON COLUMN USER_INTERACTION.INTERACTION_ID IS 'Unique identifier for each interaction';
COMMENT ON COLUMN USER_INTERACTION.USER_MESSAGE IS 'The message sent by the user';
COMMENT ON COLUMN USER_INTERACTION.AI_RESPONSE IS 'The response from the AI assistant';
COMMENT ON COLUMN USER_INTERACTION.USER_RATING IS 'Rating given by user (1-5 stars)';
COMMENT ON COLUMN USER_INTERACTION.USER_COMMENTS IS 'Optional feedback provided by the user';
COMMENT ON COLUMN USER_INTERACTION.INTERACTION_TIME IS 'Timestamp when the interaction was rated'; 