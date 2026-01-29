import { Router } from "express";
import { container } from "../../core/DI/container";
import { asyncHandler } from "../../middleware/asyncHandler";
const walletRouter = Router();
const WalletController = container.get('ISharedWalletController');
walletRouter.get("/", asyncHandler(WalletController.getWallet.bind(WalletController)))
    .post('/add-money', asyncHandler(WalletController.addMoney.bind(WalletController)));
export default walletRouter;
