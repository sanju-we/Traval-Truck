import { Router } from "express";
import { container } from "../../core/DI/container.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import upload from "../../middleware/multer.js";
const roomsRouter = Router();
const RoomsController = container.get('IHotelRoomsController');
roomsRouter
    .get('/getAllRooms', asyncHandler(RoomsController.rooms.bind(RoomsController)))
    .get('/getRoom/:id', asyncHandler(RoomsController.getRoom.bind(RoomsController)))
    .get('/getRoom/:id/edit', asyncHandler(RoomsController.getEditRoom.bind(RoomsController)))
    .post('/addRooms', upload.fields([{ name: 'images', maxCount: 10 }]), asyncHandler(RoomsController.addRooms.bind(RoomsController)))
    .patch('/updateStatus', asyncHandler(RoomsController.updateRoomStatus.bind(RoomsController)))
    .patch('/updateBlock', asyncHandler(RoomsController.updateBlock.bind(RoomsController)))
    .patch('/update/:id', upload.array('Images', 10), asyncHandler(RoomsController.updateRoom.bind(RoomsController)))
    .patch('/deleteImage/:id', asyncHandler(RoomsController.deleteSingleImage.bind(RoomsController)));
export default roomsRouter;
