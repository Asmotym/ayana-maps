import { defineStore, type Store, type StoreDefinition } from "pinia";
import type { DatabaseMarkerCategory } from '../../../netlify/core/types/database.types';
import { store } from "../index.store";

export interface FiltersSection<D = any> {
    title: string;
    name: string;
    items: FiltersSectionItem<D>[];
}

export interface FiltersSectionItem<D> {
    type: 'checkbox' | 'text' | 'subtitle';
    data: D,
}

export interface MarkerCategoryFilter extends DatabaseMarkerCategory {
    active: boolean;
}

export interface MapFiltersState {
    initialized: boolean;
    filters: FiltersSection[];
    // filters: {
    //     categories: MarkerCategoryFilter[],
    // },
}

export interface MapFiltersGetters {}

export interface MapFiltersActions {
    setupCategories(): Promise<void>;
    initialize(): Promise<void>;
    findFiltersSectionIndex(name: string): number;
}

export type MapFiltersStoreDefinition = StoreDefinition<'map-filters', MapFiltersState, MapFiltersGetters, MapFiltersActions>
export type MapFiltersStore = Store<'map-filters', MapFiltersState, MapFiltersGetters, MapFiltersActions>

export enum MapFiltersSection {
    CATEGORIES = 'categories',
}

export const useMapFiltersStore = defineStore('map-filters', {
    state: (): MapFiltersState => ({
        initialized: false,
        filters: [
            {
                title: 'Categories',
                name: MapFiltersSection.CATEGORIES,
                items: [
                    {
                        type: "checkbox",
                        data: [],
                    }
                ]
            } as FiltersSection<MarkerCategoryFilter[]>
        ],
    }),
    actions: {
        async setupCategories() {
            let markerCategories = await store.markerCategories().getAll() as MarkerCategoryFilter[];
            markerCategories = markerCategories.map((category) => ({ ...category, ...{ active: true } }));
            const categoriesSectionIndex = this.findFiltersSectionIndex(MapFiltersSection.CATEGORIES);
            if (categoriesSectionIndex > -1) {
                const filters = this.filters;
                filters[categoriesSectionIndex].items[0].data = markerCategories;
                this.$patch(() => {
                    this.filters = filters;
                });
            }
        },
        async initialize(): Promise<void> {
            // init marker categories filters
            await this.setupCategories();

            this.initialized = true;
        },
        findFiltersSectionIndex(name: string): number {
            const section = this.filters.findIndex((section) => section.name === name);
            return section;
        },
    },
}) as MapFiltersStoreDefinition;