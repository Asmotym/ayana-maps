import type { HandlerEvent } from "@netlify/functions";
import type { DiscordUser } from "../../discord/client";
import type { User } from "../types";
import { UserRights } from "../types";
import { sql } from "..";
import { createLogger } from "../../utils/logger";

const logger = createLogger('Users');

export async function getUser(id: string): Promise<User | undefined> {
    const result = await sql`SELECT discord_user_id, username, avatar FROM users WHERE discord_user_id = ${id}`;
    logger.info(`Fetched user <user: ${logger.highlight(id)}>`);
    return result[0] as User || undefined;
}

export async function updateUser(id: string, data: User): Promise<User> {
    const result = await sql`UPDATE users SET username = ${data.username}, avatar = ${data.avatar} WHERE discord_user_id = ${id}`;
    logger.info(`Updated user <user: ${logger.highlight(id)}>`);
    return result[0] as User;
}

export async function insertUser(data: User): Promise<User> {
    const result = await sql`INSERT INTO users (discord_user_id, username, avatar) VALUES (${data.discord_user_id}, ${data.username}, ${data.avatar})`;
    logger.success(`Inserted user <user: ${logger.highlight(data.discord_user_id || 'unknown')}>`);
    return result[0] as User;
}

export async function isUserAuthorized(id: string, right: UserRights): Promise<boolean> {
    let result;
    
    switch (right) {
        case UserRights.UPDATE:
            result = await sql`SELECT rights_update FROM users WHERE discord_user_id = ${id}`;
            break;
        case UserRights.TESTING_GROUND:
            result = await sql`SELECT rights_testing_ground FROM users WHERE discord_user_id = ${id}`;
            break;
        default:
            logger.warn(`Unknown right provided <right: ${logger.warningValue(right)}>`);
            return false;
    }
    
    const hasRight = result[0][right] as boolean || false;
    const status = hasRight ? logger.successValue('GRANTED') : logger.errorValue('DENIED');
    logger.info(`Checking rights <user: ${logger.highlight(id)}> <right: ${logger.highlight(right)}> <result: ${status}>`);
    return hasRight;
}

export async function usersQuery(event: HandlerEvent): Promise<Record<string, any>> {
    const body = JSON.parse(event.body || '{}');
    const data = body.data as DiscordUser & { action: string, data?: User, right?: UserRights } || undefined;
    const action = data?.action;
    const userId = data?.id;
    const userRight = data?.right;
    
    logger.info(`Querying <action: ${logger.highlight(action || 'undefined')}> <user: ${logger.highlight(userId || 'undefined')}> <right: ${logger.highlight(userRight || 'undefined')}>`);

    if (!data || !action) {
        throw new Error('Invalid request data or missing action');
    }

    switch (action) {
        case 'get':
            return await getUser(data.id) || {};
        case 'update':
            return await updateUser(data.id, data.data as User);
        case 'insert':
            return await insertUser(data.data as User);
        case 'isAuthorized':
            if (!userRight) {
                throw new Error('Right parameter is required for isAuthorized action');
            }
            return {
                authorized: await isUserAuthorized(data.id, userRight),
            };
        default:
            throw new Error(`Unknown action: ${action}`);
    }
}