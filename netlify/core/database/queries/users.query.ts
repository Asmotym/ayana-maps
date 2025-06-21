import type { HandlerEvent } from "@netlify/functions";
import type { DiscordUser } from "../../discord/client";
import type { User, UserRights } from "../types";
import { sql } from "..";

export async function getUser(id: string): Promise<User | undefined> {
    const result = await sql`SELECT discord_user_id, username, avatar FROM users WHERE discord_user_id = ${id}`;
    return result[0] as User || undefined;
}

export async function updateUser(id: string, data: User): Promise<User> {
    const result = await sql`UPDATE users SET username = ${data.username}, avatar = ${data.avatar} WHERE discord_user_id = ${id}`;
    return result[0] as User;
}

export async function insertUser(data: User): Promise<User> {
    const result = await sql`INSERT INTO users (discord_user_id, username, avatar) VALUES (${data.discord_user_id}, ${data.username}, ${data.avatar})`;
    return result[0] as User;
}

export async function isUserAuthorized(id: string, right: UserRights): Promise<boolean> {
    const result = await sql`SELECT ${right} FROM users WHERE discord_user_id = ${id}`;
    return result[0][right] as boolean || false;
}

export async function usersQuery(event: HandlerEvent): Promise<Record<string, any>> {
    const body = JSON.parse(event.body || '{}');
    const data = body.data as DiscordUser & { action: string, data?: User, right?: UserRights } || undefined;
    const action = data.action;

    switch (action) {
        case 'get':
            return await getUser(data.id) || {};
        case 'update':
            return await updateUser(data.id, data.data as User);
        case 'insert':
            return await insertUser(data.data as User);
        case 'isAuthorized':
            return {
                authorized: await isUserAuthorized(data.id, data.right as UserRights),
            };
        default:
            throw new Error(`Unknown action: ${action}`);
    }
}