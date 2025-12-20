export const toPackageDTO = (packages) => ({
    availableFoods: packages.availableFoods,
    description: packages.description,
    discoveries: packages.discoveries,
    duration: packages.duration,
    itinerary: packages.itinerary,
    price: packages.price,
    title: packages.title,
    images: packages.images
});
