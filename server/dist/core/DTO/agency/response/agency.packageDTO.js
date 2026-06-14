"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPackageResDTO = void 0;
const toPackageResDTO = (pkg) => ({
    id: pkg._id.toString(),
    availableFoods: pkg.availableFoods || [],
    description: pkg.description || "",
    discoveries: pkg.discoveries || [],
    duration: pkg.duration || "",
    itinerary: pkg.itinerary || [],
    price: pkg.price || 0,
    maxPeople: pkg.maxPeople || 0,
    title: pkg.title || "",
    images: pkg.images || [],
    ownedBy: pkg.ownedBy
});
exports.toPackageResDTO = toPackageResDTO;
