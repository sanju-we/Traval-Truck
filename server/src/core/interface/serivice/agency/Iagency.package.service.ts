import { PackageResDTO } from "../../../../core/DTO/agency/response/agency.packageDTO";
import { PackageDTO } from "../../../../core/DTO/agency/request/packageDTO";

export interface IAgencyPackageService{
  addPackage(data:PackageDTO,files:Express.Multer.File[], id:string):Promise<{ data: PackageResDTO[]; total: number; page: number; totalPages: number; }>;
  getAllPackage(
    page: number,
    limit?: number,
    search?: string,
    ownedBy?: string,
    price?: string,
    duration?: string,
    sortBy?: string
  ): Promise<{ data: PackageResDTO[]; total: number; page: number; totalPages: number; }>;
  updatePackage(id:string,data:PackageDTO,files:{ [fieldname: string]: Express.Multer.File[] }):Promise<PackageResDTO>;
  deleteImage(id:string,index:number):Promise<PackageResDTO>;
}