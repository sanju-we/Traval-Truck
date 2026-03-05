import { Types } from "mongoose"
import { PackageDTO, toPackageDTO } from "../../../../core/DTO/agency/request/packageDTO"
import { IOrders } from "../../../../core/interface/modelInterface/IOrders"
import { IPackage } from "../../../../core/interface/modelInterface/Ipackage"
import { TripPlan } from "../../../../types/index"
import { RoomsDTO, toRoomsDTO } from "../../../../core/DTO/hotel/roomsDTO"
import { IRoomType } from "../../../interface/modelInterface/IRoomType"
// import FoodsDTO later

export type TripProductDTO =
  | { type: "Package"; data: PackageDTO }
  | { type: "Rooms"; data: RoomsDTO }

export interface UserOrderDetailsDTO {
  id: string;
  orderId: string;
  userId: string;
  productType: string;
  product: TripProductDTO;
  amount: number;
  startDate?: string;
  endDate?: string;
  status: string;
  plan?: TripPlan[];
  tripProgress?: any;
  paymentId: {
    _id: string;
    transactionId?: string;
    paymentMethod?: string;
    paymentStatus?: string;
  };
  createdAt: Date;
  ownedBy?: any;
  people?: number;
  reason?: string;
}

export interface IOrderWithProduct
  extends Omit<IOrders, "product"> {
  product: IPackage | IRoomType
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
        data: toRoomsDTO(order.product as IRoomType)
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
  people?: number
  startDate?: string
  endDate?: string
  productType: string
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
  people: order.people,
  startDate: order.startDate,
  endDate: order.endDate,
  productType: order.productType
})

export const toUserOrderDetailsDTO = (
  order: IOrders
): UserOrderDetailsDTO => {
  const payment = order.paymentId as any;
  return {
    id: order._id.toString(),
    orderId: order.orderId,
    userId: order.userId.toString(),
    productType: order.productType,
    product: mapTripProduct(order as unknown as IOrderWithProduct),
    amount: order.amount,
    startDate: order.startDate,
    endDate: order.endDate,
    status: order.status,
    plan: order.plan,
    tripProgress: order.tripProgress,
    paymentId: {
      _id: payment?._id?.toString() || payment?.toString(),
      transactionId: payment?.paymentIntentId || payment?.sessionId || "N/A",
      paymentMethod: payment?.type || "Stripe",
      paymentStatus: payment?.status || "paid"
    },
    createdAt: order.createdAt,
    ownedBy: order.ownedBy,
    people: order.people,
    reason: order.reason
  };
}