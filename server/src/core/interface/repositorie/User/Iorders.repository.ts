import { OrderWithDetails, PopulatedOrder } from "../../../../types/orderTypes";
import { IOrders } from "../../../../core/interface/modelInterface/IOrders";
import { IBaserepository } from "../IBaseRepositories";

export interface IOrdersRepository extends IBaserepository<IOrders> {
  findAllByProduct(userId: string, page?: number, limit?: number): Promise<OrderWithDetails[]>;
  findOrderWithProduct(orderId: string): Promise<IOrders | null>
  findOrderWithUser(orderId: string): Promise<IOrders | null>
  findAllOrdersAdmin(): Promise<OrderWithDetails[] | null>
  findAllOrdersWithPagination(
    agencyId: string,
    page: number,
    limit: number,
    search?: string,
    status?: string,
    price?: string,
    sortBy?: string
  ): Promise<{ data: IOrders[], total: number, page: number, totalPages: number }>;
}