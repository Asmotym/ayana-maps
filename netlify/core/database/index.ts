import { neon } from '@netlify/neon';

export const sql = neon(process.env.NETLIFY_DATABASE_URL);

// export queries handler
export * from './queries-handler.core';