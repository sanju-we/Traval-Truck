import { Router } from "express";
import { ISharedWalletController } from "../../core/interface/controllerInterface/shared/Ishared.wallet.controller.js";
import { container } from "../../core/DI/container.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

const walletRouter = Router()
const WalletController = container.get<ISharedWalletController>('ISharedWalletController')

walletRouter.get("/",asyncHandler(WalletController.getWallet.bind(WalletController)))
.post('/add-money',asyncHandler(WalletController.addMoney.bind(WalletController)))

export default walletRouter