import { DatabaseClient } from "../client";

export async function getMapMarkers(): Promise<Record<string, any>> {
    return await DatabaseClient.request('map_markers', { action: 'getAll' });
}