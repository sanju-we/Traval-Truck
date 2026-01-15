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
import { logger } from "../../utils/logger.js";
import { toOrderDTO } from "../../core/DTO/agency/response/agency.order.DTO.js";
let UserTripService = class UserTripService {
    _ordersRepo;
    _validator;
    _paymentRepo;
    _walletRepo;
    constructor(_ordersRepo, _validator, _paymentRepo, _walletRepo) {
        this._ordersRepo = _ordersRepo;
        this._validator = _validator;
        this._paymentRepo = _paymentRepo;
        this._walletRepo = _walletRepo;
    }
    async history(userId) {
        await this._validator.idValidator(userId);
        const history = await this._ordersRepo.findAllByProduct(userId);
        logger.info(`charle ${history}`);
        if (!history)
            throw new DataNotFoundError();
        return history;
    }
    async getOrder(orderId) {
        await this._validator.idValidator(orderId);
        const order = await this._ordersRepo.findOrderWithProduct(orderId);
        if (!order)
            throw new DataNotFoundError();
        return toOrderDTO(order);
    }
    async orderCancellation(orderId, reason) {
        logger.info(`orderId ${orderId}`);
        await this._validator.idValidator(orderId);
        const order = await this._ordersRepo.findById(orderId);
        if (!order)
            throw new DataNotFoundError();
        const Transaction = await this._paymentRepo.findById(order.paymentId.toString());
        if (!Transaction)
            throw new DataNotFoundError();
        const today = new Date();
        logger.info(`date difference : ${today.getDate() - order.createdAt.getDate()}`);
        const diff = (order.createdAt.getDate()) - (today.getDate());
        const userWallet = await this._walletRepo.findOne({ UserId: order.userId });
        if (!userWallet)
            throw new DataNotFoundError();
        const adminWallet = await this._walletRepo.findOne({ role: 'admin' });
        if (!adminWallet)
            throw new DataNotFoundError();
        if (order.status == 'Upcoming' && !order.startDate && diff < 7) {
            userWallet.Balance += Transaction.amount;
            const userTransaction = {
                UserId: userWallet.UserId,
                Amount: Transaction.amount,
                Type: 'credit',
                Description: `Refund for order cancellation of orderId ${order.orderId}`,
                Date: new Date()
            };
            userWallet.Transaction.push(userTransaction);
            await this._walletRepo.update(userWallet._id.toString(), userWallet);
            order.status = 'Cancelled';
            order.reason = reason;
            await this._ordersRepo.update(order._id.toString(), order);
            adminWallet.Balance -= Transaction.amount;
            const transaction = {
                UserId: adminWallet.UserId,
                Amount: -Transaction.amount,
                Type: 'debit',
                Description: `Refund for order cancellation of orderId ${order.orderId}`,
                Date: new Date()
            };
            adminWallet.Transaction.push(transaction);
            await this._walletRepo.update(adminWallet._id.toString(), adminWallet);
        }
        else {
            const returnAmount = Transaction.amount * 0.20;
            userWallet.Balance += returnAmount;
            const transaction = {
                UserId: userWallet.UserId,
                Amount: returnAmount,
                Type: 'credit',
                Description: `Partial Refund for order cancellation of orderId ${order.orderId}`,
                Date: new Date()
            };
            userWallet.Transaction.push(transaction);
            await this._walletRepo.update(userWallet._id.toString(), userWallet);
            order.status = 'Cancelled';
            order.reason = reason;
            await this._ordersRepo.update(order._id.toString(), order);
            adminWallet.Balance -= returnAmount;
            const adminTransaction = {
                UserId: adminWallet.UserId,
                Amount: -returnAmount,
                Type: 'debit',
                Description: `Partial Refund for order cancellation of orderId ${order.orderId}`,
                Date: new Date()
            };
            adminWallet.Transaction.push(adminTransaction);
            await this._walletRepo.update(adminWallet._id.toString(), adminWallet);
        }
        return toOrderDTO(order);
    }
};
UserTripService = __decorate([
    injectable(),
    __param(0, inject('IOrdersRepository')),
    __param(1, inject('IBaseValidator')),
    __param(2, inject('IPaymentRepository')),
    __param(3, inject('IWalletRespository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], UserTripService);
export { UserTripService };
