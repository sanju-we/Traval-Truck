import { FilterQuery } from "mongoose";
import { IOrders } from "../../core/interface/modelInterface/IOrders";
import { BaseRepository } from "../../repositories/baseRepository";
import { Order } from "../../models/Orders";
import { IOrdersRepository } from "../../core/interface/repositorie/User/Iorders.repository";
import { IPackage } from "../../core/interface/modelInterface/Ipackage";
import { IRoomType } from "../../core/interface/modelInterface/IRoomType";
import { Package } from "../../models/Package";
import { User } from "../../models/SUser";
import { OrderWithDetails, PopulatedOrder } from "../../types/orderTypes";
import { IUser } from "../../core/interface/modelInterface/IUser";
import { IAgency } from "../../core/interface/modelInterface/IAgency";
import { IHotel } from "../../core/interface/modelInterface/IHotel";

export class OrderRepository extends BaseRepository<IOrders> implements IOrdersRepository {
  constructor() {
    super(Order)
  }

  async findAllByProduct(userId: string, page?: number, limit?: number): Promise<OrderWithDetails[]> {
    let query = Order.find({ userId: userId })
      .populate<{ product: IPackage | IRoomType }>('product')
      .populate<{userId:IUser}>('userId')
      .populate<{ownedBy:IAgency | IHotel}>('ownedBy')
      .populate('ownedBy')
      .sort({ createdAt: -1 })

    if (page !== undefined && limit !== undefined && limit > 0) {
      const skip = (page - 1) * limit
      query = query.skip(skip).limit(limit)
    }

    const data = await query
    return data
  }

  async findOrderWithProduct(orderId: string): Promise<IOrders | null> {
    const data = await Order.findById(orderId)
      .populate('product')
      .populate('ownedBy')
      .populate('paymentId')
    return data
  }

  async findOrderWithUser(orderId: string): Promise<IOrders | null> {
    const data = await Order.findById(orderId)
      .populate('userId')
      .populate('ownedBy')
    return data
  }

  async findAllOrdersAdmin(): Promise<OrderWithDetails[]> {
    const orders = await Order.find()
      .populate<{ userId: IUser }>('userId')
      .populate<{ ownedBy: IAgency | IHotel }>('ownedBy')
      .populate<{ product: IPackage | IRoomType }>('product')
    return orders
  }

  async findAllOrdersWithPagination(
    agencyId: string,
    page = 1,
    limit = 5,
    search?: string,
    status?: string,
    price?: string,
    sortBy?: string
  ): Promise<{ data: IOrders[], total: number, page: number, totalPages: number }> {
    const filter: FilterQuery<IOrders> = { ownedBy: agencyId };

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (price && price !== 'All') {
      if (price === 'under_10k') {
        filter.amount = { $lt: 10000 };
      } else if (price === '10k_50k') {
        filter.amount = { $gte: 10000, $lte: 50000 };
      } else if (price === 'over_50k') {
        filter.amount = { $gt: 50000 };
      }
    }

    if (search && search.trim() !== '') {
      const regex = new RegExp(search, 'i');

      const [matchingPackages, matchingUsers] = await Promise.all([
        Package.find({
          $or: [
            { title: regex },
            { description: regex }
          ]
        }).select('_id').lean(),
        User.find({
          $or: [
            { name: regex },
            { email: regex }
          ]
        }).select('_id').lean()
      ]);

      const packageIds = matchingPackages.map(p => p._id);
      const userIds = matchingUsers.map(u => u._id);

      filter.$or = [
        { orderId: regex },
        { product: { $in: packageIds } },
        { userId: { $in: userIds } }
      ];
    }

    const sort: Record<string, 1 | -1> = {};
    if (sortBy) {
      if (sortBy === 'date_asc') sort.createdAt = 1;
      else if (sortBy === 'date_desc') sort.createdAt = -1;
      else if (sortBy === 'price_asc') sort.amount = 1;
      else if (sortBy === 'price_desc') sort.amount = -1;
    } else {
      sort.createdAt = -1;
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('product')
        .populate('userId')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      Order.countDocuments(filter)
    ]);

    return {
      data: orders,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }
}