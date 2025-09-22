import { HttpError, sendResponse } from "../utils/resAndErrors.js";
import { STATUS_CODE } from "../utils/HTTPStatusCode.js";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger.js";
const secret = process.env.JWT_SECRET || "my secret";
export function verifyToken(req, res, next) {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : req.cookies?.accessToken;
        const refreshToken = req.cookies?.refreshToken;
        logger.info(`refreshToken:${refreshToken}`);
        if (!token)
            return sendResponse(res, STATUS_CODE.UNAUTHORIZED, false, "Access restricted, Login first");
        const payload = jwt.verify(token, secret);
        logger.info(`payload ${payload}`);
        payload ? next() : sendResponse(res, STATUS_CODE.UNAUTHORIZED, false, "Invalid token");
    }
    catch (error) {
        const status = error instanceof HttpError ? error.statusCode : STATUS_CODE.BAD_REQUEST;
        const message = error instanceof Error ? error.message : "Unknown error";
        logger.info(`Failed to check whether user is logged in nor message: ${message}`);
        sendResponse(res, status, false, message);
    }
}
