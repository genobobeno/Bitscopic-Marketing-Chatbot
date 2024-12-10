import { Pool } from 'pg';

export interface UserInteraction {
  interaction_id?: number;
  user_message: string;
  ai_response: string;
  user_rating: number;
  user_comments?: string;
  interaction_time?: Date;
}

// Create a connection pool using environment variables
const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT || '5432'),
  database: process.env.PGDATABASE,
  ssl: {
    rejectUnauthorized: false
  }
});

// Add error handling for the pool
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export async function saveInteraction(interaction: Omit<UserInteraction, 'interaction_id' | 'interaction_time'>) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `
      INSERT INTO USER_INTERACTION (
        USER_MESSAGE, 
        AI_RESPONSE, 
        USER_RATING, 
        USER_COMMENTS
      ) 
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [
        interaction.user_message,
        interaction.ai_response,
        interaction.user_rating,
        interaction.user_comments
      ]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getInteractions() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `
      SELECT * FROM USER_INTERACTION 
      ORDER BY INTERACTION_TIME DESC
      `
    );
    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Add a cleanup function for graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Closing pool connections...');
  await pool.end();
  process.exit(0);
}); 