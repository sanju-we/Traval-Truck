import { IBaseValidator } from "../core/interface/validator/IBasic.validator.js";
import z from "zod";

export class BaseValidator implements IBaseValidator{
  async idValidator(id: string): Promise<void> {
    const schema = z.string()
    schema.parse(id)
  }

  async reviewValidator(data: { rate: number; comment: string; }): Promise<void> {
    const schema = z.object({
      rate:z.number().min(1,'Atleast 1 start is required').max(5,'Maximum 5 star is valid'),
      comment:z.string().min(5,'Comment atleast 5 letters is long')
    })
    schema.parse(data)
  }
}