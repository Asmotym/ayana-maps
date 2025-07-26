import { onMounted } from "vue";
import { store } from "../store/index.store";

export function useMapMarkers() {
    const mapMarkerStore = store.mapMarkers();
    const mapFiltersStore = store.mapFilters();

    async function handleFilteredMarkers() {
        await mapMarkerStore.updateFilteredMarkers();
        mapFiltersStore.$subscribe(async () => await mapMarkerStore.updateFilteredMarkers());
    }

    onMounted(async () => {
        await mapMarkerStore.getAll();
        await handleFilteredMarkers();
    })

    return {
        mapMarkerStore,
        mapFiltersStore,
    }
}