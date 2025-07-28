import type { HandlerEvent } from "@netlify/functions";
import { sql } from "..";
import type { DatabaseMarkerCategory } from "../../types/database.types";
import { createLogger } from "../../utils/logger";

const logger = createLogger('Marker Categories');

export async function getMarkerCategories(): Promise<DatabaseMarkerCategory[]> {
    const result = await sql`SELECT * FROM marker_categories`;
    logger.info(`Fetched all marker categories <count: ${logger.highlight(result.length.toString())}>`);
    return result as DatabaseMarkerCategory[];
}

export async function insertMarkerCategory(category: DatabaseMarkerCategory): Promise<DatabaseMarkerCategory> {
    const result = await sql`INSERT INTO marker_categories (name) VALUES (${category.name})`;
    logger.info(`Inserted marker category <category: ${logger.highlight(category.id?.toString() || 'unknown')}>`);
    return result[0] as DatabaseMarkerCategory;
}

export async function updateMarkerCategory(category: DatabaseMarkerCategory): Promise<DatabaseMarkerCategory> {
    const result = await sql`UPDATE marker_categories SET name = ${category.name} WHERE id = ${category.id}`;
    logger.info(`Updated marker category <category: ${logger.highlight(category.id?.toString() || 'unknown')}>`);
    return result[0] as DatabaseMarkerCategory;
}

export async function getMarkerCategory(id: number): Promise<DatabaseMarkerCategory> {
    const result = await sql`SELECT * FROM marker_categories WHERE id = ${id}`;
    logger.info(`Fetched marker category <category: ${logger.highlight(id.toString())}>`);
    return result[0] as DatabaseMarkerCategory;
}

export async function markerCategoriesQuery(event: HandlerEvent) {
    const body = JSON.parse(event.body || '{}');
    const data = body.data as { action: string, category?: DatabaseMarkerCategory, id?: number } || undefined;

    logger.info(`Querying <action: ${logger.highlight(data?.action || 'undefined')}> <category: ${logger.highlight(data?.category?.id?.toString() || 'undefined')}> <id: ${logger.highlight(data?.id?.toString() || 'undefined')}>`);

    if (data === undefined) {
        throw new Error('No data provided');
    }

    switch (data.action) {
        case 'getAll':
            return await getMarkerCategories();
        case 'insert':
            return await insertMarkerCategory(data.category as DatabaseMarkerCategory);
        case 'update':
            return await updateMarkerCategory(data.category as DatabaseMarkerCategory);
        case 'get':
            return await getMarkerCategory(data.id as number);
        default:
            throw new Error(`Unknown action: ${data.action}`);
    }
}