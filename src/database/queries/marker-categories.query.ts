import type { DatabaseMarkerCategory } from "../../../netlify/core/types/database.types";
import { DatabaseClient } from "../client";

export async function getMarkerCategories(): Promise<DatabaseMarkerCategory[]> {
    return await DatabaseClient.request('marker_categories', {
        action: 'getAll'
    }) as DatabaseMarkerCategory[];
}

export async function insertMarkerCategory(category: DatabaseMarkerCategory): Promise<DatabaseMarkerCategory> {
    return await DatabaseClient.request('marker_categories', {
        action: 'insert',
        category
    }) as DatabaseMarkerCategory;
}

export async function updateMarkerCategory(category: DatabaseMarkerCategory): Promise<DatabaseMarkerCategory> {
    return await DatabaseClient.request('marker_categories', {
        action: 'update',
        category
    }) as DatabaseMarkerCategory;
}

export async function getMarkerCategory(id: number): Promise<DatabaseMarkerCategory> {
    return await DatabaseClient.request('marker_categories', {
        action: 'get',
        id
    }) as DatabaseMarkerCategory;
}
