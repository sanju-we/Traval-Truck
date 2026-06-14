import { IUserTripService } from "../../core/interface/serivice/user/IUser.trips.service";
import { IOrdersRepository } from "../../core/interface/repositorie/User/Iorders.repository";
import { inject, injectable } from "inversify";
import { DataNotFoundError } from "../../utils/resAndErrors";
import { TripDTO, UserOrderDetailsDTO, toUserOrderDetailsDTO } from "../../core/DTO/user/Response/user.trip.DTO";
import { logger } from "../../utils/logger";
import { orderDTO, toOrderDTO } from "../../core/DTO/agency/response/agency.order.DTO";
import { IBaseValidator } from "../../core/interface/validator/IBasic.validator";
import { IPaymentRepository } from "../../core/interface/repositorie/shared/Ishared.payment.repository";
import { IWalletRespository } from "../../core/interface/repositorie/shared/IWallet.repository";

@injectable()
export class UserTripService implements IUserTripService {
  constructor(
    @inject('IOrdersRepository') private readonly _ordersRepo: IOrdersRepository,
    @inject('IBaseValidator') private readonly _validator: IBaseValidator,
    @inject('IPaymentRepository') private readonly _paymentRepo: IPaymentRepository,
    @inject('IWalletRespository') private readonly _walletRepo: IWalletRespository
  ) { }

  async history(userId: string, page?: number, limit?: number): Promise<TripDTO[]> {
    await this._validator.idValidator(userId)
    const history = await this._ordersRepo.findAllByProduct(userId, page, limit)
    logger.info(`charle ${history}`)
    if (!history) throw new DataNotFoundError()
    return history
  }

  async getOrder(orderId: string): Promise<UserOrderDetailsDTO> {
    await this._validator.idValidator(orderId)
    const order = await this._ordersRepo.findOrderWithProduct(orderId);
    if (!order) throw new DataNotFoundError()
    return toUserOrderDetailsDTO(order)
  }

  async orderCancellation(orderId: string, reason: string): Promise<orderDTO> {
    logger.info(`orderId ${orderId}`)
    await this._validator.idValidator(orderId)
    const order = await this._ordersRepo.findById(orderId)
    if (!order) throw new DataNotFoundError()

    const userWallet = await this._walletRepo.findOne({ UserId: order.userId })
    if (!userWallet) throw new DataNotFoundError();

    const adminWallet = await this._walletRepo.findOne({ role: 'admin' })
    if (!adminWallet) throw new DataNotFoundError();

    const today = new Date()
    logger.info(`date difference : ${today.getDate() - order.createdAt.getDate()}`)
    const diff = (order.createdAt.getDate()) - (today.getDate())

    if (order.paymentType == 'wallet') {
      if (order.status == 'Upcoming' && !order.startDate && diff < 7) {
        userWallet.Balance += order.amount
        const userTransaction = {
          UserId: userWallet.UserId,
          Amount: order.amount,
          Type: 'credit',
          Description: `Refund for order cancellation of orderId ${order.orderId}`,
          Date: new Date()
        }
        userWallet.Transaction.push(userTransaction);
        await this._walletRepo.update(userWallet._id.toString(), userWallet!)
        order.status = 'Cancelled'
        order.reason = reason
        await this._ordersRepo.update(order._id.toString(), order)
        adminWallet.Balance -= order.amount
        const transaction = {
          UserId: adminWallet.UserId,
          Amount: -order.amount,
          Type: 'debit',
          Description: `Refund for order cancellation of orderId ${order.orderId}`,
          Date: new Date()
        }
        adminWallet.Transaction.push(transaction)
        await this._walletRepo.update(adminWallet._id.toString(), adminWallet!)
      } else {
        const returnAmount = order.amount * 0.20
        userWallet.Balance += returnAmount
        const transaction = {
          UserId: userWallet.UserId,
          Amount: returnAmount,
          Type: 'credit',
          Description: `Partial Refund for order cancellation of orderId ${order.orderId}`,
          Date: new Date()
        }
        userWallet.Transaction.push(transaction)
        await this._walletRepo.update(userWallet._id.toString(), userWallet!)
        order.status = 'Cancelled'
        order.reason = reason
        await this._ordersRepo.update(order._id.toString(), order)
        adminWallet.Balance -= returnAmount
        const adminTransaction = {
          UserId: adminWallet.UserId,
          Amount: -returnAmount,
          Type: 'debit',
          Description: `Partial Refund for order cancellation of orderId ${order.orderId}`,
          Date: new Date()
        }
        adminWallet.Transaction.push(adminTransaction)
        await this._walletRepo.update(adminWallet._id.toString(), adminWallet!)
      }
      return toOrderDTO(order)
    } else {
      const Transaction = await this._paymentRepo.findById(order.paymentId.toString())
      if (!Transaction) throw new DataNotFoundError();

      if (order.status == 'Upcoming' && !order.startDate && diff < 7) {
        userWallet.Balance += Transaction.amount
        const userTransaction = {
          UserId: userWallet.UserId,
          Amount: Transaction.amount,
          Type: 'credit',
          Description: `Refund for order cancellation of orderId ${order.orderId}`,
          Date: new Date()
        }
        userWallet.Transaction.push(userTransaction);
        await this._walletRepo.update(userWallet._id.toString(), userWallet!)
        order.status = 'Cancelled'
        order.reason = reason
        await this._ordersRepo.update(order._id.toString(), order)
        adminWallet.Balance -= Transaction.amount
        const transaction = {
          UserId: adminWallet.UserId,
          Amount: -Transaction.amount,
          Type: 'debit',
          Description: `Refund for order cancellation of orderId ${order.orderId}`,
          Date: new Date()
        }
        adminWallet.Transaction.push(transaction)
        await this._walletRepo.update(adminWallet._id.toString(), adminWallet!)
      } else {
        const returnAmount = Transaction.amount * 0.20
        userWallet.Balance += returnAmount
        const transaction = {
          UserId: userWallet.UserId,
          Amount: returnAmount,
          Type: 'credit',
          Description: `Partial Refund for order cancellation of orderId ${order.orderId}`,
          Date: new Date()
        }
        userWallet.Transaction.push(transaction)
        await this._walletRepo.update(userWallet._id.toString(), userWallet!)
        order.status = 'Cancelled'
        order.reason = reason
        await this._ordersRepo.update(order._id.toString(), order)
        adminWallet.Balance -= returnAmount
        const adminTransaction = {
          UserId: adminWallet.UserId,
          Amount: -returnAmount,
          Type: 'debit',
          Description: `Partial Refund for order cancellation of orderId ${order.orderId}`,
          Date: new Date()
        }
        adminWallet.Transaction.push(adminTransaction)
        await this._walletRepo.update(adminWallet._id.toString(), adminWallet!)
      }
      return toOrderDTO(order)
    }
  }
}