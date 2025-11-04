import { PackageDTO } from "../../../../core/DTO/agency/request/packageDTO.js";
import { Request, Response } from "express";

export interface IUserPackageController {
  getLatestPackage(req:Request,res:Response):Promise<void>;
  getAllPackage(req:Request,res:Response) : Promise<void>;
  getPackage(req:Request,res:Response) :Promise<void>
}