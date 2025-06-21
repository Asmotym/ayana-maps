import { sql } from "..";

export async function versionQuery(): Promise<Record<string, any>> {
    return await sql`SELECT version()`;
}