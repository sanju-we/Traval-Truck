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
import { buildOptimizedRoute, splitIntoDays, } from "../../utils/tripPlanner/index.js";
import { toMindMapRes } from "../../core/DTO/user/Response/mindMap.res.js";
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
        // create a validator for the mind map
        const user = await this._userAuth.findById(userId);
        if (!user)
            throw new DataNotFoundError();
        const days = (new Date(data.endDate).getDate() - new Date(data.startDate).getDate()) + 1;
        // start Date Lat and Lng find
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
        const route = buildOptimizedRoute(startLat, startLng, places);
        const dayWaysSplit = splitIntoDays(route, days);
        const pad = (n) => n.toString().padStart(2, '0');
        const count = (await this._mindMapRepo.countDocuments() + 1).toString().padStart(6, '0');
        const date = new Date();
        const orderId = `ORD-${pad(date.getDate())}${pad(date.getMonth() + 1)}${date.getFullYear()}-${count}`;
        const newMindMap = {
            orderId,
            title: data.title,
            startDate: data.startDate,
            endDate: data.endDate,
            places: data.places,
            startingPosition: data.startingPostition,
            userId: userId,
            plan: dayWaysSplit
        };
        const mindMap = await this._mindMapRepo.create(newMindMap);
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
};
UserMindMapService = __decorate([
    injectable(),
    __param(0, inject('IBaseValidator')),
    __param(1, inject('IAuthRepository')),
    __param(2, inject('IMindMapRepository')),
    __metadata("design:paramtypes", [Object, Object, Object])
], UserMindMapService);
export { UserMindMapService };
