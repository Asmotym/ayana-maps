import { DatabaseClient } from "../client";

export async function getTables(): Promise<Record<string, any>> {
    return await DatabaseClient.request('tables');
}