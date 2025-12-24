export const toRoomsDTO = (Room) => ({
    id: Room._id.toString(),
    RoomNumber: Room.RoomNumber,
    Description: Room.Description,
    PricePerNight: Room.PricePerNight,
    Capacity: Room.Capacity,
    Facilities: Room.Facilities,
    images: Room.images,
    reviews: Room.reviews,
    Available: Room.AvailableCount,
    Status: Room.Status,
    CreatedAt: Room.CreatedAt,
    HotelId: Room.HotelId,
    isBlocked: Room.isBlocked
});
