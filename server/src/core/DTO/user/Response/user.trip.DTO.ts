import { Types } from "mongoose"
import { PackageDTO, toPackageDTO } from "../../../../core/DTO/agency/request/packageDTO.js"
import { IOrders } from "../../../../core/interface/modelInterface/IOrders.js"
import { IPackage } from "../../../../core/interface/modelInterface/Ipackage.js"
import { TripPlan } from "../../../../types/index.js"


export interface TripDTO {
  id: string
  orderId: string
  product: PackageDTO
  status: string,
  amount:number,
  plan: TripPlan[] | undefined
}

export interface Trip {
  _id: Types.ObjectId
  userId: string
  role: string
  product: IPackage
  amount: number
  orderId: string
  status: string
  paymentId: Types.ObjectId
  createdAt: Date
}

// export const toTrip = (order)

export const toTripDTO = (order: IOrders): TripDTO => ({
  id: order._id.toString(),
  orderId: order.orderId,
  product: toPackageDTO(order.product as any),
  amount:order.amount,
  status: order.status,
  plan : order.plan
})