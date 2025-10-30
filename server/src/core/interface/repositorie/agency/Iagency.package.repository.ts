import { PackageResDTO } from "../../../../core/DTO/agency/response/agency.packageDTO.js";
import { IPackage } from "../../../../core/interface/modelInterface/Ipackage.js";
import { IBaserepository } from "../IBaseRepositories.js";

export interface IAgencyPackageRepository extends IBaserepository<IPackage>{
  findAllPackageWithPartners(page:number):Promise<{ data: PackageResDTO[], total: number, page: number, totalPages: number }>;
}
