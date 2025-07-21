import { defineStore } from "pinia";
import { type MapMarker } from "../../../netlify/core/database/types";
import { api } from "../../database/api";

export interface MapMarkersState {
    markers: MapMarker[];
}

export const useMapMarkersStore = defineStore('map-markers', {
    state: (): MapMarkersState => ({ markers: [] }),
    actions: {
        async getAll(): Promise<void> {
            this.markers = await api.mapMarkers.getMapMarkers();
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
    }
});