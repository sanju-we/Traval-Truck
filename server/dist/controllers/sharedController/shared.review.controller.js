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
import { sendResponse } from "../../utils/resAndErrors.js";
import { STATUS_CODE } from "../../utils/HTTPStatusCode.js";
import { MESSAGES } from "../../utils/responseMessaages.js";
let ReviewController = class ReviewController {
    _reviewService;
    constructor(_reviewService) {
        this._reviewService = _reviewService;
    }
    async addReview(req, res) {
        const data = req.body;
        const userId = req.user.id;
        const orderId = req.params.id;
        console.log(data);
        const review = await this._reviewService.create(userId, data, orderId);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.APPROVED, review);
    }
    async getReview(req, res) {
        const orderId = req.query.orderId;
        const userId = req.user.id;
        const review = await this._reviewService.getReview(userId, String(orderId));
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.DATA_FOUND, review);
    }
    async getAll(req, res) {
        const packageId = String(req.query.packageId);
        const currentPage = Number(req.query.currentPage);
        const reviewPerPage = Number(req.query.reviewPerPage);
        const filterRating = Number(req.query.filterRating);
        const response = await this._reviewService.getAll(packageId, currentPage, reviewPerPage, filterRating);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, response);
    }
    async getAllReviews(req, res) {
        const vendorId = req.user.id;
        const reviews = await this._reviewService.getAllReviews(vendorId);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, reviews);
    }
    async replayReview(req, res) {
        const data = req.body;
        const vendorId = req.user.id;
        const role = req.user.role;
        const updatedReview = await this._reviewService.replayReview(vendorId, data, role);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.UPDATED, updatedReview);
    }
    async getReplaysVendor(req, res) {
        const vendorId = req.user.id;
        const replays = await this._reviewService.getVendorReplays(vendorId);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, replays);
    }
    async getAllReplayUser(req, res) {
        const packageId = req.query.packageId;
        const replays = await this._reviewService.getReplaysUser(packageId);
        sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, replays);
    }
};
ReviewController = __decorate([
    injectable(),
    __param(0, inject('IReviewService')),
    __metadata("design:paramtypes", [Object])
], ReviewController);
export { ReviewController };
