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

import { IOrders } from "@core/interface/modelInterface/IOrders"

export interface orderDTO {
  id:string,
  userId:string,
  orderId:string,
  product : string,
  amount : number,
  status:string,
  paymentId:string,
  startDate?:string,
  createdAt:Date
}

export const toOrderDTO = (order:IOrders) : orderDTO => ({
  id : order._id.toString(),
  userId:order.userId.toString(),
  orderId:order.orderId,
  product:order.product.toString(),
  amount :order.amount,
  status:order.status,
  startDate:order.startDate,
  paymentId:order.paymentId.toString(),
  createdAt:order.createdAt
})