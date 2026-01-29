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
import { BADREQUEST, DataNotFoundError, DataUpdatingError } from "../../utils/resAndErrors";
import { buildOptimizedRoute, splitIntoDays, } from "../../utils/tripPlanner/index";
import { toMindMapRes } from "../../core/DTO/user/Response/mindMap.res";
import { validateTripPlan } from "../../services/Ai.service";
let UserMindMapService = class UserMindMapService {
    _baseValidator;
    _userAuth;
    _mindMapRepo;
    constructor(_baseValidator, _userAuth, _mindMapRepo) {
        this._baseValidator = _baseValidator;
        this._userAuth = _userAuth;
        this._mindMapRepo = _mindMapRepo;
    }
    async createMap(data, userId) {
        await this._baseValidator.idValidator(userId);
        await this._baseValidator.MindMapValidation(data);
        const user = await this._userAuth.findById(userId);
        if (!user)
            throw new DataNotFoundError();
        const days = (new Date(data.endDate).getDate() - new Date(data.startDate).getDate()) + 1;
        if (days <= 0)
            throw new BADREQUEST();
        let startLat, startLng;
        const loca = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(data.startPlace)}&key=${process.env.GOOGLE_MAPS_API_KEY}`);
        const startLoca = await loca.json();
        if (startLoca.status == 'OK') {
            const location = startLoca.results[0].geometry.location;
            startLat = location.lat,
                startLng = location.lng;
        }
        else
            throw new DataNotFoundError();
        const places = data.places.map(p => ({
            id: p.id,
            name: p.name,
            lat: p.lat,
            lng: p.lng
        }));
        const { route, totalDistance } = buildOptimizedRoute(startLat, startLng, places);
        const dayWaysSplit = splitIntoDays(route, days);
        const fuelCost = ((totalDistance / Number(data.milage)) * 100);
        const pad = (n) => n.toString().padStart(2, '0');
        const count = (await this._mindMapRepo.countDocuments() + 1).toString().padStart(6, '0');
        const date = new Date();
        const orderId = `ORD-${pad(date.getDate())}${pad(date.getMonth() + 1)}${date.getFullYear()}-${count}`;
        const aiValidationPayload = {
            route,
            totalDistanceKm: totalDistance,
            daysAvailable: days,
            drivingHoursPerDay: 6,
            vehicle: {
                type: data.vehicle,
                mileage: data.milage
            },
            fuelCost,
            people: Number(data.member),
            hotelClass: data.hotelTyep,
            foodPreference: data.food,
            estimatedFoodCost: Number(data.foodAmount)
        };
        const aiResult = await validateTripPlan(aiValidationPayload);
        const MindMap = {
            orderId,
            title: data.title,
            startDate: data.startDate,
            endDate: data.endDate,
            userId,
            places: data.places,
            startingPosition: {
                address: data.startPlace,
                lat: Number(startLat),
                lng: Number(startLng)
            },
            partners: Number(data.member),
            plan: dayWaysSplit,
            budget: aiResult.budget,
            timeAllocation: aiResult.timeAllocation,
            routeMetrics: {
                totalDistance,
                fuelCost,
                days
            },
            aiInsights: {
                feasibilityStatus: aiResult.tripValidationSummary.feasibilityStatus,
                feasibilityDetails: aiResult.tripValidationSummary.feasibilityDetails,
                dailyTravelDistanceReality: aiResult.tripValidationSummary.dailyTravelDistanceReality,
                dailyTravelDistanceDetails: aiResult.tripValidationSummary.dailyTravelDistanceDetails,
                budgetReliability: aiResult.tripValidationSummary.budgetReliability,
                budgetReliabilityDetails: aiResult.tripValidationSummary.budgetReliabilityDetails,
                risks: aiResult.tripValidationSummary.risks,
                improvements: aiResult.tripValidationSummary.improvements,
            }
        };
        let mindMap;
        console.log(data);
        if (!data.id) {
            mindMap = await this._mindMapRepo.create(MindMap);
        }
        else {
            mindMap = await this._mindMapRepo.update(data.id, MindMap);
        }
        if (!mindMap)
            throw new DataNotFoundError();
        return toMindMapRes(mindMap);
    }
    async getMaps(page, userId) {
        const maps = await this._mindMapRepo.findMapsWithPagination(userId, page);
        if (!maps)
            throw new DataNotFoundError();
        const data = {
            data: maps,
            page: page
        };
        return data;
    }
    async getMap(mapId) {
        await this._baseValidator.idValidator(mapId);
        const map = await this._mindMapRepo.findById(mapId);
        if (!map)
            throw new DataNotFoundError();
        return toMindMapRes(map);
    }
    async confirmMap(mapId) {
        await this._baseValidator.idValidator(mapId);
        const map = await this._mindMapRepo.findById(mapId);
        if (!map)
            throw new DataNotFoundError();
        if (map.status !== 'Draft')
            throw new BADREQUEST();
        map.status = 'Confirm';
        const updated = await this._mindMapRepo.update(mapId, { status: 'Confirm' });
        if (!updated)
            throw new DataUpdatingError();
        console.log('updated:', updated);
        return toMindMapRes(updated);
    }
};
UserMindMapService = __decorate([
    injectable(),
    __param(0, inject('IBaseValidator')),
    __param(1, inject('IAuthRepository')),
    __param(2, inject('IMindMapRepository')),
    __metadata("design:paramtypes", [Object, Object, Object])
], UserMindMapService);
export { UserMindMapService };
