import { PackageResDTO } from "../../../../core/DTO/agency/response/agency.packageDTO";
import { CouponDTO } from "../../../../core/DTO/admin/coupon/admin.coupon.response";

export interface IUserPackageService {
  getLatestPackage(): Promise<PackageResDTO[]>;
  getAllPackage(page: number, limit: number, search?: string, price?: string, duration?: string, sortBy?: string): Promise<{data: PackageResDTO[];total: number;page: number;totalPages: number;}>
  getPackage(id: string): Promise<PackageResDTO>;
  initiativePurchase(packageId: string, userId: string, role: string, amount: number, couponId: string, maxPeople?: number): Promise<{ url: string; sessionId: string }>
  getAllCoupons(userId: string): Promise<CouponDTO[]>;
  walletPurchase(userId:string, productId:string, people:number, amount:number, productType:string, couponId?:string) : Promise<{ success: boolean; message: string }>;
}