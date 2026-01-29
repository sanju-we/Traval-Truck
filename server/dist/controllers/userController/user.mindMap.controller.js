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
import { sendResponse } from "../../utils/resAndErrors";
import { STATUS_CODE } from "../../utils/HTTPStatusCode";
import { MESSAGES } from "../../utils/responseMessaages";
let UserMindMapController = class UserMindMapController {
    _mindMapService;
    constructor(_mindMapService) {
        this._mindMapService = _mindMapService;
    }
    async create(req, res) {
        const body = req.body;
        const userId = req.user.id;
        const map = await this._mindMapService.createMap(body, userId);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.CREATED, map);
    }
    async getmap(req, res) {
        const page = req.query.page;
        const userId = req.user.id;
        const mindMaps = await this._mindMapService.getMaps(Number(page), userId);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, mindMaps);
    }
    async mindMap(req, res) {
        const mapId = req.query.id;
        const mindMap = await this._mindMapService.getMap(mapId);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.DATA_FOUND, mindMap);
    }
    async confirmMap(req, res) {
        const mapId = req.body.id;
        const updated = await this._mindMapService.confirmMap(mapId);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, updated);
    }
};
UserMindMapController = __decorate([
    injectable(),
    __param(0, inject('IUserMindMapService')),
    __metadata("design:paramtypes", [Object])
], UserMindMapController);
export { UserMindMapController };
