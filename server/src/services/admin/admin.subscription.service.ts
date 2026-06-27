import { subscriptionData } from 'types/index';
import { IAdminSubscriptionService } from '../../core/interface/serivice/admin/IAdmin.subscription.service';
import { inject, injectable } from 'inversify';
import { ISubscriptionRepository } from '../../core/interface/repositorie/ISubscription.respository';
import { subscriptionDTO } from '../../core/DTO/subscription.dto';
import { InvalidAction, UserNotFoundError } from '../../utils/resAndErrors';
import { logger } from '../../utils/logger';
import { ISubscriptionValidator } from '../../core/interface/validator/Isubscription.validator';
import { ISubscriptionMapper } from '../../core/interface/mapper/ISubscriptionMapper';

@injectable()
export class AdminSubscriptionService implements IAdminSubscriptionService {
  constructor(
    @inject('ISubscriptionMapper') private readonly _subscriptionMapper:ISubscriptionMapper,
    @inject('ISubscriptionRepository') private readonly _adminSubscriptionRepo: ISubscriptionRepository,
    @inject('ISubscriptionValidator') private readonly _subscriptionValidator : ISubscriptionValidator
  ) {}
  async addSub(data: subscriptionData): Promise<subscriptionDTO> {
    await this._subscriptionValidator.addSubscriptionValidator(data.Name,data.Amount,data.Category,data.Description,data.Duration,data.Features,data.Valid)
    const value = {
      Name: data.Name,
      Duration: {
        startingDate: new Date(data.Duration.startingDate),
        endingDate: new Date(data.Duration.endingDate),
      },
      Description: data.Description,
      Amount: data.Amount,
      Features: data.Features,
      Category: data.Category,
      Valid: data.Valid,
    };
    const created = await this._adminSubscriptionRepo.create(value);
    logger.info('data from the service', created);
    if (created) return await this._subscriptionMapper.toSubdcriptionDTO(created)
    throw new UserNotFoundError();
  }
  
  async getAllSubscriptions(): Promise<subscriptionDTO[]> {
    const datas = await this._adminSubscriptionRepo.findAll({}, {});
    logger.info('data comming from the repository is ', datas);
    if (datas) return Promise.all(
      datas.map((subs) => this._subscriptionMapper.toSubdcriptionDTO(subs))
    )
    throw new UserNotFoundError();
  }
  
  async editSubscription(data: subscriptionData, id: string): Promise<subscriptionDTO> {
    await this._subscriptionValidator.addSubscriptionValidator(data.Name,data.Amount,data.Category,data.Description,data.Duration,data.Features,data.Valid)
    const value = {
      Name: data.Name,
      Duration: {
        startingDate: new Date(data.Duration.startingDate),
        endingDate: new Date(data.Duration.endingDate),
      },
      Description: data.Description,
      Amount: data.Amount,
      Features: data.Features,
      Category: data.Category,
      Valid: data.Valid,
    };
    const update = await this._adminSubscriptionRepo.update(id, value);
    if (update) return await this._subscriptionMapper.toSubdcriptionDTO(update)
    throw new UserNotFoundError();
  }

  async tonggleStatusService(id: string): Promise<subscriptionDTO> {
    const data = await this._adminSubscriptionRepo.findById(id);
    if (!data) throw new InvalidAction();
    const update = await this._adminSubscriptionRepo.update(id, { IsActive: !data.IsActive });
    if (!update) throw new InvalidAction();
    return await this._subscriptionMapper.toSubdcriptionDTO(update)
  }
}
