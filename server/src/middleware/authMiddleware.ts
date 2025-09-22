// import { Request,Response,NextFunction } from "express";
// import { HttpError, sendResponse } from "../utils/resAndErrors.js";
// import { STATUS_CODE } from "../utils/HTTPStatusCode.js";
// import { User } from "../models/SUser.js";
// import jwt from "jsonwebtoken";
// import { logger } from "../utils/logger.js";
// const secret = process.env.JWT_SECRET || "my secret"

// export async function verifyToken (req:Request,res:Response,next:NextFunction){
//   try {
//     const authHeader = req.headers["authorization"];
//     const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : req.cookies?.accessToken 
//     const refreshToken = req.cookies?.refreshToken
//     logger.info(`refreshToken:${refreshToken}`)
//     if(!token) return sendResponse(res,STATUS_CODE.FORBIDDEN,false,"Access restricted, Login first")
//       const payload = jwt.verify(refreshToken, secret) as { id: string; email: string;role:string }
//     logger.info(`payload ${payload}`)
//     const user = await User.findById(payload.id)
//     logger.info(`requested user -> ${user}`)
//     payload.role === 'user' ? (req.body.user = user,next()) : sendResponse(res,STATUS_CODE.UNAUTHORIZED,false,"Invalid token")
//   } catch (error) {
//     const status = error instanceof HttpError ? error.statusCode : STATUS_CODE.BAD_REQUEST
//     const message = error instanceof Error ? error.message : "Unknown error"
//     logger.info(`Failed to check whether user is logged in nor message: ${message}`)
//     sendResponse(res, status, false, message)
//   }
// }

import { Request, Response, NextFunction } from "express";
import { HttpError, sendResponse } from "../utils/resAndErrors.js";
import { STATUS_CODE } from "../utils/HTTPStatusCode.js";
import { User } from "../models/SUser.js";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger.js";

const secret = process.env.JWT_SECRET || "Travel_Truck_@321";

export async function verifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : req.cookies?.accessToken 
    logger.info(`Token received from middleware->verifyToken : ${token}`);

    if (!token) {
      return sendResponse(res, STATUS_CODE.FORBIDDEN, false, "Access restricted, login first");
    }

    logger.info(`payload gotit`)
    const payload = jwt.verify(token, secret) as { id: string; email: string; role: string };
    if(!payload) return sendResponse(res,STATUS_CODE.FORBIDDEN,false,"Token expired")
    logger.info(`payload: ${JSON.stringify(payload)}`);

    const user = await User.findById(payload.id);
    if (!user) {
      return sendResponse(res, STATUS_CODE.UNAUTHORIZED, false, "User not found");
    }

    if (payload.role !== "user") {
      return sendResponse(res, STATUS_CODE.UNAUTHORIZED, false, "Invalid token role");
    }

    // ✅ attach user to req.user (not req.body)
    (req as any).user = user;

    next();
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : STATUS_CODE.FORBIDDEN;
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error(`Failed to verify token: ${message}`);
    sendResponse(res, status, false, message);
  }
}
