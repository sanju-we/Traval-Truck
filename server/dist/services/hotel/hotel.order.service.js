"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotelOrderService = void 0;
const inversify_1 = require("inversify");
const agency_order_DTO_1 = require("../../core/DTO/agency/response/agency.order.DTO");
const resAndErrors_1 = require("../../utils/resAndErrors");
let HotelOrderService = class HotelOrderService {
    constructor(_orderRepo, _baseValidator, _walletRepo, _paymentRepo) {
        this._orderRepo = _orderRepo;
        this._baseValidator = _baseValidator;
        this._walletRepo = _walletRepo;
        this._paymentRepo = _paymentRepo;
    }
    async getAllOrders(userId) {
        await this._baseValidator.idValidator(userId);
        const orders = await this._orderRepo.findAll({ ownedBy: userId }, {});
        return orders.map(agency_order_DTO_1.toOrderDTO);
    }
    async getOrder(orderId) {
        await this._baseValidator.idValidator(orderId);
        const order = await this._orderRepo.findOrderWithProduct(orderId);
        if (!order)
            throw new resAndErrors_1.DataNotFoundError();
        return (0, agency_order_DTO_1.toOrderDTO)(order);
    }
    async checkIn(orderId) {
        await this._baseValidator.idValidator(orderId);
        const order = await this._orderRepo.findById(orderId);
        if (!order || order.status == 'Completed' || order.status !== 'Upcoming')
            throw new resAndErrors_1.DataNotFoundError();
        order.status = 'Ongoing';
        await this._orderRepo.update(order._id.toString(), order);
        return { status: order.status };
    }
    async checkOut(orderId) {
        await this._baseValidator.idValidator(orderId);
        const order = await this._orderRepo.findById(orderId);
        if (!order || order.status != 'Ongoing')
            throw new resAndErrors_1.DataNotFoundError();
        let hotelWallet = await this._walletRepo.findOne({ UserId: order.ownedBy });
        const adminWallet = await this._walletRepo.findOne({ role: 'admin' });
        console.log(hotelWallet);
        if (!adminWallet)
            throw new resAndErrors_1.DataNotFoundError();
        if (!hotelWallet)
            hotelWallet = await this._walletRepo.create({
                UserId: order.ownedBy,
                Transaction: [],
                Balance: 0,
            });
        const vendorRevenue = order.amount - (order.amount * .30);
        const transaction = await this._paymentRepo.findById(order.paymentId.toString());
        if (!transaction)
            throw new resAndErrors_1.PAYMENT_VERIFICATOIN_FAILED();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endDate = new Date(order.endDate);
        endDate.setHours(0, 0, 0, 0);
        if (today < endDate)
            throw new resAndErrors_1.ROOM_VACATING_EARLY();
        if (today.toString() == order.endDate) {
            const hotelTransaction = {
                Type: 'credit',
                Amount: vendorRevenue,
                Description: `Revenue of the Room Booking ${order.orderId}`,
                Date: new Date(),
            };
            hotelWallet.Transaction.push(hotelTransaction);
            hotelWallet.Balance += vendorRevenue;
            await this._walletRepo.update(hotelWallet._id.toString(), hotelWallet);
            const adminTransaction = {
                Type: 'debit',
                Amount: vendorRevenue,
                Description: `Revenue of Room Booking of ${order.orderId}`,
                Date: new Date(),
            };
            adminWallet.Transaction.push(adminTransaction);
            adminWallet.Balance -= vendorRevenue;
            await this._walletRepo.update(adminWallet._id.toString(), adminWallet);
        }
        order.status = 'Completed';
        await this._orderRepo.update(order._id.toString(), order);
        return { status: order.status };
    }
};
exports.HotelOrderService = HotelOrderService;
exports.HotelOrderService = HotelOrderService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IOrdersRepository')),
    __param(1, (0, inversify_1.inject)('IBaseValidator')),
    __param(2, (0, inversify_1.inject)('IWalletRespository')),
    __param(3, (0, inversify_1.inject)('IPaymentRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], HotelOrderService);
