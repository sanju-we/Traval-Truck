import { Router } from "express";
import { IReviewController } from "../../core/interface/controllerInterface/shared/Ishared.review.controller";
import { container } from "../../core/DI/container";
import { asyncHandler } from "../../middleware/asyncHandler";

const reviewRouter = Router()
const reviewController = container.get<IReviewController>('IReviewController')

reviewRouter.post('/rating/:id',asyncHandler(reviewController.addReview.bind(reviewController)))
.get('/getReview',asyncHandler(reviewController.getReview.bind(reviewController)))
.get('/getAll',asyncHandler(reviewController.getAll.bind(reviewController)))
.get('/getAllReviews',asyncHandler(reviewController.getAllReviews.bind(reviewController)))
.post('/replayReview',asyncHandler(reviewController.replayReview.bind(reviewController)))
.get('/replaysForVendor',asyncHandler(reviewController.getReplaysVendor.bind(reviewController)))
.get('/allReplayForUser',asyncHandler(reviewController.getAllReplayUser.bind(reviewController)))

export default reviewRouter