import { Router } from "express";
import { ISharedWalletController } from "../../core/interface/controllerInterface/shared/Ishared.wallet.controller";
import { container } from "../../core/DI/container";
import { asyncHandler } from "../../middleware/asyncHandler";

const walletRouter = Router()
const WalletController = container.get<ISharedWalletController>('ISharedWalletController')

walletRouter.get("/",asyncHandler(WalletController.getWallet.bind(WalletController)))
.get('/balance', asyncHandler(WalletController.getBalance.bind(WalletController)))
.post('/add-money',asyncHandler(WalletController.addMoney.bind(WalletController)))

export default walletRouter