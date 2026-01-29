"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDistanceInKm = getDistanceInKm;
function getDistanceInKm(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
    console.log(2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
