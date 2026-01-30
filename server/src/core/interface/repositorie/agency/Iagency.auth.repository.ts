import { IAgency } from '../../../../core/interface/modelInterface/IAgency';
import { IBaserepository } from '../IBaseRepositories';

export interface IAgencyRespository extends IBaserepository<IAgency> {
  updateAgencyPasswordById(id: string, hashedPassword: string): Promise<void>;
  findByIdAndUpdateAction(
    id: string,
    action: boolean,
    field: string,
    reason?: string,
  ): Promise<void>;
  findAllWithpagination(query: { search: string; status: string }, limit: number, page: number): Promise<{ data: IAgency[]; total: number; totalPages: number }>;
}
