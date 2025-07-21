import * as markerCategoriesApi from './queries/marker-categories.query';
import * as mapMarkerApi from './queries/map-markers.query';
import * as userApi from './queries/users.query';

export const api = {
    markerCategories: markerCategoriesApi,
    mapMarkers: mapMarkerApi,
    user: userApi,
}
