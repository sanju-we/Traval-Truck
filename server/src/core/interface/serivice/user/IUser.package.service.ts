import { PackageResDTO } from "../../../../core/DTO/agency/response/agency.packageDTO.js";
import { PackageDTO } from "../../../../core/DTO/agency/request/packageDTO.js";

export interface IUserPackageService {
  getLatestPackage(): Promise<PackageResDTO[]>;
  getAllPackage(page: number, limit: number, search ?: string): Promise<{
    data: PackageResDTO[];
    total: number;
    page: number;
    totalPages: number;
  }>
  getPackage(id: string): Promise<PackageResDTO>
}