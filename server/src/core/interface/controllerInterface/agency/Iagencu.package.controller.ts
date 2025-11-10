import { Request, Response } from "express";

export interface IAgencyPackageController {
  addPackage(req:Request,res:Response):Promise<void>;
  getAllPackages(req:Request,res:Response):Promise<void>;
  updatePackage(req:Request,res:Response):Promise<void>;
}