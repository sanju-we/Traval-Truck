"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = require("../../core/DI/container");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const reviewRouter = (0, express_1.Router)();
const reviewController = container_1.container.get('IReviewController');
reviewRouter.post('/rating/:id', (0, asyncHandler_1.asyncHandler)(reviewController.addReview.bind(reviewController)))
    .get('/getReview', (0, asyncHandler_1.asyncHandler)(reviewController.getReview.bind(reviewController)))
    .get('/getAll', (0, asyncHandler_1.asyncHandler)(reviewController.getAll.bind(reviewController)))
    .get('/getAllReviews', (0, asyncHandler_1.asyncHandler)(reviewController.getAllReviews.bind(reviewController)))
    .post('/replayReview', (0, asyncHandler_1.asyncHandler)(reviewController.replayReview.bind(reviewController)))
    .get('/replaysForVendor', (0, asyncHandler_1.asyncHandler)(reviewController.getReplaysVendor.bind(reviewController)))
    .get('/allReplayForUser', (0, asyncHandler_1.asyncHandler)(reviewController.getAllReplayUser.bind(reviewController)));
exports.default = reviewRouter;
