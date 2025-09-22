import { Request,Response } from "express";
import { inject,injectable } from "inversify";
import { IJWT } from "../../core/interface/JWT/JWTInterface.js";
import { sendResponse } from "../../utils/resAndErrors.js";
import { STATUS_CODE } from "../../utils/HTTPStatusCode.js";
import { IAuthRepository } from "@core/interface/repositorie/IAuth.Repository.js";
import z from "zod";
import { logger } from "../../utils/logger.js";
import { IUserProfileController } from "../../core/interface/controllerInterface/user/userProfile.js";
import { toUserProfileDTO } from "../../core/DTO/user/Response/user.profile.js";

@injectable()
export class ProfileController implements IUserProfileController{
  constructor(
    @inject("IJWT") private readonly _IJWT : IJWT,
    @inject("IAuthRepository") private _authRepository : IAuthRepository
  ){}
  async profile(req: Request, res: Response): Promise<void> {
    logger.info(`request recieved from the user`)
    const {id} = await this._IJWT.verify(req.cookies?.accessToken)
    const userData = await this._authRepository.findById(id)
    if(!userData) return sendResponse(res,STATUS_CODE.BAD_REQUEST,false,'User not found')
    const user = toUserProfileDTO(userData)
    sendResponse(res,STATUS_CODE.OK,true,'User profile found',user)
  }
}