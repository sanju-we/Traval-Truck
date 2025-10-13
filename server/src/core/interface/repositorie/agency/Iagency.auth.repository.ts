import { IAgency } from '../../../../core/interface/modelInterface/IAgency.js';
import { IBaserepository } from '../IBaseRepositories.js';

export interface IAgencyRespository extends IBaserepository<IAgency> {
  updateAgencyPasswordById(id: string, hashedPassword: string): Promise<void>;
  findByIdAndUpdateAction(id: string, action: boolean, field: string): Promise<void>;
}
