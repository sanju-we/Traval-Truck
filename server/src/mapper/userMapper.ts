import { OrderWithDetails } from "types/orderTypes";
import { PackageDTO } from "../core/DTO/agency/request/packageDTO";
import { RoomsDTO, toRoomsDTO } from "../core/DTO/hotel/roomsDTO";
import { IUserRequest } from "../core/DTO/user/Request/user.sign";
import { MindMapResDTO } from "../core/DTO/user/Response/mindMap.res";
import { userProfileDTO } from "../core/DTO/user/Response/user.profile";
import { IOrderWithProduct, mapTripProduct, TripDTO, TripProductDTO, UserOrderDetailsDTO } from "../core/DTO/user/Response/user.trip.DTO";
import { IUserMapper } from "../core/interface/mapper/IUserMapper";
import { IMindMap } from "../core/interface/modelInterface/IMindMap";
import { IOrders } from "../core/interface/modelInterface/IOrders";
import { IPackage } from "../core/interface/modelInterface/Ipackage";
import { IPayment } from "../core/interface/modelInterface/IPayment";
import { IRoomType } from "../core/interface/modelInterface/IRoomType";
import { ISubscriptions } from "../core/interface/modelInterface/Isubscription";
import { IUser } from "../core/interface/modelInterface/IUser";

export class UserMapper implements IUserMapper {
  async userSignupDTO(user: IUser): Promise<IUserRequest> {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phoneNumber,
      interesets: user.interest,
      role: user.role,
      isBlocked: user.isBlocked,
    }
  }

  
  async toUserProfileDTO(user: IUser): Promise<userProfileDTO> {
    return {
      id: user._id.toString(),
      name: user.name,
      userName: user.userName || 'Unknown',
      email: user.email,
      bio: user.bio,
      phoneNumber: user.phoneNumber,
      profilePicture: user.profilePicture,
      role: user.role,
      isBlocked: user.isBlocked,
      interest: user.interest,
    }
  }

  async toUserOrderDetailsDTO(order: IOrders): Promise<UserOrderDetailsDTO> {
    const payment = order.paymentId as unknown as IPayment | null;
    const productData = (order as unknown as OrderWithDetails).product;

    return {
      id: order._id.toString(),
      orderId: order.orderId,
      userId: order.userId.toString(),
      productType: order.productType,
      product: productData ? mapTripProduct(order as unknown as OrderWithDetails) : null,
      amount: order.amount,
      startDate: order.startDate,
      endDate: order.endDate,
      status: order.status,
      plan: order.plan,
      tripProgress: order.tripProgress,
      paymentId: {
        _id: payment?._id?.toString() || payment?.toString() || "",
        transactionId: payment?.paymentIntentId || payment?.sessionId || "N/A",
        paymentMethod: payment?.type || "Stripe",
        paymentStatus: payment?.status || "paid"
      },
      createdAt: order.createdAt,
      ownedBy: order.ownedBy,
      people: order.people,
      reason: order.reason,
      guestName: order.guestName,
      guestAge: order.guestAge
    }
  }
  
  async toPackageDTO(packages: IPackage): Promise<PackageDTO> {
    return {
      availableFoods: packages.availableFoods,
      description: packages.description,
      discoveries: packages.discoveries,
      duration: packages.duration,
      itinerary: packages.itinerary,
      price: packages.price,
      maxPeople: packages.maxPeople,
      title: packages.title,
      images: packages.images
    }
  }
  
  async toTripDTO(order: OrderWithDetails): Promise<TripDTO> {
    return {
      id: order._id.toString(),
      orderId: order.orderId,
      product: mapTripProduct(order),
      amount: order.amount,
      status: order.status,
      plan: order.plan,
      people: order.people,
      startDate: order.startDate,
      endDate: order.endDate,
      productType: order.productType,
      createdAt: order.createdAt
    }
  }

  async toMindMapRes(mindMap: IMindMap): Promise<MindMapResDTO> {
    return {
      id: mindMap._id.toString(),
      orderId: mindMap.orderId,
      title: mindMap.title,
      places: mindMap.places,
      aiInsights: mindMap.aiInsights,
      plan: mindMap.plan,
      partners: mindMap.partners,
      startDate: mindMap.startDate,
      endDate: mindMap.endDate,
      startingPosition: mindMap.startingPosition,
      routeMetrics: mindMap.routeMetrics,
      budget: mindMap.budget,
      status: mindMap.status,
      isPublic: mindMap.isPublic,
      tripProgress: mindMap.tripProgress,
      createdAt: mindMap.createdAt,
      updateAt: mindMap.updatedAt
    }
  }

  async mapTripProduct(order: IOrderWithProduct): Promise<TripProductDTO> {
    if (!order.product) {
      if (order.productType === "Package") {
        return {
          type: "Package",
          data: {} as PackageDTO
        };
      } else {
        return {
          type: "Rooms",
          data: {} as RoomsDTO
        };
      }
    }
    switch (order.productType) {
      case "Package":
        return {
          type: "Package",
          data: await this.toPackageDTO(order.product as IPackage)
        };

      case "Rooms":
        return {
          type: "Rooms",
          data: await toRoomsDTO(order.product as IRoomType)
        };

      default:
        throw new Error("Unsupported product type");
    }
  }
}