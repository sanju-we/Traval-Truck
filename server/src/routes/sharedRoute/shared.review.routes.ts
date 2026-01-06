import { Router } from "express";
import { IReviewController } from "../../core/interface/controllerInterface/shared/Ishared.review.controller.js";
import { container } from "../../core/DI/container.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

const reviewRouter = Router()
const reviewController = container.get<IReviewController>('IReviewController')

reviewRouter.post('/rating/:id',asyncHandler(reviewController.addReview.bind(reviewController)))

export default reviewRouter