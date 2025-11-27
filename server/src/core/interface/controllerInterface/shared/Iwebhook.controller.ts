import { Request, Response } from "express";

export interface IWebhookController {
  webHookHandler(req:Request,res:Response):Promise<void>;
}