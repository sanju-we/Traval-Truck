export const toPackageResDTO = (pkg) => ({
    id: pkg._id.toString(),
    availableFoods: pkg.availableFoods || [],
    description: pkg.description || "",
    discoveries: pkg.discoveries || [],
    duration: pkg.duration || "",
    itinerary: pkg.itinerary || [],
    price: pkg.price || 0,
    title: pkg.title || "",
    images: pkg.images || []
});
