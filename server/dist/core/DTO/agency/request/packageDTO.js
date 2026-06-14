"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPackageDTO = void 0;
const toPackageDTO = (packages) => ({
    availableFoods: packages.availableFoods,
    description: packages.description,
    discoveries: packages.discoveries,
    duration: packages.duration,
    itinerary: packages.itinerary,
    price: packages.price,
    maxPeople: packages.maxPeople,
    title: packages.title,
    images: packages.images
});
exports.toPackageDTO = toPackageDTO;
