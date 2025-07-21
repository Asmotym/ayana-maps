import { UserRights } from "../../../netlify/core/database/types";
import { DatabaseClient } from "../client";
import { type DiscordUser } from "../../../netlify/core/discord/client";

export async function getUser(discordUserId: string): Promise<DiscordUser> {
    return await DatabaseClient.request('users', { action: 'get', id: discordUserId }) as DiscordUser;
}

export async function isUserAuthorized(discordUserId: string, right: UserRights = UserRights.UPDATE): Promise<boolean> {
    const result = await DatabaseClient.request('users', { action: 'isAuthorized', id: discordUserId, right });
    return result.authorized as boolean;
}
