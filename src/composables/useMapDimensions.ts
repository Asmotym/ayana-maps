import { ref, computed, nextTick, onMounted, onBeforeUnmount, type Ref } from 'vue';
import mapUrl from '../assets/map.jpg';
import { useLogger } from 'vue-logger-plugin';
import { useUserAuthorization } from './useUserAuthorization';
import { store } from '../store/index.store';

export function useMapDimensions(
  loading: Ref<boolean, boolean>,
  mapRef: Ref<any | null>,
  containerRef: Ref<any | null>
) {
  const zoom = ref<number>(1);
  const mapWidth = ref<number>(0);
  const mapHeight = ref<number>(0);
  // const mapRef = ref<typeof LMap | null>(null);
  // const containerRef = ref<typeof VContainer | null>(null);
  const logger = useLogger();
  const mapMarkersStore = store.mapMarkers();

  const bounds = computed(() => [[0, 0], [mapHeight.value, mapWidth.value]] as [number, number][]);
  const center = computed(() => [mapHeight.value / 2, mapWidth.value / 2] as [number, number]);

  const { userAuthorized, loadUserAuthorization } = useUserAuthorization();

  async function loadMapDimensions(): Promise<void> {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.src = mapUrl;
      img.onload = () => {
        mapWidth.value = img.naturalWidth;
        mapHeight.value = img.naturalHeight;
        logger.info('Map dimensions loaded', mapWidth.value, mapHeight.value);
        resolve();
      }
    });
  }

  function updateMapDimensions(log: boolean = true) {
    const mainRef = document.querySelector('.v-main');
    if (mainRef && mapRef.value && containerRef.value) {
      const paddingTop = mainRef.computedStyleMap().get('padding-top') as { value: number, unit: string };
      const width = mainRef.clientWidth;
      const height = mainRef.clientHeight - paddingTop.value;
      if (log) {
        console.log('[Map] Updating map dimensions', {
          paddingTop: paddingTop.value,
          width,
          height,
          mainRef,
          containerRef
        });
      }
      mapRef.value.$el.setAttribute('style', `width: ${width}px; height: ${height}px; position: fixed !important;`);
    }
  }

  function setupResizeHandlers() {
    const handleResize = () => updateMapDimensions(true);
    window.addEventListener('resize', handleResize);
    
    // Set up interval for continuous updates
    const intervalId = setInterval(() => updateMapDimensions(false), 500);
    
    // Return cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(intervalId);
    };
  }

  let cleanup;

  onMounted(async () => {
    await nextTick();
    updateMapDimensions();

    // Setup resize handlers and get cleanup function
    cleanup = setupResizeHandlers();

    // setup map dimensions
    await loadMapDimensions();

    // load map markers
    await mapMarkersStore.getAll();

    // load user authorization
    await loadUserAuthorization();

    loading.value = false;

  })

  // Store cleanup function for onBeforeUnmount
  onBeforeUnmount(cleanup);

  return {
    zoom,
    mapWidth,
    mapHeight,
    bounds,
    center,
    loadMapDimensions,
    updateMapDimensions,
    setupResizeHandlers,
    userAuthorized
  };
} 