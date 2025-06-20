import type { HandlerEvent } from "@netlify/functions";
import { sql } from "..";

export type MapMarker = {
    id?: number;
    x: number;
    y: number;
    label?: string | null;
    description?: string | null;
    created_at?: Date;
}

export async function mapMarkersQuery(event: HandlerEvent) {
    const body = JSON.parse(event.body || '{}');
    const data = body.data as { action: string, marker?: MapMarker, id?: number } || undefined;

    if (data === undefined) {
        throw new Error('No data provided');
    } else {
        const action = data.action;

        switch (action) {
            case 'getAll':
                return await getMapMarkers();
            case 'insert':
                return await insertMapMarker(data.marker as MapMarker);
            case 'update':
                return await updateMapMarker(data.marker as MapMarker);
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

export async function insertMapMarker(marker: MapMarker): Promise<MapMarker> {
    const result = await sql`INSERT INTO map_markers (x, y, label, description) VALUES (${marker.x}, ${marker.y}, ${marker.label}, ${marker.description})`;
    return result[0] as MapMarker;
}

export async function updateMapMarker(marker: MapMarker): Promise<MapMarker> {
    const result = await sql`UPDATE map_markers SET x = ${marker.x}, y = ${marker.y}, label = ${marker.label}, description = ${marker.description} WHERE id = ${marker.id}`;
    return result[0] as MapMarker;
}

export async function deleteMapMarker(id: number): Promise<void> {
    await sql`DELETE FROM map_markers WHERE id = ${id}`;
}

export async function getMapMarkers(): Promise<MapMarker[]> {
    const result = await sql`SELECT * FROM map_markers`;
    return result as MapMarker[];
}
