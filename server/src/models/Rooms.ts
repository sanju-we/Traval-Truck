import mongoose,{ Schema } from "mongoose";
import { IRooms } from "../core/interface/modelInterface/IRooms";

const RoomsSchema: Schema = new Schema({
  RoomNumber: { type: Number },
  Name: { type: String },
  Description: { type: String },
  PricePerNight: { type: Number },
  Capacity: { type: Number },
  Facilities: [{ type: String,  }],
  Images: [{ type: String,  }],
  roomType:{type:String,enum:['single','double','villa']},
  Reviews: [{
     Comment: { type: String },
     CreatedAt: { type: Date },
     Name: { type: String },
     Rating: { type: String },
     UserId: { type: Schema.Types.ObjectId },
  }],
  Rating: {
     Average: { type: Number },
     Count: { type: Number },
  },
  AvailableCount: { type: Number },
  Status: { type: String, enum: [ 'Available', 'Occupid', 'Maintance' ] },
  CreatedAt: { type: Date },
  HotelId: { type: Schema.Types.ObjectId },
  isBlocked:{type:Boolean,default : false}
});

const Rooms = mongoose.model<IRooms>('Rooms', RoomsSchema);

export default Rooms;