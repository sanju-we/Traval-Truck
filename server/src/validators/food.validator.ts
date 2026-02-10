import z from "zod";
import { IFoodValidator } from "../core/interface/validator/foodValidator";

export class FoodValidator implements IFoodValidator {
  async FoodValidator(name: string, description: string, price: number, availableQ: number, category: string): Promise<void> {
    const foodTypeSchema = z.object({
      Name: z.string().min(1, "Name is required"),
      Description: z.string().min(1, "Description is required"),
      Price: z.number().positive("Price must be greater than 0"),
      AvailableQuantity: z.number().int().nonnegative("Quantity must be 0 or more"),
      Category: z.string().min(1, "Category is required"),
    });
    foodTypeSchema.parse({name,description,price,availableQ,category,status})
  }
}