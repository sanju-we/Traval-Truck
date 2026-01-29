import { inject, injectable } from "inversify";
import { CouponDTO, toCouponDTO } from "../../core/DTO/admin/coupon/admin.coupon.response";
import { IAdminCouponService } from "../../core/interface/serivice/admin/IAdmin.coupon.service";
import { ICouponValidator } from "../../core/interface/validator/Icoupon.validator";
import { IAdminCouponRepository } from "../../core/interface/repositorie/admin/Iadmin.coupon.repository";
import { Data_Creation_Error, DataNotFoundError, DataUpdatingError } from "../../utils/resAndErrors";

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
    await this._couponValidator.addCouponValidator({...data,minPurchase:Number(data.minPurchase),discountValue:Number(data.discountValue)})
    const createdData = await this._couponRepository.create({...data,minPurchase:Number(data.minPurchase),discountValue:Number(data.discountValue)})
    if (createdData) return toCouponDTO(createdData)
    throw new Data_Creation_Error()
  }

  async updateCoupon(id: string, data: CouponDTO): Promise<CouponDTO> {
    await this._couponValidator.addCouponValidator({...data,discountValue:Number(data.discountValue)});
    await this._couponValidator.IdValidator(id);
    const update = await this._couponRepository.update(id, data);
    if (update) return toCouponDTO(update)
    throw new DataUpdatingError()
  }

  async updateCouponStatus(id: string): Promise<CouponDTO> {
    await this._couponValidator.IdValidator(id);
    const data = await this._couponRepository.findById(id)
    if (!data) throw new DataNotFoundError()
    const update = await this._couponRepository.update(id, { isActive: !data.isActive })
    if (update) return toCouponDTO(update)
    throw new DataUpdatingError()
  }
}