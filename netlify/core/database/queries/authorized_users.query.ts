import { HandlerEvent } from "@netlify/functions";
import { DiscordUser } from "../../discord/client";
import { sql } from "..";

export type AuthorizedUser = {
    discord_user_id: string;
    username: string;
}

export async function getAuthorizedUser(id: string): Promise<AuthorizedUser | undefined> {
    const result = await sql`SELECT * FROM authorized_users WHERE discord_user_id = ${id}`;
    return result[0] as AuthorizedUser || undefined;
}

export async function authorizedUsersQuery(event: HandlerEvent): Promise<Record<string, any>> {
    const body = JSON.parse(event.body || '{}');
    const data = body.data as DiscordUser & { action: string } || undefined;

    if (data === undefined) {
        throw new Error('No data provided');
    }

    const action = data.action;

    switch (action) {
        case 'get':
            return await getAuthorizedUser(data.id) as AuthorizedUser || {};
        default:
            throw new Error(`Unknown action: ${action}`);
    }
}