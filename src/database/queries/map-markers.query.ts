import { DatabaseClient } from "../client";
import { type MapMarker } from "../../../netlify/core/database/types";

export async function getMapMarkers(): Promise<MapMarker[]> {
    return await DatabaseClient.request('map_markers', { action: 'getAll' }) as MapMarker[];
}

export async function insertMapMarker(marker: MapMarker): Promise<Record<string, any>> {
    return await DatabaseClient.request('map_markers', { action: 'insert', marker });
}

export async function deleteMapMarker(marker: MapMarker): Promise<Record<string, any>> {
    return await DatabaseClient.request('map_markers', { action: 'delete', marker });
}

export async function updateMapMarker(marker: MapMarker): Promise<Record<string, any>> {
    return await DatabaseClient.request('map_markers', { action: 'update', marker });
}