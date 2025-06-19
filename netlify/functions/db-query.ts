import { Handler } from '@netlify/functions';
import { databaseQueriesHandler } from '../core/database';

export const handler: Handler = async (event) => {
  return await databaseQueriesHandler(event);
}; 