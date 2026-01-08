import { Request, Response } from "express";

export interface IReviewController {
  addReview(req:Request, res:Response) : Promise<void>;
  getReview(req:Request, res:Response) : Promise<void>;
  getAll(req:Request, res:Response) : Promise<void>;
  getAllReviews(req:Request,res:Response) : Promise<void>;
  replayReview(req:Request,res:Response) : Promise<void>;
  getReplaysVendor(req:Request,res:Response) : Promise<void>;
}