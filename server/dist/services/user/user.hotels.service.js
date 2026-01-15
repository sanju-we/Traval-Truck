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
import { DataNotFoundError, ROOM_ALREADY_OCCUPAID } from "../../utils/resAndErrors.js";
let UserHotelsService = class UserHotelsService {
    _hotelRoomRepo;
    _subscriptionHistoryRepo;
    _paymentUtils;
    _orderRepo;
    constructor(_hotelRoomRepo, _subscriptionHistoryRepo, _paymentUtils, _orderRepo) {
        this._hotelRoomRepo = _hotelRoomRepo;
        this._subscriptionHistoryRepo = _subscriptionHistoryRepo;
        this._paymentUtils = _paymentUtils;
        this._orderRepo = _orderRepo;
    }
    async getAllHotels(page, limit, search) {
        const status = '';
        const data = await this._hotelRoomRepo.findAllPackageWithPartners(page, status, limit, search);
        const checks = await Promise.all(data.data.map(async (pkg) => {
            const room = await this._subscriptionHistoryRepo.findOne({
                userId: pkg.HotelId,
            });
            return room ? pkg : null;
        }));
        const result = checks.filter((pkg) => pkg !== null);
        data.data = result;
        if (data)
            return data;
        throw new DataNotFoundError();
    }
    async getRoom(id) {
        const data = await this._hotelRoomRepo.findPackageWithPartner(id);
        const room = await this._subscriptionHistoryRepo.findOne({
            userId: data.HotelId,
        });
        if (room)
            return data;
        throw new DataNotFoundError();
    }
    async initializeSession(roomId, role, userId, amount, couponId, startDate) {
        const room = await this._hotelRoomRepo.findById(roomId);
        if (!room)
            throw new DataNotFoundError();
        const orders = await this._orderRepo.findAll({ product: roomId, status: { $in: ['Upcoming', 'Ongoing'] } }, {});
        console.log(orders);
        if (orders.length > 0) {
            const days = amount / room.PricePerNight;
            const date = new Date(startDate);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + days);
            function isDateRangeOverlapping(startA, endA, startB, endB) {
                return startA < endB && startB < endA;
            }
            for (const order of orders) {
                if (!order.startDate || !order.endDate)
                    continue;
                const isOverlap = isDateRangeOverlapping(date, endDate, new Date(order.startDate), new Date(order.endDate));
                if (isOverlap)
                    throw new ROOM_ALREADY_OCCUPAID();
            }
        }
        return this._paymentUtils.createCheckoutSession({
            amount: amount,
            currency: 'inr',
            description: `Room Number: ${room.RoomNumber}`,
            successUrl: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${process.env.FRONTEND_URL}/cancel`,
            metadata: {
                type: 'booking',
                userId,
                role,
                amount,
                roomId,
                couponId,
                startDate
            }
        });
    }
};
UserHotelsService = __decorate([
    injectable(),
    __param(0, inject('IHotelRoomsRepository')),
    __param(1, inject('ISubscriptionHistoryRepository')),
    __param(2, inject('IPaymentUtils')),
    __param(3, inject('IOrdersRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], UserHotelsService);
export { UserHotelsService };
