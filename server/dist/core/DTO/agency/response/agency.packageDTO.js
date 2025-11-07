export const toPackageResDTO = (pkg) => ({
    id: pkg._id.toString(),
    availableFoods: pkg.availableFoods || [],
    description: pkg.description || "",
    dining: pkg.dining || [],
    discoveries: pkg.discoveries || [],
    duration: pkg.duration || "",
    hotels: pkg.hotels || [],
    itinerary: pkg.itinerary || [],
    price: pkg.price || 0,
    title: pkg.title || "",
});
