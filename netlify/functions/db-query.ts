import { Handler } from '@netlify/functions';
import { databaseQueriesHandler } from '../core/database';

export const handler: Handler = async (event, context) => {
  return await databaseQueriesHandler(event, context);
}; 