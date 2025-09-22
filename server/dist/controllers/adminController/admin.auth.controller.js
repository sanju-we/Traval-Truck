"use strict";
// import { Request, Response } from "express";
// import { inject,injectable } from "inversify";
// import z from "zod";
// import { sendResponse } from "@utils/resAndErrors";
// import { logger } from "@utils/logger";
// import { STATUS_CODE } from "@utils/HTTPStatusCode";
// import { IJWT } from "@core/interface/JWT/JWTInterface";
// import { IController } from "@core/interface/controllerInterface/admin/IAuthController";
// @injectable()
// export class AdminAuthController implements IController{
//   constructor(
//     @inject('IJWT') private _IJWT :IJWT
//   ){}
//   async login(req: Request, res: Response): Promise<void> {
//       const schema = z.object({
//         email:z.string(),
//         password:z.string().min(8)
//       })
//       const {email,password} = schema.parse(req.body)
//       const isVerify = await this.
//   }
// }
