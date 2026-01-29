"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toRoomsDTO = void 0;
const toRoomsDTO = (Room) => ({
    id: Room._id.toString(),
    RoomNumber: Room.RoomNumber,
    roomType: Room.roomType,
    Description: Room.Description,
    PricePerNight: Room.PricePerNight,
    Capacity: Room.Capacity,
    Facilities: Room.Facilities,
    images: Room.Images,
    reviews: Room.reviews,
    Available: Room.AvailableCount,
    Status: Room.Status,
    CreatedAt: Room.CreatedAt,
    HotelId: Room.HotelId,
    isBlocked: Room.isBlocked
});
exports.toRoomsDTO = toRoomsDTO;
