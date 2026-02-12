import { IOrders } from "../../core/interface/modelInterface/IOrders";
import { BaseRepository } from "../../repositories/baseRepository";
import { Order } from "../../models/Orders";
import { IOrdersRepository } from "../../core/interface/repositorie/User/Iorders.repository";
import { logger } from "../../utils/logger";
import { IOrderWithProduct, toTripDTO, TripDTO } from "../../core/DTO/user/Response/user.trip.DTO";
import { IPackage } from "../../core/interface/modelInterface/Ipackage";
import { IRooms } from "../../core/interface/modelInterface/IRooms";

export class OrderRepository extends BaseRepository<IOrders> implements IOrdersRepository {
  constructor() {
    super(Order)
  }

  async findAllByProduct(userId: string, page?: number, limit?: number): Promise<TripDTO[]> {
    let query = Order.find({ userId: userId }).populate<{ product: IPackage | IRooms }>('product').sort({ createdAt: -1 })

    // Apply pagination if both page and limit are provided
    if (page !== undefined && limit !== undefined && limit > 0) {
      const skip = (page - 1) * limit
      query = query.skip(skip).limit(limit)
    }

    const data = await query
    console.log(data)
    return data.map(order => toTripDTO(order as IOrderWithProduct))
  }

  async findOrderWithProduct(orderId: string): Promise<IOrders | null> {
    const data = await Order.findById(orderId).populate('product').populate('ownedBy')
    return data
  }

  async findOrderWithUser(orderId: string): Promise<IOrders | null> {
    const data = await Order.findById(orderId).populate('userId').populate('ownedBy')
    return data
  }

  async findAllOrdersAdmin(): Promise<TripDTO[] | null> {
    const orders = await Order.find().populate('userId').populate('ownedBy').populate<{ product: IPackage | IRooms }>('product')
    return orders.map(order => toTripDTO(order as IOrderWithProduct))
  }
}