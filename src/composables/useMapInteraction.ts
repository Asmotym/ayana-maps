import { ref } from 'vue';
import type { Ref } from 'vue';
import type { LeafletMouseEvent, LatLng } from 'leaflet';

export function useMapInteraction(
  markersRefs: Ref<any[] | null>,
  mapFilters: Ref<any | null>
) {
  const dialogAddMarkerActive = ref<boolean>(false);
  const lastNewMarkerPosition = ref<LatLng | null>(null);

  function handleClick(event: LeafletMouseEvent) {
    // check if any of the following elements are valid:
    // - any marker popup are active
    // - map filters open
    // if so, we don't show the new marker popup
    const hasActivePopup = markersRefs.value?.filter((markerRef) => markerRef?.isPopupActive === true);
    const hasFiltersOpen = mapFilters.value?.isOpen;
    if ((hasActivePopup && hasActivePopup?.length > 0) || hasFiltersOpen) return;

    // show the new marker popup
    dialogAddMarkerActive.value = true;
    lastNewMarkerPosition.value = event.latlng;
  }

  return {
    dialogAddMarkerActive,
    lastNewMarkerPosition,
    handleClick
  };
} 