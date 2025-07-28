import { defineStore } from "pinia";
import type { DatabaseMarkerCategory } from "../../../netlify/core/types/database.types";
import { api } from "../../database/api";

export interface MarkerCategoriesState {
    markerCategories: DatabaseMarkerCategory[];
}

export const useMarkerCategoriesStore = defineStore('marker-categories', {
    state: (): MarkerCategoriesState => ({ markerCategories: [] }),
    actions: {
        async getAll(): Promise<DatabaseMarkerCategory[]> {
            this.markerCategories = await api.markerCategories.getMarkerCategories();
            return this.markerCategories;
        },
        async insertMarkerCategory(category: DatabaseMarkerCategory): Promise<void> {
            await api.markerCategories.insertMarkerCategory(category);
            await this.getAll();
        },
        async updateMarkerCategory(category: DatabaseMarkerCategory): Promise<void> {
            await api.markerCategories.updateMarkerCategory(category);
            await this.getAll();
        },
        async getMarkerCategory(id: number): Promise<DatabaseMarkerCategory> {
            const marker = this.markerCategories.filter((marker) => marker.id === id).shift();
            if (marker) return marker;
            
            return await api.markerCategories.getMarkerCategory(id);
        },
    },
});