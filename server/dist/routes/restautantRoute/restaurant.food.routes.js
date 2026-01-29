import { Router } from "express";
import { container } from "../../core/DI/container";
import { asyncHandler } from "../../middleware/asyncHandler";
import upload from "../../middleware/multer";
const foodRouter = Router();
const foodController = container.get('IRestaurantFoodController');
foodRouter
    .get('/getFoods', asyncHandler(foodController.getAllFoods.bind(foodController)))
    .post('/addItem', upload.array('Image', 10), asyncHandler(foodController.addFood.bind(foodController)))
    .patch('/update', upload.array('Image', 10), asyncHandler(foodController.update.bind(foodController)))
    .patch('/deleteImage', asyncHandler(foodController.deleteImage.bind(foodController)));
export default foodRouter;
