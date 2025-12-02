import { IOrders } from "../../core/interface/modelInterface/IOrders.js";
import { BaseRepository } from "../../repositories/baseRepository.js";
import { Order } from "../../models/Orders.js";
import { IOrdersRepository } from "../../core/interface/repositorie/User/Iorders.repository.js";

export class OrderRepository extends BaseRepository<IOrders> implements IOrdersRepository{
  constructor(){
    super(Order)
  }
}