import { PackageResDTO } from "../../../../core/DTO/agency/response/agency.packageDTO";
import { IPackage } from "../../../../core/interface/modelInterface/Ipackage";
import { IBaserepository } from "../IBaseRepositories";

export interface IAgencyPackageRepository extends IBaserepository<IPackage>{
  findAllPackageWithPartners(page:number,lim?:number,search?:string):Promise<{ data: PackageResDTO[], total: number, page: number, totalPages: number }>;
  findPackageWithPartner(id:string):Promise<PackageResDTO>;
}
