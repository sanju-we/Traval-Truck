import { getDistanceInKm } from "./distance";
export function buildOptimizedRoute(startLat, startLng, places) {
    const unvisited = [...places];
    const route = [];
    let currentLat = startLat;
    let currentLng = startLng;
    let totalDistance = 0;
    // Visit all places
    while (unvisited.length > 0) {
        let nearestIndex = 0;
        let nearestDistance = Infinity;
        for (let i = 0; i < unvisited.length; i++) {
            const d = getDistanceInKm(currentLat, currentLng, unvisited[i].lat, unvisited[i].lng);
            if (d < nearestDistance) {
                nearestDistance = d;
                nearestIndex = i;
            }
        }
        const next = unvisited.splice(nearestIndex, 1)[0];
        totalDistance += nearestDistance;
        route.push(next);
        currentLat = next.lat;
        currentLng = next.lng;
    }
    if (route.length > 0) {
        const returnDistance = getDistanceInKm(currentLat, currentLng, startLat, startLng);
        totalDistance += returnDistance;
    }
    console.log('totalDistance:', totalDistance);
    return {
        route,
        totalDistance
    };
}
