import { foodDTO, toFoodDTO } from "../../core/DTO/restaurant/requestDTO.js";
import { foodType } from "../../types/restaurantType.js";
import { IRestaurantFoodService } from "../../core/interface/serivice/restaurant/Irestaurant.food.service.js";
import { IRestaurantFoodRespository } from "@core/interface/repositorie/restaurant/Irestaurant.food.repository.js";
import z from "zod";
import { singleUpload } from "../../utils/upload.cloudinary.js";
import { inject, injectable } from "inversify";
import { Data_Creation_Error, DataNotFoundError } from "../../utils/resAndErrors.js";
import { logger } from "../../utils/logger.js";

@injectable()
export class RestaurantFoodService implements IRestaurantFoodService {
  constructor(
    @inject('IRestaurantFoodRespository') private readonly _foodRepo: IRestaurantFoodRespository
  ) { }

  async addFood(data: foodType, files: Express.Multer.File[], id: string): Promise<foodDTO> {
    const foodTypeSchema = z.object({
      Name: z.string().min(1, "Name is required"),
      Description: z.string().min(1, "Description is required"),
      Price: z.number().positive("Price must be greater than 0"),
      AvailableQuantity: z.number().int().nonnegative("Quantity must be 0 or more"),
      Category: z.string().min(1, "Category is required"),
      Status:z.enum(['Available','Finish'], 'Invalid status choosen')
    });
    foodTypeSchema.parse(data)
    const image: string[] = []
    for (let data of files) {
      let url = await singleUpload(data, 'Travel-Truck-Document')
      image.push(url)
    }
    const created = await this._foodRepo.create({ ...data, Image: image, Restaurant: id })
    if (created) return toFoodDTO(created)
    throw new Data_Creation_Error()
  }

  async getAllData(id: string): Promise<foodDTO[]> {
    logger.info('nthuvaade')
    const allData = await this._foodRepo.findAll({ Restaurant: id }, {})
    if (allData) return allData.map(toFoodDTO)
    throw new DataNotFoundError()
  }

  async update(data: foodType, files: Express.Multer.File[]): Promise<foodDTO> {
      const foodTypeSchema = z.object({
      Name: z.string().min(1, "Name is required"),
      Description: z.string().min(1, "Description is required"),
      Price: z.number().positive("Price must be greater than 0"),
      AvailableQuantity: z.number().int().nonnegative("Quantity must be 0 or more"),
      Category: z.string().min(1, "Category is required"),
      Status:z.enum(['Available','Finish'], 'Invalid status choosen')
    });
    foodTypeSchema.parse(data)
    const image: string[] = []
    for (let data of files) {
      let url = await singleUpload(data, 'Travel-Truck-Document')
      image.push(url)
    }
    logger.info(data)
    const updateData = await this._foodRepo.update(data.id, data);
    updateData?.Image.push(...image)
    await updateData?.save()
    if (updateData) return toFoodDTO(updateData)
    throw new DataNotFoundError()
  }
}