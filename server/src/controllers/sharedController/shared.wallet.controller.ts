import { Request,Response } from "express";
import { ISharedWalletController } from "../../core/interface/controllerInterface/shared/Ishared.wallet.controller.js";
import { logger } from "../../utils/logger.js";
import { IWalletService } from "../../core/interface/serivice/shared/IWaller.service.js";
import { inject,injectable } from "inversify";
import { sendResponse } from "../../utils/resAndErrors.js";
import { STATUS_CODE } from "../../utils/HTTPStatusCode.js";
import { MESSAGES } from "../../utils/responseMessaages.js";

@injectable()
export class SharedWalletController implements ISharedWalletController{
  constructor(
    @inject('IWalletService') private readonly _walletService : IWalletService
  ){}
  async getWallet(req: Request, res: Response): Promise<void> {
      const id = req.user.id
      const wallet = await this._walletService.getWallet(id)
      sendResponse(res,STATUS_CODE.OK,true,MESSAGES.DATA_FOUND,wallet)
  }
}