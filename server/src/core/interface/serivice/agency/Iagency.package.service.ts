import { PackageResDTO } from "../../../../core/DTO/agency/response/agency.packageDTO.js";
import { PackageDTO } from "../../../../core/DTO/agency/request/packageDTO.js";

export interface IAgencyPackageService{
  addPackage(data:PackageDTO,files:{ [fieldname: string]: Express.Multer.File[] }):Promise<{ data: PackageResDTO[]; total: number; page: number; totalPages: number; }>;
  getAllPackage(page:number):Promise<{ data: PackageResDTO[]; total: number; page: number; totalPages: number; }>;
  updatePackage(id:string,data:PackageDTO,files:{ [fieldname: string]: Express.Multer.File[] }):Promise<PackageResDTO>;
}