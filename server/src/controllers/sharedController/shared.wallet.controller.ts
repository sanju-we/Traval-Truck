import { Request, Response } from "express";
import { ISharedWalletController } from "../../core/interface/controllerInterface/shared/Ishared.wallet.controller";
import { logger } from "../../utils/logger";
import { IWalletService } from "../../core/interface/serivice/shared/IWaller.service";
import { inject, injectable } from "inversify";
import { sendResponse } from "../../utils/resAndErrors";
import { STATUS_CODE } from "../../utils/HTTPStatusCode";
import { MESSAGES } from "../../utils/responseMessaages";

@injectable()
export class SharedWalletController implements ISharedWalletController {
  constructor(
    @inject('IWalletService') private readonly _walletService: IWalletService
  ) { }
  async getWallet(req: Request, res: Response): Promise<void> {
    const id = req.user.id
    const wallet = await this._walletService.getWallet(id)
    logger.info(wallet)
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.DATA_FOUND, wallet)
  }

  async addMoney(req: Request, res: Response): Promise<void> {
    const { paymentIntentId, amount } = req.body;
    const id = req.user.id
    const wallet = await this._walletService.addMoney(id, amount, paymentIntentId)
    logger.info(wallet)
    sendResponse(res, STATUS_CODE.OK, true, MESSAGES.PAYMENT_SUCCESS, wallet)
  }
}