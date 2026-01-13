import { Router } from "express";
import { IRestaurantFoodController } from "../../core/interface/controllerInterface/restaurant/Irestaurant.food.controller.js";
import { container } from "../../core/DI/container.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import upload from "../../middleware/multer.js";

const foodRouter = Router()
const foodController = container.get<IRestaurantFoodController>('IRestaurantFoodController')

foodRouter
  .get('/getFoods', asyncHandler(foodController.getAllFoods.bind(foodController)))
  .post('/addItem', upload.array('Image', 10), asyncHandler(foodController.addFood.bind(foodController)))
  .patch('/update', upload.array('Image', 10), asyncHandler(foodController.update.bind(foodController)))
  .patch('/deleteImage', asyncHandler(foodController.deleteImage.bind(foodController)))
  
export default foodRouter