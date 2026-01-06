import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IReviewController } from "../../core/interface/controllerInterface/shared/Ishared.review.controller.js";
import { IReviewService } from "../../core/interface/serivice/shared/Ishared.review.service.js";
import { sendResponse } from "../../utils/resAndErrors.js";
import { STATUS_CODE } from "../../utils/HTTPStatusCode.js";
import { MESSAGES } from "../../utils/responseMessaages.js";

@injectable()
export class ReviewController implements IReviewController{
  constructor(
    @inject('IReviewService') private readonly _reviewService : IReviewService
  ){}

  async addReview(req: Request, res: Response): Promise<void> {
    const data = req.body;
    const userId = req.user.id
    const packageId = req.params.id
    const review = await this._reviewService.create(userId,data,packageId)
    sendResponse(res,STATUS_CODE.OK,true,MESSAGES.APPROVED,review);
  }
}