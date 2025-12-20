import { IBaseValidator } from "../core/interface/validator/IBasic.validator.js";
import z from "zod";

export class BaseValidator implements IBaseValidator{
  async idValidator(id: string): Promise<void> {
    const schema = z.string()
    schema.parse(id)
  }
}