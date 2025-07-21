import { defineStore } from "pinia";
import type { MarkerCategory } from "../../../netlify/core/database/types";
import { api } from "../../database/api";

export interface MarkerCategoriesState {
    markerCategories: MarkerCategory[];
}

export const useMarkerCategoriesStore = defineStore('marker-categories', {
    state: (): MarkerCategoriesState => ({ markerCategories: [] }),
    actions: {
        async getAll(): Promise<MarkerCategory[]> {
            this.markerCategories = await api.markerCategories.getMarkerCategories();
            return this.markerCategories;
        },
        async insertMarkerCategory(category: MarkerCategory): Promise<void> {
            await api.markerCategories.insertMarkerCategory(category);
            await this.getAll();
        },
        async updateMarkerCategory(category: MarkerCategory): Promise<void> {
            await api.markerCategories.updateMarkerCategory(category);
            await this.getAll();
        },
        async getMarkerCategory(id: number): Promise<MarkerCategory> {
            const marker = this.markerCategories.filter((marker) => marker.id === id).shift();
            if (marker) return marker;
            
            return await api.markerCategories.getMarkerCategory(id);
        },
    },
});