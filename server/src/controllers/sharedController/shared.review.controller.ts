import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IReviewController } from "../../core/interface/controllerInterface/shared/Ishared.review.controller.js";
import { IReviewService } from "../../core/interface/serivice/shared/Ishared.review.service.js";
import { sendResponse } from "../../utils/resAndErrors.js";
import { STATUS_CODE } from "../../utils/HTTPStatusCode.js";
import { MESSAGES } from "../../utils/responseMessaages.js";

@injectable()
export class ReviewController implements IReviewController {
  constructor(
    @inject('IReviewService') private readonly _reviewService: IReviewService
  ) { }

  async addReview(req: Request, res: Response): Promise<void> {
    const data = req.body;
    const userId = req.user.id
    const orderId = req.params.id
    console.log(data)
    const review = await this._reviewService.create(userId, data, orderId)
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.APPROVED, review);
  }

  async getReview(req: Request, res: Response): Promise<void> {
    const orderId = req.query.orderId;
    const userId = req.user.id;
    const review = await this._reviewService.getReview(userId, String(orderId));
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.DATA_FOUND, review)
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const packageId = String(req.query.packageId);
    const currentPage = Number(req.query.currentPage);
    const reviewPerPage = Number(req.query.reviewPerPage);
    const filterRating = Number(req.query.filterRating);
    const response = await this._reviewService.getAll(packageId, currentPage, reviewPerPage, filterRating )
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.ALL_DATA_FOUND, response)
  }
}