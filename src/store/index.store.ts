import { useMarkerCategoriesStore } from './stores/marker-categories.store';
import { useMapMarkersStore } from './stores/map-markers.store';

export const store = {
    markerCategories: (() => useMarkerCategoriesStore())(),
    mapMarkers: (() => useMapMarkersStore())(),
}