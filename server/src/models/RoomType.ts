import mongoose, { Schema } from "mongoose";
import { IRoomsDocument } from "../core/interface/modelInterface/IRoomType";

const RoomTypeSchema: Schema = new Schema({
  HotelId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Hotel"
  },
  RoomNumber: {
    type: Number,
    required: true
  },
  roomType: {
    type: String,
    required: true
  },
  Description: { type: String },
  PricePerNight: {
    type: Number,
    required: true
  },
  Capacity: {
    type: Number,
    required: true
  },
  Facilities: [{ type: String }],
  Images: [{ type: String }],
  isBlocked: { type: Boolean, default: false },
  Status: { type: String, default: "Available" },
  AvailableCount: { type: Number, default: 1 },
  reviews: [{
    Comment: String,
    CreatedAt: { type: Date, default: Date.now },
    Name: String,
    Rating: String,
    UserId: String
  }],
  createdAt: { type: Date, default: Date.now }
});

const RoomType = mongoose.model<IRoomsDocument>("Rooms", RoomTypeSchema);

export default RoomType;