import { Router } from "express";
import { IHotelRoomsController } from "../../core/interface/controllerInterface/hotel/Ihotel.rooms.controller.js";
import { container } from "../../core/DI/container.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import upload from "../../middleware/multer.js";

const roomsRouter = Router()
const RoomsController = container.get<IHotelRoomsController>('IHotelRoomsController')

roomsRouter
.get('/getAllRooms',asyncHandler(RoomsController.rooms.bind(RoomsController)))
.get('/getRoom/:id',asyncHandler(RoomsController.getRoom.bind(RoomsController)))
.post('/addRooms', upload.fields([{name:'images',maxCount:10}]), asyncHandler(RoomsController.addRooms.bind(RoomsController)))

export default roomsRouter