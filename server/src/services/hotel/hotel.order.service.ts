import { IHotelOrderService } from "../../core/interface/serivice/hotel/Ihotel.order.service";
import { inject, injectable } from "inversify";
import { IOrdersRepository } from "../../core/interface/repositorie/User/Iorders.repository";
import { orderDTO, toOrderDTO } from "../../core/DTO/agency/response/agency.order.DTO";
import { DataNotFoundError, DataUpdatingError, PAYMENT_VERIFICATOIN_FAILED, ROOM_VACATING_EARLY } from "../../utils/resAndErrors";
import { IBaseValidator } from "../../core/interface/validator/IBasic.validator";
import { IWalletRespository } from "../../core/interface/repositorie/shared/IWallet.repository";
import { IPaymentRepository } from "../../core/interface/repositorie/shared/Ishared.payment.repository";

@injectable()
export class HotelOrderService implements IHotelOrderService {
  constructor(
    @inject('IOrdersRepository') private readonly _orderRepo: IOrdersRepository,
    @inject('IBaseValidator') private readonly _baseValidator: IBaseValidator,
    @inject('IWalletRespository') private readonly _walletRepo: IWalletRespository,
    @inject('IPaymentRepository') private readonly _paymentRepo: IPaymentRepository,
  ) { }
  async getAllOrders(userId: string): Promise<orderDTO[]> {
    await this._baseValidator.idValidator(userId);
    const orders = await this._orderRepo.findAll({ ownedBy: userId }, {})
    return orders.map(toOrderDTO)
  }

  async getOrder(orderId: string): Promise<orderDTO> {
    await this._baseValidator.idValidator(orderId);
    const order = await this._orderRepo.findOrderWithProduct(orderId);
    if (!order) throw new DataNotFoundError();
    return toOrderDTO(order)
  }

  async checkIn(orderId: string): Promise<{ status: string; }> {
    await this._baseValidator.idValidator(orderId);
    const order = await this._orderRepo.findById(orderId);
    if (!order || order.status == 'Completed' || order.status !== 'Upcoming') throw new DataNotFoundError();

    order.status = 'Ongoing'
    await this._orderRepo.update(order._id.toString(), order)
    return { status: order.status }
  }

  async checkOut(orderId: string): Promise<{ status: string; }> {
    await this._baseValidator.idValidator(orderId);
    const order = await this._orderRepo.findById(orderId);
    if (!order || order.status != 'Ongoing') throw new DataNotFoundError();

    let hotelWallet = await this._walletRepo.findOne({UserId:order.ownedBy});
    const adminWallet = await this._walletRepo.findOne({ role: 'admin' });
    console.log(hotelWallet)
    if (!adminWallet) throw new DataNotFoundError();
    if(!hotelWallet) hotelWallet = await this._walletRepo.create({
      UserId:order.ownedBy,
      Transaction:[],
      Balance:0,
    })

    const vendorRevenue = order.amount - (order.amount * .30)

    const transaction = await this._paymentRepo.findById(order.paymentId.toString());
    if (!transaction) throw new PAYMENT_VERIFICATOIN_FAILED();

    const today = new Date()
    today.setHours(0, 0, 0, 0);

    const endDate = new Date(order.endDate);
    endDate.setHours(0, 0, 0, 0);

    if(today < endDate) throw new ROOM_VACATING_EARLY()
    if (today.toString() == order.endDate) {
      const hotelTransaction = {
        Type: 'credit',
        Amount: vendorRevenue,
        Description: `Revenue of the Room Booking ${order.orderId}`,
        Date: new Date(),
      }
      hotelWallet.Transaction.push(hotelTransaction);
      hotelWallet.Balance += vendorRevenue;
      await this._walletRepo.update(hotelWallet._id.toString(), hotelWallet)

      const adminTransaction = {
        Type: 'debit',
        Amount: vendorRevenue,
        Description: `Revenue of Room Booking of ${order.orderId}`,
        Date: new Date(),
      }
      adminWallet.Transaction.push(adminTransaction);
      adminWallet.Balance -= vendorRevenue;
      await this._walletRepo.update(adminWallet._id.toString(), adminWallet);
    }

    order.status = 'Completed'
    await this._orderRepo.update(order._id.toString(), order);
    return { status: order.status }
  }
}