// _id: new ObjectId('6930515c685285fe7bdd646d'),
//   userId: new ObjectId('68d6f500634a89c53390addd'),
//   orderId: 'ORD-03122025-000001',
//   productType: 'Package',
//   role: 'Agency',
//   product: new ObjectId('69207e34d3dd73aa28f001b8'),
//   amount: 16000,
//   ownedBy: '690c272d512f70be56e54bd9',
//   status: 'Upcoming',
//   paymentId: new ObjectId('69305152685285fe7bdd6465'),
//   createdAt: 2025-12-03T15:03:56.661Z,
//   updatedAt: 2025-12-03T15:03:56.661Z,
//   __v: 0

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
  reason?:string
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
  reason:order.reason
})