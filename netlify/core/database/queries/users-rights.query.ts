import type { HandlerEvent } from "@netlify/functions";
import type { DiscordUser } from "../../discord/client";
import { sql } from "..";
import { getAuthorizedUser } from "./authorized_users.query";

export type UsersRights = {
    discord_user_id: string;
    rights_update: boolean;
}

export async function getAllUsersRights(): Promise<UsersRights[]> {
    const result = await sql`SELECT * FROM users_rights`;
    return result as UsersRights[];
}

export async function getUserRights(id: string): Promise<UsersRights | undefined> {
    const result = await sql`SELECT * FROM users_rights WHERE discord_user_id = ${id}`;
    return result[0] as UsersRights || undefined;
}

export async function insertUserRights(id: string, authorized: boolean = false): Promise<UsersRights> {
    const result = await sql`INSERT INTO users_rights (discord_user_id, rights_update) VALUES (${id}, ${authorized})`;
    return result[0] as UsersRights;
}

export async function updateUserRights(id: string, rightsUpdate: boolean): Promise<UsersRights> {
    const result = await sql`UPDATE users_rights SET rights_update = ${rightsUpdate} WHERE discord_user_id = ${id}`;
    return result[0] as UsersRights;
}

export async function usersRightsQuery(event: HandlerEvent): Promise<Record<string, any>> {
    const body = JSON.parse(event.body || '{}');
    const data = body.data as DiscordUser & { action: string } || undefined;

    if (data === undefined || data.action === undefined) {
        // perform get users rights query
        return await getAllUsersRights();
    }

    // verify if user is authorized
    const authorizedUser = await getAuthorizedUser(data.id);
    const authorized = authorizedUser !== undefined;

    // retrieve current action
    const action = data.action;

    // check if user exists
    let existingUser = await getUserRights(data.id);
    
    if (existingUser === undefined) {
        console.info('[UsersRightsQuery] User not found, inserting...', { user: data, authorized });
        await insertUserRights(data.id, authorized);
        return await getUserRights(data.id) || {};
    }

    console.info('[UsersRightsQuery] Current user', { user: existingUser });

    switch (action) {
        case 'update':
            await updateUserRights(data.id, authorized);
            return await getUserRights(data.id) || {};
        default:
            throw new Error(`Unknown action: ${action}`);
    }
}