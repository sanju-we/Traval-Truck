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
exports.UserHotelsService = void 0;
const inversify_1 = require("inversify");
const roomsDTO_1 = require("../../core/DTO/hotel/roomsDTO");
const resAndErrors_1 = require("../../utils/resAndErrors");
const mongoose_1 = require("mongoose");
let UserHotelsService = class UserHotelsService {
    constructor(_hotelRoomRepo, _hotelAuthRepo, _subscriptionHistoryRepo, _paymentUtils, _orderRepo, _walletRepo) {
        this._hotelRoomRepo = _hotelRoomRepo;
        this._hotelAuthRepo = _hotelAuthRepo;
        this._subscriptionHistoryRepo = _subscriptionHistoryRepo;
        this._paymentUtils = _paymentUtils;
        this._orderRepo = _orderRepo;
        this._walletRepo = _walletRepo;
    }
    async getAllHotels(page, limit, search, minRating, sortBy) {
        const query = { search: search || '', status: 'Activity', minRating };
        const hotelsData = await this._hotelAuthRepo.findAllWithpagination(query, limit, page, sortBy);
        const checks = await Promise.all(hotelsData.data.map(async (hotel) => {
            const hotelId = hotel._id.toString();
            const hasSubscription = await this._subscriptionHistoryRepo.findOne({
                userId: hotelId,
                status: 'active',
                endDate: { $gt: new Date() }
            }, { sort: { createdAt: -1 } });
            const rooms = await this._hotelRoomRepo.findByHotelId(hotelId);
            console.log(`Hotel ID: ${hotelId}, Has Active Subscription: ${hasSubscription}, And rooms are ${rooms}`);
            if (hasSubscription && rooms.length > 0) {
                const hotelObj = hotel.toObject ? hotel.toObject() : hotel;
                return {
                    ...hotelObj,
                    id: hotelId,
                    PricePerNight: rooms[0].PricePerNight
                };
            }
            return null;
        }));
        console.log(checks);
        const result = checks.filter((h) => h !== null);
        return {
            data: result,
            totalCount: result.length,
            totalPage: Math.ceil(result.length / limit),
        };
    }
    async getRoomsByHotel(hotelId, searchParams) {
        const rooms = await this._hotelRoomRepo.findByHotelId(hotelId);
        let roomsDTOs = rooms.map(roomsDTO_1.toRoomsDTO);
        if (searchParams && searchParams.startDate && searchParams.endDate && searchParams.people) {
            const { startDate, endDate, people } = searchParams;
            const start = new Date(startDate);
            const end = new Date(endDate);
            const filteredRooms = await Promise.all(roomsDTOs.map(async (room) => {
                const requiredRooms = Math.ceil(people / room.Capacity);
                const orders = await this._orderRepo.findAll({
                    product: room.id,
                    status: { $in: ['Upcoming', 'Ongoing'] }
                }, {});
                const dateRange = [];
                const curr = new Date(start);
                while (curr < end) {
                    dateRange.push(new Date(curr));
                    curr.setDate(curr.getDate() + 1);
                }
                let maxBookedOnAnyDay = 0;
                dateRange.forEach(date => {
                    let bookedOnThisDay = 0;
                    orders.forEach(order => {
                        if (order.startDate && order.endDate) {
                            const oStart = new Date(order.startDate);
                            const oEnd = new Date(order.endDate);
                            if (date >= oStart && date < oEnd) {
                                const orderRooms = Math.ceil((order.people || 1) / room.Capacity);
                                bookedOnThisDay += orderRooms;
                            }
                        }
                    });
                    if (bookedOnThisDay > maxBookedOnAnyDay)
                        maxBookedOnAnyDay = bookedOnThisDay;
                });
                const remainingCount = (room.AvailableCount || 1) - maxBookedOnAnyDay;
                if (remainingCount >= requiredRooms) {
                    return { ...room, AvailableCount: remainingCount, requiredRooms };
                }
                return null;
            }));
            roomsDTOs = filteredRooms.filter(r => r !== null);
        }
        return roomsDTOs;
    }
    async getHotelDetails(hotelId) {
        const hotel = await this._hotelAuthRepo.findById(hotelId);
        if (!hotel)
            throw new resAndErrors_1.DataNotFoundError();
        return hotel;
    }
    async getRoom(id) {
        const data = await this._hotelRoomRepo.findPackageWithPartner(id);
        const room = await this._subscriptionHistoryRepo.findOne({
            userId: data.HotelId,
        });
        if (room)
            return data;
        throw new resAndErrors_1.DataNotFoundError();
    }
    async initializeSession(roomId, role, userId, amount, couponId, startDate, people, guestName, guestAge) {
        const room = await this._hotelRoomRepo.findById(roomId);
        if (!room)
            throw new resAndErrors_1.DataNotFoundError();
        const requiredRooms = Math.ceil(people / (room.Capacity || 1));
        const days = Math.round(amount / (room.PricePerNight * requiredRooms)) || 1;
        const date = new Date(startDate);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + days);
        if (requiredRooms > (room.AvailableCount || 1))
            throw new resAndErrors_1.ROOM_ALREADY_OCCUPAID();
        const orders = await this._orderRepo.findAll({
            product: roomId,
            status: { $in: ['Upcoming', 'Ongoing'] }
        }, {});
        if (orders.length > 0) {
            const curr = new Date(date);
            while (curr < endDate) {
                let bookedOnThisDay = 0;
                orders.forEach(order => {
                    if (order.startDate && order.endDate) {
                        const oStart = new Date(order.startDate);
                        const oEnd = new Date(order.endDate);
                        if (curr >= oStart && curr < oEnd) {
                            const orderRooms = Math.ceil((order.people || 1) / room.Capacity);
                            bookedOnThisDay += orderRooms;
                        }
                    }
                });
                if ((bookedOnThisDay + requiredRooms) > (room.AvailableCount || 1)) {
                    throw new resAndErrors_1.ROOM_ALREADY_OCCUPAID();
                }
                curr.setDate(curr.getDate() + 1);
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
                amount: amount.toString(),
                roomId,
                couponId,
                startDate,
                endDate: endDate.toISOString(),
                people: people.toString(),
                ...(guestName && { guestName }),
                ...(guestAge && { guestAge: guestAge.toString() })
            }
        });
    }
    async walletPurchase(roomId, role, userId, amount, couponId, startDate, people, guestName, guestAge) {
        const room = await this._hotelRoomRepo.findById(roomId);
        if (!room)
            throw new resAndErrors_1.DataNotFoundError();
        const orders = await this._orderRepo.findAll({ userId: userId }, {});
        const day = new Date();
        const today = orders.filter((order) => order.createdAt > day);
        let cancelCount = 0;
        for (let i = 0; i < today.length; i++) {
            if (today[i].status === 'cancelled')
                cancelCount++;
        }
        if (cancelCount >= 2)
            throw new resAndErrors_1.DataNotFoundError();
        const requiredRooms = Math.ceil(people / (room.Capacity || 1));
        if (requiredRooms > (room.AvailableCount || 1)) {
            return { success: false, message: 'Not enough rooms available' };
        }
        const wallet = await this._walletRepo.FindByUserId(userId);
        if (!wallet)
            throw new resAndErrors_1.DataNotFoundError();
        if (wallet.Balance < amount) {
            return { success: false, message: 'Insufficient wallet balance' };
        }
        const days = Math.round(amount / (room.PricePerNight * requiredRooms)) || 1;
        const checkIn = new Date(startDate);
        const endDate = new Date(checkIn);
        endDate.setDate(endDate.getDate() + days);
        const pad = (n) => n.toString().padStart(2, '0');
        const count = (await this._orderRepo.countDocuments({}) + 1).toString().padStart(6, '0');
        const date = new Date();
        const orderId = `ORD-${pad(date.getDate())}${pad(date.getMonth() + 1)}${date.getFullYear()}-${count}`;
        const orderData = await this._orderRepo.create({
            orderId: orderId,
            amount: amount,
            userId: new mongoose_1.Types.ObjectId(userId),
            productType: 'Rooms',
            role: 'Hotel',
            product: new mongoose_1.Types.ObjectId(roomId),
            people: people,
            guestName: guestName,
            guestAge: guestAge,
            ownedBy: room.HotelId.toString(),
            couponApplied: couponId || 'none',
            paymentType: 'wallet',
            startDate: checkIn.toISOString(),
            endDate: endDate.toISOString()
        });
        if (!orderData) {
            return { success: false, message: 'Failed to create booking order' };
        }
        wallet.Balance -= amount;
        const transaction = {
            Type: 'debit',
            Amount: amount,
            Description: `Booking of Room #${room.RoomNumber} with order ID ${orderId}`,
            Date: new Date(),
        };
        wallet.Transaction.push(transaction);
        await this._walletRepo.update(wallet.id, wallet);
        const adminWallet = await this._walletRepo.findOne({ role: 'admin' });
        if (adminWallet) {
            const adminTransaction = {
                Type: 'credit',
                Amount: amount,
                Description: `Room Booking amount ${amount} of ${orderId}.`,
                Date: new Date(),
                orderId: orderData._id.toString()
            };
            adminWallet.Transaction.push(adminTransaction);
            adminWallet.Balance += amount;
            await this._walletRepo.update(adminWallet._id.toString(), adminWallet);
        }
        return { success: true, message: 'Purchase successful' };
    }
};
exports.UserHotelsService = UserHotelsService;
exports.UserHotelsService = UserHotelsService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IHotelRoomsRepository')),
    __param(1, (0, inversify_1.inject)('IHotelAuthRepository')),
    __param(2, (0, inversify_1.inject)('ISubscriptionHistoryRepository')),
    __param(3, (0, inversify_1.inject)('IPaymentUtils')),
    __param(4, (0, inversify_1.inject)('IOrdersRepository')),
    __param(5, (0, inversify_1.inject)('IWalletRespository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], UserHotelsService);
