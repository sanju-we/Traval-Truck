import { Request, Response } from "express";

export interface IReviewController {
  addReview(req:Request, res:Response) : Promise<void>;
  getReview(req:Request, res:Response) : Promise<void>;
  getAll(req:Request, res:Response) : Promise<void>;
}