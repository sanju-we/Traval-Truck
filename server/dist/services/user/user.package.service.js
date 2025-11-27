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
import { DataNotFoundError } from "../../utils/resAndErrors.js";
let UserPackageSerivce = class UserPackageSerivce {
    _packageRepo;
    _subscriptionHistoryRepo;
    constructor(_packageRepo, _subscriptionHistoryRepo) {
        this._packageRepo = _packageRepo;
        this._subscriptionHistoryRepo = _subscriptionHistoryRepo;
    }
    async getLatestPackage() {
        const data = await this._packageRepo.findAllPackageWithPartners(1);
        const checks = await Promise.all(data.data.map(async (pkg) => {
            const agency = await this._subscriptionHistoryRepo.findOne({
                userId: pkg.ownedBy,
            });
            return agency ? pkg : null;
        }));
        const result = checks.filter((pkg) => pkg !== null);
        if (data)
            return result;
        throw new DataNotFoundError();
    }
    async getAllPackage(page, limit, search) {
        const data = await this._packageRepo.findAllPackageWithPartners(page, limit, search);
        const checks = await Promise.all(data.data.map(async (pkg) => {
            const agency = await this._subscriptionHistoryRepo.findOne({
                userId: pkg.ownedBy,
            });
            return agency ? pkg : null;
        }));
        const result = checks.filter((pkg) => pkg !== null);
        data.data = result;
        if (data)
            return data;
        throw new DataNotFoundError();
    }
    async getPackage(id) {
        const data = await this._packageRepo.findPackageWithPartner(id);
        if (data)
            return data;
        throw new DataNotFoundError();
    }
};
UserPackageSerivce = __decorate([
    injectable(),
    __param(0, inject('IAgencyPackageRepository')),
    __param(1, inject('ISubscriptionHistoryRepository')),
    __metadata("design:paramtypes", [Object, Object])
], UserPackageSerivce);
export { UserPackageSerivce };
