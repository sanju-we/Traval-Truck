import { IOrders } from "../../core/interface/modelInterface/IOrders.js";
import { BaseRepository } from "../../repositories/baseRepository.js";
import { Order } from "../../models/Orders.js";
import { IOrdersRepository } from "../../core/interface/repositorie/User/Iorders.repository.js";
import { logger } from "../../utils/logger.js";
import { toTripDTO, TripDTO } from "../../core/DTO/user/Response/user.trip.DTO.js";

export class OrderRepository extends BaseRepository<IOrders> implements IOrdersRepository{
  constructor(){
    super(Order)
  }

  async findAllByProduct(userId: string): Promise<TripDTO[]> {
      const data = await Order.find({userId:userId}).populate('product')
      logger.info(`sanju ${data}`)
      return data.map(toTripDTO)
  }

  async findOrderWithProduct(orderId: string): Promise<IOrders | null> {
    const data = await Order.findById(orderId).populate('product').populate('ownedBy')
    return data
  }

  async findOrderWithUser(orderId: string): Promise<IOrders | null> {
    const data = await Order.findById(orderId).populate('userId').populate('ownedBy')
    return data
  }
}