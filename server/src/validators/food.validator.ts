import z from "zod";
import { IFoodValidator } from "../core/interface/validator/foodValidator";

export class FoodValidator implements IFoodValidator {
  async FoodValidator(name: string, description: string, price: number, availableQ: number, category: string, status:string): Promise<void> {
    const foodTypeSchema = z.object({
      name: z.string().min(1, "Name is required"),
      description: z.string().min(1, "Description is required"),
      price: z.number().positive("Price must be greater than 0"),
      availableQ: z.number().int().nonnegative("Quantity must be 0 or more"),
      status:z.enum(['Available', 'Finish']),
      category: z.string().min(1, "Category is required"),
    });
    foodTypeSchema.parse({name,description,price,availableQ,category,status})
  }
}