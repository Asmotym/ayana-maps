import L from "leaflet";
import { MarkerCategoryMapping, type MapMarker } from '../../netlify/core/database/types';

type SizeExpression = { size: L.PointExpression, anchor: L.PointExpression };

const sizeSmall: SizeExpression = {
    size: [50, 50],
    anchor: [25, 25]
}
const sizeNormal: SizeExpression = {
    size: [60, 60],
    anchor: [30, 30]
}
const sizeBig: SizeExpression = {
    size: [80, 80],
    anchor: [40, 40]
}

const markerDefault = L.icon({
    iconUrl: '/assets/markers/default.svg',
    iconSize: sizeNormal.size,
    iconAnchor: sizeNormal.anchor,
})

const markerCity = L.icon({
    iconUrl: '/assets/markers/city.svg',
    iconSize: sizeNormal.size,
    iconAnchor: sizeNormal.anchor,
})

const markerVillage = L.icon({
    iconUrl: '/assets/markers/village.svg',
    iconSize: sizeNormal.size,
    iconAnchor: sizeNormal.anchor,
})

const markerCapital = L.icon({
    iconUrl: '/assets/markers/capital.svg',
    iconSize: sizeBig.size,
    iconAnchor: sizeBig.anchor,
})

const markerFortress = L.icon({
    iconUrl: '/assets/markers/fortress.svg',
    iconSize: sizeSmall.size,
    iconAnchor: sizeSmall.anchor,
})

const markerRuin = L.icon({
    iconUrl: '/assets/markers/ruin.svg',
    iconSize: sizeSmall.size,
    iconAnchor: sizeSmall.anchor,
})

const markerMine = L.icon({
    iconUrl: '/assets/markers/mine.svg',
    iconSize: sizeSmall.size,
    iconAnchor: sizeSmall.anchor,
})

const markerCavern = L.icon({
    iconUrl: '/assets/markers/cavern.svg',
    iconSize: sizeSmall.size,
    iconAnchor: sizeSmall.anchor,
})

export function getMarkerIconFromMarker(marker: MapMarker): L.Icon {
    switch (marker.category_id) {
        case MarkerCategoryMapping.City:
            return markerCity;
        case MarkerCategoryMapping.Village:
            return markerVillage;
        case MarkerCategoryMapping.Capital:
            return markerCapital;
        case MarkerCategoryMapping.Fortress:
            return markerFortress;
        case MarkerCategoryMapping.Ruin:
            return markerRuin;
        case MarkerCategoryMapping.Mine:
            return markerMine;
        case MarkerCategoryMapping.Cavern:
            return markerCavern;
        default:
            return markerDefault;
    }
}