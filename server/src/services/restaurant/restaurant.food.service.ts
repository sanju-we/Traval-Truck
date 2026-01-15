import { foodDTO, toFoodDTO } from "../../core/DTO/restaurant/requestDTO";
import { foodType } from "../../types/restaurantType";
import { IRestaurantFoodService } from "../../core/interface/serivice/restaurant/Irestaurant.food.service";
import { IRestaurantFoodRespository } from "@core/interface/repositorie/restaurant/Irestaurant.food.repository";
import z from "zod";
import { deleteImage, extractPublicId, singleUpload } from "../../utils/upload.cloudinary";
import { inject, injectable } from "inversify";
import { Data_Creation_Error, DataNotFoundError } from "../../utils/resAndErrors";
import { logger } from "../../utils/logger";

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
    for (const data of files) {
      const url = await singleUpload(data, 'Travel-Truck-Document')
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
    for (const data of files) {
      const url = await singleUpload(data, 'Travel-Truck-Document')
      image.push(url)
    }
    logger.info(data)
    const updateData = await this._foodRepo.update(data.id, data);
    updateData?.Image.push(...image)
    await updateData?.save()
    if (updateData) return toFoodDTO(updateData)
    throw new DataNotFoundError()
  }

  async delete(productId: string, index: number): Promise<foodDTO> {
    const data = await this._foodRepo.findById(productId);
    if(!data)throw new DataNotFoundError();

    const publicId = extractPublicId(data.Image[index]);
    const deleted = await deleteImage(publicId)
    deleted && data.Image.splice(index,1) 
    await this._foodRepo.update(productId,data);
    return toFoodDTO(data)
  }
}