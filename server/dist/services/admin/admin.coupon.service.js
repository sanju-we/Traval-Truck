var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { inject, injectable } from "inversify";
import { toCouponDTO } from "../../core/DTO/admin/coupon/admin.coupon.response";
import { Data_Creation_Error, DataNotFoundError, DataUpdatingError } from "../../utils/resAndErrors";
let AdminCouponService = class AdminCouponService {
    _couponValidator;
    _couponRepository;
    constructor(_couponValidator, _couponRepository) {
        this._couponValidator = _couponValidator;
        this._couponRepository = _couponRepository;
    }
    async getAllCoupon(page) {
        const data = await this._couponRepository.findAllCouponWithPagination(page ? page : 1);
        return data;
    }
    async addCoupon(data) {
        await this._couponValidator.addCouponValidator({ ...data, minPurchase: Number(data.minPurchase), discountValue: Number(data.discountValue) });
        const createdData = await this._couponRepository.create({ ...data, minPurchase: Number(data.minPurchase), discountValue: Number(data.discountValue) });
        if (createdData)
            return toCouponDTO(createdData);
        throw new Data_Creation_Error();
    }
    async updateCoupon(id, data) {
        await this._couponValidator.addCouponValidator({ ...data, discountValue: Number(data.discountValue) });
        await this._couponValidator.IdValidator(id);
        const update = await this._couponRepository.update(id, data);
        if (update)
            return toCouponDTO(update);
        throw new DataUpdatingError();
    }
    async updateCouponStatus(id) {
        await this._couponValidator.IdValidator(id);
        const data = await this._couponRepository.findById(id);
        if (!data)
            throw new DataNotFoundError();
        const update = await this._couponRepository.update(id, { isActive: !data.isActive });
        if (update)
            return toCouponDTO(update);
        throw new DataUpdatingError();
    }
};
AdminCouponService = __decorate([
    injectable(),
    __param(0, inject('ICouponValidator')),
    __param(1, inject('IAdminCouponRepository')),
    __metadata("design:paramtypes", [Object, Object])
], AdminCouponService);
export { AdminCouponService };
