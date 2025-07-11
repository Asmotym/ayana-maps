import { defineStore } from "pinia";
import type { MarkerCategory } from "../../netlify/core/database/types";
import { getMarkerCategories } from "../database/queries/marker-categories.query";

export const useMarkerCategoriesStore = defineStore('marker-categories', {
    state: () => ({ markerCategories: [] as MarkerCategory[] }),
    actions: {
        async getAll() {
            this.markerCategories = await getMarkerCategories();
        }
    }
});