import { Request, Response } from "express";
import { inject,injectable } from "inversify";
import { IUserMindMapController } from "../../core/interface/controllerInterface/user/IUser.mindMap.controller.js";
import { IUserMindMapService } from "../../core/interface/serivice/user/IUser.mindMap.service.js";
import { sendResponse } from "../../utils/resAndErrors.js";
import { STATUS_CODE } from "../../utils/HTTPStatusCode.js";
import { MESSAGES } from "../../utils/responseMessaages.js";
import { MindMapRequest } from "../../core/DTO/user/Request/mindMap.js";

@injectable()
export class UserMindMapController implements IUserMindMapController{
  constructor(
    @inject('IUserMindMapService') private readonly _mindMapService : IUserMindMapService
  ){}

  async create(req: Request, res: Response): Promise<void> {
    const body:MindMapRequest = req.body;
    const userId = req.user.id
    const map = await this._mindMapService.createMap(body,userId);
    sendResponse(res,STATUS_CODE.OK,true,MESSAGES.CREATED,map)
  }

  async getmap(req: Request, res: Response): Promise<void> {
    const page = req.query.page
    const userId = req.user.id
    const mindMaps = await this._mindMapService.getMaps(Number(page),userId);
    sendResponse(res,STATUS_CODE.OK,true,MESSAGES.ALL_DATA_FOUND,mindMaps);
  }
}