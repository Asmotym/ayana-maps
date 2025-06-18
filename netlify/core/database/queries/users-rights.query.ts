import { HandlerContext, HandlerEvent } from "@netlify/functions";
import { sql } from "..";

export async function usersRightsQuery(event: HandlerEvent, context: HandlerContext): Promise<Record<string, any>> {
    console.log('usersRightsQuery', { event, context });
    return await sql`SELECT * FROM users_rights`;
}