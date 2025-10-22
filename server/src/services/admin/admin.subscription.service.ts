import { subscriptionData } from "types/index.js";
import { IAdminSubscriptionService } from "../../core/interface/serivice/admin/IAdmin.subscription.service.js";
import { inject, injectable } from "inversify";
import { IAdminSubscriptionRepository } from "../../core/interface/repositorie/admin/Iadmin.subscription.repository.js";
import { subscriptionDTO, toSubdcriptionDTO } from "../../core/DTO/subscription.dto.js";
import { InvalidAction, UserNotFoundError } from "../../utils/resAndErrors.js";
import { logger } from "../../utils/logger.js";

@injectable()
export class AdminSubscriptionService implements IAdminSubscriptionService {
  constructor(
    @inject('IAdminSubscriptionRepository') private readonly _adminSubscriptionRepo: IAdminSubscriptionRepository
  ) { }
  async addSub(data: subscriptionData): Promise<subscriptionDTO> {
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
      Valid: data.Valid
    }
    const created = await this._adminSubscriptionRepo.create(value)
    logger.info('data from the service', created)
    if (created) return toSubdcriptionDTO(created)
    throw new UserNotFoundError()
  }

  async getAllSubscriptions(): Promise<subscriptionDTO[]> {
    const datas = await this._adminSubscriptionRepo.findAllUser({}, {})
    logger.info('data comming from the repository is ', datas)
    if (datas) return datas.map(toSubdcriptionDTO)
    throw new UserNotFoundError()
  }

  async editSubscription(data: subscriptionData, id: string): Promise<subscriptionDTO> {
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
      Valid: data.Valid
    }
    logger.info('value that just before sending to the repo', value)
    const update = await this._adminSubscriptionRepo.update(id, value)
    if (update) return toSubdcriptionDTO(update)
    throw new UserNotFoundError()
  }

  async tonggleStatusService(id: string): Promise<subscriptionDTO> {
    const data = await this._adminSubscriptionRepo.findById(id)
    if (!data) throw new InvalidAction()
    const update = await this._adminSubscriptionRepo.update(id, { IsActive: !data.IsActive })
    if (!update) throw new InvalidAction()
    return toSubdcriptionDTO(update)
  }
}