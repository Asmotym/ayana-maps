import { defineStore } from "pinia";
import { type MapMarker } from "../../../netlify/core/database/types";
import { api } from "../../database/api";
import { store } from "../index.store";
import { MapFiltersSection, type FiltersSection, type MarkerCategoryFilter } from "./map-filters.store";

export interface MapMarkersState {
    markers: MapMarker[];
    filteredMarkers: MapMarker[];
}

export const useMapMarkersStore = defineStore('map-markers', {
    state: (): MapMarkersState => ({ markers: [], filteredMarkers: [] }),
    actions: {
        async getAll(): Promise<MapMarker[]> {
            // get all markers
            this.markers = await api.mapMarkers.getMapMarkers();
            // update filtered marker
            await this.updateFilteredMarkers();
            return this.markers;
        },
        async insert(marker: MapMarker): Promise<void> {
            await api.mapMarkers.insertMapMarker(marker);
            await this.getAll();
        },
        async delete(marker: MapMarker): Promise<void> {
            await api.mapMarkers.deleteMapMarker(marker);
            await this.getAll();
        },
        async update(marker: MapMarker): Promise<void> {
            await api.mapMarkers.updateMapMarker(marker);
            await this.getAll();
        },
        async updateFilteredMarkers(): Promise<void> {
            if (!this.markers) return;
            const mapFiltersStore = store.mapFilters();
            const sectionIndex = mapFiltersStore.findFiltersSectionIndex(MapFiltersSection.CATEGORIES);
            const categoriesFiltersSection = mapFiltersStore.filters[sectionIndex].items[0].data as MarkerCategoryFilter[];
            const filteredMarkers = this.markers.filter(
                (marker) => {
                    const categoryFilterIndex = categoriesFiltersSection.findIndex(
                        (category) => category.name === marker.category_name
                    )
                    if (categoryFilterIndex === -1) return true;
                    return categoriesFiltersSection[categoryFilterIndex].active;
                }
            )

            this.$patch(() => {
                this.filteredMarkers = filteredMarkers;
            });
        }
    }
});