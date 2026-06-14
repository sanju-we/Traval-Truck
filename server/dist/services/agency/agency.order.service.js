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
exports.AgencyOrderService = void 0;
const inversify_1 = require("inversify");
const agency_order_DTO_1 = require("../../core/DTO/agency/response/agency.order.DTO");
const resAndErrors_1 = require("../../utils/resAndErrors");
let AgencyOrderService = class AgencyOrderService {
    constructor(_orderRepo, _tripGenerator, _baseValidator, _walletRepo, _paymentRepo, _agencyRepo) {
        this._orderRepo = _orderRepo;
        this._tripGenerator = _tripGenerator;
        this._baseValidator = _baseValidator;
        this._walletRepo = _walletRepo;
        this._paymentRepo = _paymentRepo;
        this._agencyRepo = _agencyRepo;
    }
    async getAllOrder(userId, page = 1, limit = 5, search, status, price, sortBy) {
        const paginatedOrders = await this._orderRepo.findAllOrdersWithPagination(userId, page, limit, search, status, price, sortBy);
        return {
            data: paginatedOrders.data.map(agency_order_DTO_1.toOrderDTO),
            total: paginatedOrders.total,
            page: paginatedOrders.page,
            totalPages: paginatedOrders.totalPages
        };
    }
    async setStartDate(orderId, date) {
        const order = await this._orderRepo.findOrderWithProduct(orderId);
        if (!order)
            throw new resAndErrors_1.DataNotFoundError();
        const plan = await this._tripGenerator.generatePlanFromItinerary(order.product.itinerary, new Date(date));
        const updated = await this._orderRepo.update(order.id, { startDate: date, plan: plan, endDate: plan[plan.length - 1].date.toString() });
        if (!updated)
            throw new resAndErrors_1.DataUpdatingError();
        return (0, agency_order_DTO_1.toOrderDTO)(updated);
    }
    async getOrder(orderId) {
        const order = await this._orderRepo.findOrderWithProduct(orderId);
        if (!order)
            throw new resAndErrors_1.DataNotFoundError();
        return (0, agency_order_DTO_1.toOrderDTO)(order);
    }
    async startTrip(orderId) {
        await this._baseValidator.idValidator(orderId);
        const order = await this._orderRepo.findById(orderId);
        if (!order)
            throw new resAndErrors_1.DataNotFoundError();
        if (!order.startDate)
            throw new resAndErrors_1.START_DATE_ERROR();
        if (order.status !== 'Upcoming')
            throw new resAndErrors_1.TRIP_ALREADY_STARTED();
        order.status = 'Ongoing';
        order.tripProgress = {
            currentDay: 1,
            completedDays: [],
            startedAt: new Date()
        };
        const updated = await this._orderRepo.update(order._id.toString(), order);
        if (!updated)
            throw new resAndErrors_1.DataUpdatingError();
        return (0, agency_order_DTO_1.toOrderDTO)(updated);
    }
    async completeActivity(orderId, day, activityIndex) {
        await this._baseValidator.idValidator(orderId);
        const order = await this._orderRepo.findOrderWithProduct(orderId);
        if (!order || order.status !== "Ongoing" || !order.plan)
            throw new resAndErrors_1.DataNotFoundError();
        const planDay = order.plan.find((p) => p.day == day);
        if (!planDay)
            throw new resAndErrors_1.TRIP_UPDATION_ERROR();
        planDay.completedActivities ?? (planDay.completedActivities = []);
        if (!planDay.completedActivities.includes(activityIndex)) {
            planDay.completedActivities.push(activityIndex);
        }
        order.plan.find(p => {
            if (p.day == day) {
                p = planDay;
            }
        });
        await this._orderRepo.update(order._id.toString(), { plan: order.plan, tripProgress: order.tripProgress });
        return (0, agency_order_DTO_1.toOrderDTO)(order);
    }
    async completeDay(orderId, day) {
        await this._baseValidator.idValidator(orderId);
        const order = await this._orderRepo.findOrderWithProduct(orderId);
        if (!order || order.status !== "Ongoing" || !order.plan || !order.tripProgress)
            throw new resAndErrors_1.DataNotFoundError();
        const planDay = order.plan.find(p => p.day == day);
        if (!planDay)
            throw new resAndErrors_1.TRIP_UPDATION_ERROR();
        if (planDay.completedActivities.length != planDay.activities.length)
            throw new resAndErrors_1.TRIP_UPDATION_ERROR();
        planDay.isCompleted = true;
        order.tripProgress.completedDays.push(day);
        const nextDay = order.plan.find(p => !p.isCompleted);
        order.tripProgress.currentDay = nextDay ? nextDay.day : day;
        await this._orderRepo.update(order._id.toString(), { plan: order.plan, tripProgress: order.tripProgress });
        return (0, agency_order_DTO_1.toOrderDTO)(order);
    }
    async completeTrip(orderId) {
        await this._baseValidator.idValidator(orderId);
        const order = await this._orderRepo.findOrderWithProduct(orderId);
        if (!order || !order.plan || !order.tripProgress || order.status != 'Ongoing')
            throw new resAndErrors_1.DataNotFoundError();
        const allCompleted = order.plan.every(p => p.isCompleted);
        if (!allCompleted)
            throw new resAndErrors_1.INVALID_STATUS_UPDATION();
        order.status = 'Completed';
        order.tripProgress.completedAt = new Date();
        const adminWallet = await this._walletRepo.findOne({ role: 'admin' });
        if (!adminWallet)
            throw new resAndErrors_1.DataNotFoundError();
        const agency = await this._agencyRepo.findById(order.ownedBy.toString());
        if (!agency)
            throw new resAndErrors_1.DataNotFoundError();
        const agencyWallet = await this._walletRepo.findOne({ UserId: order.ownedBy.toString() });
        if (!agencyWallet)
            throw new resAndErrors_1.DataNotFoundError();
        const paymentHistory = await this._paymentRepo.findById(order.paymentId.toString());
        if (!paymentHistory)
            throw new resAndErrors_1.DataNotFoundError();
        const walletHistory = adminWallet.Transaction.find(T => T.paymentIntentId == paymentHistory.paymentIntentId);
        if (!walletHistory)
            throw new resAndErrors_1.DataNotFoundError();
        const agencyRevenue = walletHistory.Amount - (walletHistory.Amount * 0.30);
        const adminTransaction = {
            Type: 'debit',
            Amount: agencyRevenue,
            Description: `Trip completed revenue sended to the ${agency.companyName} From the Trip ${order.orderId}`,
            Date: new Date(),
            orderId: order._id.toString(),
        };
        adminWallet.Transaction.push(adminTransaction);
        adminWallet.Balance -= agencyRevenue;
        const agencyTransaction = {
            Type: 'credit',
            Amount: agencyRevenue,
            Description: `Trip completed Revenue Receved on Trip ${order.orderId}, Amount ₹${agencyRevenue}`,
            Date: new Date,
            orderId: order._id.toString()
        };
        agencyWallet.Transaction.push(agencyTransaction);
        agencyWallet.Balance += agencyRevenue;
        await this._walletRepo.update(adminWallet._id.toString(), adminWallet);
        await this._walletRepo.update(agencyWallet._id.toString(), agencyWallet);
        await this._orderRepo.update(order._id.toString(), { status: order.status, tripProgress: order.tripProgress });
        return (0, agency_order_DTO_1.toOrderDTO)(order);
    }
};
exports.AgencyOrderService = AgencyOrderService;
exports.AgencyOrderService = AgencyOrderService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)('IOrdersRepository')),
    __param(1, (0, inversify_1.inject)('IGenerateTrip')),
    __param(2, (0, inversify_1.inject)('IBaseValidator')),
    __param(3, (0, inversify_1.inject)('IWalletRespository')),
    __param(4, (0, inversify_1.inject)('IPaymentRepository')),
    __param(5, (0, inversify_1.inject)('IAgencyRespository')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], AgencyOrderService);
