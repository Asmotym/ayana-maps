import type { HandlerEvent } from "@netlify/functions";
import type { DatabaseMapMarker } from "../../types/database.types";
import { sql } from "..";
import { createLogger } from "../../utils/logger";
import { getMarkerCategory } from "./marker_categories.table";

const logger = createLogger('Map Markers');

export async function mapMarkersQuery(event: HandlerEvent) {
    const body = JSON.parse(event.body || '{}');
    const data = body.data as { action: string, marker?: DatabaseMapMarker, id?: number } || undefined;

    logger.info(`Querying <action: ${logger.highlight(data?.action || 'undefined')}> <marker: ${JSON.stringify(data?.marker) || 'unknown'}> <id: ${logger.highlight(data?.id?.toString() || 'undefined')}>`);

    if (data === undefined) {
        throw new Error('No data provided');
    } else {
        const action = data.action;

        switch (action) {
            case 'getAll':
                return await getMapMarkers();
            case 'insert':
                return await insertMapMarker(data.marker as DatabaseMapMarker);
            case 'update':
                return await updateMapMarker(data.marker as DatabaseMapMarker);
            case 'delete':
                if (data.marker === undefined) {
                    throw new Error('Marker is required');
                }
                return await deleteMapMarker(data.marker.id as number);
            default:
                throw new Error(`Unknown action: ${action}`);
        }
    }
}

export async function insertMapMarker(marker: DatabaseMapMarker): Promise<DatabaseMapMarker> {
    // check if category_id is a valid category
    const category = await getMarkerCategory(marker.category_id as number);
    if (category === undefined) {
        throw new Error('Invalid category_id');
    }
    
    logger.info(`Marker Category found <category: ${logger.highlight(category.name)}>`);
    
    const result = await sql`INSERT INTO map_markers (x, y, label, description, category_id) VALUES (${marker.x}, ${marker.y}, ${marker.label}, ${marker.description}, ${marker.category_id})`;
    logger.info(`Inserted map marker <marker: ${logger.highlight(marker.id?.toString() || 'unknown')}>`);
    return result[0] as DatabaseMapMarker;
}

export async function updateMapMarker(marker: DatabaseMapMarker): Promise<DatabaseMapMarker> {
    // check if category_id is a valid category
    const category = await getMarkerCategory(marker.category_id as number);
    if (category === undefined) {
        throw new Error('Invalid category_id');
    }
    
    const result = await sql`UPDATE map_markers SET x = ${marker.x}, y = ${marker.y}, label = ${marker.label}, description = ${marker.description}, category_id = ${marker.category_id} WHERE id = ${marker.id}`;
    logger.info(`Updated map marker <marker: ${logger.highlight(marker.id?.toString() || 'unknown')}>`);
    return result[0] as DatabaseMapMarker;
}

export async function deleteMapMarker(id: number): Promise<void> {
    await sql`DELETE FROM map_markers WHERE id = ${id}`;
    logger.info(`Deleted map marker <marker: ${logger.highlight(id.toString())}>`);
}

export async function getMapMarkers(): Promise<DatabaseMapMarker[]> {
    const result = await sql`SELECT mm.id, mm.x, mm.y, mm.label, mm.description, mm.created_at, mm.category_id, mc.name as category_name FROM map_markers mm LEFT JOIN marker_categories mc ON mm.category_id = mc.id`;
    logger.info(`Fetched all map markers <count: ${logger.highlight(result.length.toString())}>`);
    return result as DatabaseMapMarker[];
}
