import { DatabaseClient } from "../client";

export async function getUsersRights(): Promise<Record<string, any>> {
    return await DatabaseClient.request('users_rights');
}