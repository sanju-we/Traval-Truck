import { Router } from "express";
import { IReviewController } from "../../core/interface/controllerInterface/shared/Ishared.review.controller.js";
import { container } from "../../core/DI/container.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

const reviewRouter = Router()
const reviewController = container.get<IReviewController>('IReviewController')

reviewRouter.post('/rating/:id',asyncHandler(reviewController.addReview.bind(reviewController)))
.get('/getReview',asyncHandler(reviewController.getReview.bind(reviewController)))
.get('/getAll',asyncHandler(reviewController.getAll.bind(reviewController)))
.get('/getAllReviews',asyncHandler(reviewController.getAllReviews.bind(reviewController)))
.post('/replayReview',asyncHandler(reviewController.replayReview.bind(reviewController)))
.get('/replaysForVendor',asyncHandler(reviewController.getReplaysVendor.bind(reviewController)))

export default reviewRouter