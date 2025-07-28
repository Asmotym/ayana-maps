import type { DatabaseMapMarker } from "../../../netlify/core/types/database.types";
import { DatabaseClient } from "../client";

export async function getMapMarkers(): Promise<DatabaseMapMarker[]> {
    return await DatabaseClient.request('map_markers', { action: 'getAll' }) as DatabaseMapMarker[];
}

export async function insertMapMarker(marker: DatabaseMapMarker): Promise<Record<string, any>> {
    return await DatabaseClient.request('map_markers', { action: 'insert', marker });
}

export async function deleteMapMarker(marker: DatabaseMapMarker): Promise<Record<string, any>> {
    return await DatabaseClient.request('map_markers', { action: 'delete', marker });
}

export async function updateMapMarker(marker: DatabaseMapMarker): Promise<Record<string, any>> {
    return await DatabaseClient.request('map_markers', { action: 'update', marker });
}