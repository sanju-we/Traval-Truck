import { TripPlan } from "../../../../types/index.js"
import { IOrders } from "../../../../core/interface/modelInterface/IOrders.js"
import { PackageDTO } from "../request/packageDTO.js"
import { agencyProfileDTO } from "./agency.profile.js"

export interface orderDTO {
  id:string,
  userId:string,
  orderId:string,
  product : string | PackageDTO,
  amount : number,
  status:string,
  paymentId: any,
  startDate?:string,
  createdAt:Date,
  ownedBy?:string | agencyProfileDTO,
  reason?:string,
  plan?: TripPlan[]
}

export const toOrderDTO = (order:IOrders) : orderDTO => ({
  id : order._id.toString(),
  userId:order.userId.toString(),
  orderId:order.orderId,
  product: order.product && typeof order.product === 'object' ? JSON.parse(JSON.stringify(order.product)) : order.product,
  amount :order.amount,
  status:order.status,
  startDate:order.startDate,
  paymentId: order.paymentId && typeof order.paymentId === 'object' ? JSON.parse(JSON.stringify(order.paymentId)) : order.paymentId,
  createdAt:order.createdAt,
  ownedBy: order.ownedBy && typeof order.ownedBy === 'object' ? JSON.parse(JSON.stringify(order.ownedBy)) : order.ownedBy,
  reason:order.reason,
  plan:order.plan
})