import { DatabaseClient } from "../client";

export async function getDatabaseVersion(): Promise<Record<string, any>> {
    return await DatabaseClient.request('version');
}