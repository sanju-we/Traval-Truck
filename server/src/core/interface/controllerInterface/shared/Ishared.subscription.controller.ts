import { Request, Response } from "express";

export interface ISharedSubscriptionController {
  getAll(req: Request, res: Response): Promise<void>;
  getCurrent(req: Request, res: Response): Promise<void>;
  getCoupon(req: Request, res: Response): Promise<void>;
  initiateSubscription(req: Request, res: Response): Promise<void>;
  activate(req: Request, res: Response): Promise<void>;
}
