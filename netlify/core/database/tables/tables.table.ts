import { sql } from "..";

export async function tablesQuery(): Promise<Record<string, any>> {
    return await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
}