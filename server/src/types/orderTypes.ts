import { IUser } from "../core/interface/modelInterface/IUser";
import { IOrders } from "../core/interface/modelInterface/IOrders";
import { IPackage } from "../core/interface/modelInterface/Ipackage";
import { IRoomType } from "../core/interface/modelInterface/IRoomType";
import { IAgency } from "../core/interface/modelInterface/IAgency";
import { IHotel } from "../core/interface/modelInterface/IHotel";

export type PopulatedOrder = Omit<IOrders, 'product'> & {
  product: IPackage | IRoomType;
};

export type OrderWithDetails = Omit<IOrders, 'product'|'userId'|'ownedBy'> & {
  userId:IUser;
  ownedBy: IAgency | IHotel
  product: IPackage | IRoomType;
};