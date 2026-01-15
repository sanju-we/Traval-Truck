import { PackageDTO } from "../../../../core/DTO/agency/request/packageDTO";
import { Request, Response } from "express";

export interface IUserPackageController {
  getLatestPackage(req:Request,res:Response):Promise<void>;
  getAllPackage(req:Request,res:Response) : Promise<void>;
  getPackage(req:Request,res:Response) :Promise<void>;
  puchasePackage(req:Request,res:Response):Promise<void>;
  getCoupons(req:Request,res:Response) : Promise<void>;
}