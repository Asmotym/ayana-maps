import type { MarkerCategory } from "../../../netlify/core/database/types";
import { DatabaseClient } from "../client";

export async function getMarkerCategories(): Promise<MarkerCategory[]> {
    return await DatabaseClient.request('marker_categories', {
        action: 'getAll'
    }) as MarkerCategory[];
}

export async function insertMarkerCategory(category: MarkerCategory): Promise<MarkerCategory> {
    return await DatabaseClient.request('marker_categories', {
        action: 'insert',
        category
    }) as MarkerCategory;
}

export async function updateMarkerCategory(category: MarkerCategory): Promise<MarkerCategory> {
    return await DatabaseClient.request('marker_categories', {
        action: 'update',
        category
    }) as MarkerCategory;
}

export async function getMarkerCategory(id: number): Promise<MarkerCategory> {
    return await DatabaseClient.request('marker_categories', {
        action: 'get',
        id
    }) as MarkerCategory;
}
