"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = verifyToken;
exports.verifyHotelToken = verifyHotelToken;
exports.verifyAgencyToken = verifyAgencyToken;
exports.verifyRestaurantToken = verifyRestaurantToken;
exports.verifyAdminToken = verifyAdminToken;
exports.checkRole = checkRole;
const resAndErrors_1 = require("../utils/resAndErrors");
const HTTPStatusCode_1 = require("../utils/HTTPStatusCode");
const SUser_1 = require("../models/SUser");
const Restaurant_1 = require("../models/Restaurant");
const Agency_1 = require("../models/Agency");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = require("../utils/logger");
const Hotel_1 = require("../models/Hotel");
const JWTtoken_1 = require("../utils/JWTtoken");
const user_sign_1 = require("../core/DTO/user/Request/user.sign");
const requestDTO_1 = require("../core/DTO/agency/request/requestDTO");
const ijwt = new JWTtoken_1.JWT();
const secret = process.env.JWT_SECRET || 'Travel_Truck_@321';
async function verifyToken(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : req.cookies?.accessToken;
        if (!token) {
            return (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.FORBIDDEN, false, 'Access restricted, login first');
        }
        const payload = jsonwebtoken_1.default.verify(token, secret);
        if (!payload)
            return (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.FORBIDDEN, false, 'Token expired');
        const user = await SUser_1.User.findById(payload.id);
        if (!user) {
            ijwt.blacklistRefreshToken(res);
            return (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.UNAUTHORIZED, false, 'User not found');
        }
        if (payload.role !== 'user') {
            return (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.UNAUTHORIZED, false, 'Invalid token role');
        }
        if (user.isBlocked) {
            res.clearCookie('accessToken', { httpOnly: true, secure: false, sameSite: 'lax' });
            throw new resAndErrors_1.RESTRICTED_USER();
        }
        req.user = (0, user_sign_1.userSignupDTO)(user);
        next();
    }
    catch (error) {
        const status = error instanceof resAndErrors_1.HttpError ? error.statusCode : HTTPStatusCode_1.STATUS_CODE.FORBIDDEN;
        const message = error instanceof Error ? error.message : 'Unknown error';
        logger_1.logger.error(`Failed to verify token: ${message}`);
        (0, resAndErrors_1.sendResponse)(res, status, false, message);
    }
}
async function verifyHotelToken(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : req.cookies?.accessToken;
        if (!token) {
            return (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.FORBIDDEN, false, 'Access restricted, login first');
        }
        const payload = jsonwebtoken_1.default.verify(token, secret);
        if (!payload) {
            ijwt.blacklistRefreshToken(res);
            return (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.FORBIDDEN, false, 'Token expired');
        }
        const hotel = await Hotel_1.Hotel.findById(payload.id);
        if (!hotel) {
            return (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.UNAUTHORIZED, false, 'Hotel not found');
        }
        if (hotel.role !== 'hotel') {
            return (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.UNAUTHORIZED, false, 'Invalid token role');
        }
        if (hotel.isRestricted) {
            const allowedUrls = ['/profile', '/update-documents', '/purchase', '/activate'];
            if (!allowedUrls.some(url => req.url.endsWith(url))) {
                if (!hotel.isApproved)
                    throw new resAndErrors_1.UNAUTHORIZEDUserFounf();
            }
        }
        req.user = (0, requestDTO_1.toVendorAuth)(hotel);
        next();
    }
    catch (error) {
        const status = error instanceof resAndErrors_1.HttpError ? error.statusCode : HTTPStatusCode_1.STATUS_CODE.FORBIDDEN;
        const message = error instanceof Error ? error.message : 'Unknown error';
        logger_1.logger.error(`Failed to verify token: ${message}`);
        (0, resAndErrors_1.sendResponse)(res, status, false, message);
    }
}
async function verifyAgencyToken(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : req.cookies?.accessToken;
        if (!token) {
            return (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.FORBIDDEN, false, 'Access restricted, login first');
        }
        const payload = jsonwebtoken_1.default.verify(token, secret);
        if (!payload)
            return (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.FORBIDDEN, false, 'Token expired');
        const agency = await Agency_1.Agency.findById(payload.id);
        if (!agency) {
            return (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.UNAUTHORIZED, false, 'Hotel not found');
        }
        if (agency.role !== 'agency') {
            return (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.UNAUTHORIZED, false, 'Invalid token role');
        }
        if (agency.isRestricted || !agency.isApproved) {
            const allowedUrls = ['/profile', '/update-documents', '/logout', '/update', '/purchase', '/activate'];
            if (!allowedUrls.some(url => req.url.endsWith(url))) {
                if (!agency.isApproved)
                    throw new resAndErrors_1.UNAUTHORIZEDUserFounf();
            }
        }
        req.user = (0, requestDTO_1.toVendorAuth)(agency);
        next();
    }
    catch (error) {
        const status = error instanceof resAndErrors_1.HttpError ? error.statusCode : HTTPStatusCode_1.STATUS_CODE.FORBIDDEN;
        const message = error instanceof Error ? error.message : 'Unknown error';
        logger_1.logger.error(`Failed to verify token: ${message}`);
        (0, resAndErrors_1.sendResponse)(res, status, false, message);
    }
}
async function verifyRestaurantToken(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : req.cookies?.accessToken;
        if (!token) {
            return (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.FORBIDDEN, false, 'Access restricted, login first');
        }
        const payload = jsonwebtoken_1.default.verify(token, secret);
        if (!payload)
            return (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.FORBIDDEN, false, 'Token expired');
        const restaurant = await Restaurant_1.Restaurant.findById(payload.id);
        if (!restaurant) {
            return (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.UNAUTHORIZED, false, 'Hotel not found');
        }
        if (restaurant.role !== 'restaurant') {
            return (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.UNAUTHORIZED, false, 'Invalid token role');
        }
        if (restaurant.isRestricted || !restaurant.isApproved) {
            const allowedUrls = ['/profile', '/update-documents', '/update', '/purchase', '/activate'];
            if (!allowedUrls.some(url => req.url.endsWith(url))) {
                if (!restaurant.isApproved) {
                    throw new resAndErrors_1.UNAUTHORIZEDUserFounf();
                }
                ;
            }
        }
        req.user = (0, requestDTO_1.toVendorAuth)(restaurant);
        next();
    }
    catch (error) {
        const status = error instanceof resAndErrors_1.HttpError ? error.statusCode : HTTPStatusCode_1.STATUS_CODE.FORBIDDEN;
        const message = error instanceof Error ? error.message : 'Unknown error';
        logger_1.logger.error(`Failed to verify token: ${message}`);
        (0, resAndErrors_1.sendResponse)(res, status, false, message);
    }
}
async function verifyAdminToken(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : req.cookies?.accessToken;
        if (!token) {
            return (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.FORBIDDEN, false, 'Access restricted, login first');
        }
        const payload = jsonwebtoken_1.default.verify(token, secret);
        if (!payload)
            return (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.FORBIDDEN, false, 'Token expired');
        const admin = await SUser_1.User.findById(payload.id);
        if (!admin) {
            return (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.UNAUTHORIZED, false, 'Admin not found');
        }
        if (admin.role !== 'admin') {
            return (0, resAndErrors_1.sendResponse)(res, HTTPStatusCode_1.STATUS_CODE.UNAUTHORIZED, false, 'Invalid token role');
        }
        req.user = (0, user_sign_1.userSignupDTO)(admin);
        next();
    }
    catch (error) {
        const status = error instanceof resAndErrors_1.HttpError ? error.statusCode : HTTPStatusCode_1.STATUS_CODE.FORBIDDEN;
        const message = error instanceof Error ? error.message : 'Unknown error';
        logger_1.logger.error(`Failed to verify token: ${message}`);
        (0, resAndErrors_1.sendResponse)(res, status, false, message);
    }
}
async function checkRole(req, res, next) {
    const role = req.params.role;
    if (role === 'user') {
        logger_1.logger.debug(`fuck you ${role}`);
        return verifyToken(req, res, next);
    }
    else if (role === 'admin')
        return verifyAdminToken(req, res, next);
    else if (role === 'agency')
        return verifyAgencyToken(req, res, next);
    else if (role === 'hotel')
        return verifyHotelToken(req, res, next);
    else if (role === 'restaurant')
        return verifyRestaurantToken(req, res, next);
    else
        throw new resAndErrors_1.UNAUTHORIZEDUserFounf();
}
