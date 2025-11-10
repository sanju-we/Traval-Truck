import { inject, injectable } from "inversify";
import { CouponDTO, toCouponDTO } from "../../core/DTO/admin/coupon/admin.coupon.response.js";
import { IAdminCouponService } from "../../core/interface/serivice/admin/IAdmin.coupon.service.js";
import { ICouponValidator } from "../../core/interface/validator/Icoupon.validator.js";
import { IAdminCouponRepository } from "../../core/interface/repositorie/admin/Iadmin.coupon.repository.js";
import { Data_Creation_Error } from "../../utils/resAndErrors.js";

@injectable()
export class AdminCouponService implements IAdminCouponService {
  constructor(
    @inject('ICouponValidator') private readonly _couponValidator: ICouponValidator,
    @inject('IAdminCouponRepository') private readonly _couponRepository: IAdminCouponRepository
  ) { }

  async getAllCoupon(page?: number): Promise<{ data: CouponDTO[]; total: number; page: number; totalPages: number; }> {
    const data = await this._couponRepository.findAllCouponWithPagination(page ? page : 1)
    return data
  }

  async addCoupon(data: CouponDTO): Promise<CouponDTO> {
    await this._couponValidator.addCouponValidator(data)
    const createdData = await this._couponRepository.create(data)
    if (createdData) return toCouponDTO(createdData)
    throw new Data_Creation_Error()
  }
}