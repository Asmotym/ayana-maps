import { useMarkerCategoriesStore } from './stores/marker-categories.store';
import { useMapMarkersStore } from './stores/map-markers.store';
import { useUserStore } from './stores/user.store';
import { useMapFiltersStore } from './stores/map-filters.store';

export const store = {
    markerCategories: useMarkerCategoriesStore,
    mapMarkers: useMapMarkersStore,
    user: useUserStore,
    mapFilters: useMapFiltersStore,
}