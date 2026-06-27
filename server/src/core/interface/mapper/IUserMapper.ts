import { IOrderWithProduct, TripDTO, TripProductDTO, UserOrderDetailsDTO } from "../../../core/DTO/user/Response/user.trip.DTO";
import { subscriptionDTO } from "../../../core/DTO/subscription.dto";
import { ISubscriptions } from "../modelInterface/Isubscription";
import { IOrders } from "../modelInterface/IOrders";
import { IUser } from "../modelInterface/IUser";
import { userProfileDTO } from "../../../core/DTO/user/Response/user.profile";
import { IMindMap } from "../modelInterface/IMindMap";
import { MindMapResDTO } from "../../../core/DTO/user/Response/mindMap.res";
import { IUserRequest } from "../../../core/DTO/user/Request/user.sign";
import { IPackage } from "../modelInterface/Ipackage";
import { PackageDTO } from "../../../core/DTO/agency/request/packageDTO";
import { OrderWithDetails } from "../../../types/orderTypes";

export interface IUserMapper{
  toTripDTO(order: OrderWithDetails):Promise<TripDTO>;
  toPackageDTO(packages:IPackage):Promise<PackageDTO>;
  toUserOrderDetailsDTO(order: IOrders):Promise<UserOrderDetailsDTO>;
  mapTripProduct(order: IOrderWithProduct):Promise<TripProductDTO>;
  toUserProfileDTO(user: IUser):Promise<userProfileDTO>;
  toMindMapRes(mindMap: IMindMap):Promise<MindMapResDTO>;
  userSignupDTO(user: IUser):Promise<IUserRequest>;
}