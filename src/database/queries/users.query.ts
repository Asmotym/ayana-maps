import { UserRights } from "../../../netlify/core/database/types";
import { DatabaseClient } from "../client";

export async function getUser(discordUserId: string): Promise<Record<string, any>> {
    return await DatabaseClient.request('users', { action: 'get', id: discordUserId });
}

export async function isUserAuthorized(discordUserId: string, right: UserRights = UserRights.UPDATE): Promise<boolean> {
    const result = await DatabaseClient.request('users', { action: 'isAuthorized', id: discordUserId, right });
    return result.authorized as boolean;
}
