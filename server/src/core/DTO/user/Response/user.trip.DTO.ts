import { Types } from "mongoose"
import { PackageDTO, toPackageDTO } from "../../../../core/DTO/agency/request/packageDTO"
import { IOrders } from "../../../../core/interface/modelInterface/IOrders"
import { IPackage } from "../../../../core/interface/modelInterface/Ipackage"
import { TripPlan } from "../../../../types/index"
import { RoomsDTO, toRoomsDTO } from "../../../../core/DTO/hotel/roomsDTO"
import { IRooms } from "../../../../core/interface/modelInterface/IRooms"
// import FoodsDTO later

export type TripProductDTO =
  | { type: "Package"; data: PackageDTO }
  | { type: "Rooms"; data: RoomsDTO }

export interface IOrderWithProduct
  extends Omit<IOrders, "product"> {
  product: IPackage | IRooms
}

export const mapTripProduct = (
  order: IOrderWithProduct
): TripProductDTO => {
  switch (order.productType) {
    case "Package":
      return {
        type: "Package",
        data: toPackageDTO(order.product as IPackage)
      }

    case "Rooms":
      return {
        type: "Rooms",
        data: toRoomsDTO(order.product as IRooms)
      }

    default:
      throw new Error("Unsupported product type")
  }
}

export interface TripDTO {
  id: string
  orderId: string
  product: TripProductDTO
  status: string
  amount: number
  plan?: TripPlan[]
  startDate?: string
  endDate?: string
  productType:string
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

export const toTripDTO = (
  order: IOrderWithProduct
): TripDTO => ({
  id: order._id.toString(),
  orderId: order.orderId,
  product: mapTripProduct(order),
  amount: order.amount,
  status: order.status,
  plan: order.plan,
  startDate: order.startDate,
  endDate: order.endDate,
  productType:order.productType
})