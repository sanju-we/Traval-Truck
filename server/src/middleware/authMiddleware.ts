import { Request, Response, NextFunction } from 'express';
import {
  HttpError,
  sendResponse,
  UNAUTHORIZEDUserFounf,
  RESTRICTED_USER,
} from '../utils/resAndErrors.js';
import { STATUS_CODE } from '../utils/HTTPStatusCode.js';
import { User } from '../models/SUser.js';
import { Restaurant } from '../models/Restaurant.js';
import { Agency } from '../models/Agency.js';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger.js';
import { Hotel } from '../models/Hotel.js';
import { JWT } from '../utils/JWTtoken.js';
import { userSignupDTO } from '../core/DTO/user/Request/user.sign.js';
import { toVendorAuth } from '../core/DTO/agency/request/requestDTO.js';

const ijwt = new JWT();
const secret = process.env.JWT_SECRET || 'Travel_Truck_@321';

export async function verifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers['authorization'];
    const token =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : req.cookies?.accessToken;
    if (!token) {
      return sendResponse(res, STATUS_CODE.FORBIDDEN, false, 'Access restricted, login first');
    }
    const payload = jwt.verify(token, secret) as { id: string; role: string };
    if (!payload) return sendResponse(res, STATUS_CODE.FORBIDDEN, false, 'Token expired');

    const user = await User.findById(payload.id);
    if (!user) {
      ijwt.blacklistRefreshToken(res);
      return sendResponse(res, STATUS_CODE.UNAUTHORIZED, false, 'User not found');
    }

    if (payload.role !== 'user') {
      return sendResponse(res, STATUS_CODE.UNAUTHORIZED, false, 'Invalid token role');
    }

    if (user.isBlocked) {
      res.clearCookie('accessToken', { httpOnly: true, secure: false, sameSite: 'lax' });
      throw new RESTRICTED_USER();
    }

    req.user = userSignupDTO(user);

    next();
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : STATUS_CODE.FORBIDDEN;
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Failed to verify token: ${message}`);
    sendResponse(res, status, false, message);
  }
}

export async function verifyHotelToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers['authorization'];
    const token =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : req.cookies?.accessToken;

    if (!token) {
      return sendResponse(res, STATUS_CODE.FORBIDDEN, false, 'Access restricted, login first');
    }

    const payload = jwt.verify(token, secret) as { id: string; email: string; role: string };
    if (!payload) {
      ijwt.blacklistRefreshToken(res);
      return sendResponse(res, STATUS_CODE.FORBIDDEN, false, 'Token expired');
    }

    const hotel = await Hotel.findById(payload.id);
    if (!hotel) {
      return sendResponse(res, STATUS_CODE.UNAUTHORIZED, false, 'Hotel not found');
    }

    if (hotel.role !== 'hotel') {
      return sendResponse(res, STATUS_CODE.UNAUTHORIZED, false, 'Invalid token role');
    }

    if (hotel.isRestricted) {
      if (req.url !== '/profile' && req.url == '/update-documents') {
        if (!hotel.isApproved) throw new UNAUTHORIZEDUserFounf();
      }
    }

    req.user = toVendorAuth(hotel);

    next();
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : STATUS_CODE.FORBIDDEN;
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Failed to verify token: ${message}`);
    sendResponse(res, status, false, message);
  }
}

export async function verifyAgencyToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers['authorization'];
    const token =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : req.cookies?.accessToken;

    if (!token) {
      return sendResponse(res, STATUS_CODE.FORBIDDEN, false, 'Access restricted, login first');
    }

    const payload = jwt.verify(token, secret) as { id: string; email: string; role: string };
    if (!payload) return sendResponse(res, STATUS_CODE.FORBIDDEN, false, 'Token expired');

    const agency = await Agency.findById(payload.id);
    if (!agency) {
      return sendResponse(res, STATUS_CODE.UNAUTHORIZED, false, 'Hotel not found');
    }

    if (agency.role !== 'agency') {
      return sendResponse(res, STATUS_CODE.UNAUTHORIZED, false, 'Invalid token role');
    }

    if (agency.isRestricted || !agency.isApproved) {
      if (req.url !== '/profile' && req.url !== '/update-documents' && req.url !== '/logout' && req.url !== '/update') {
        if (!agency.isApproved) throw new UNAUTHORIZEDUserFounf();
      }
    }


    req.user = toVendorAuth(agency);

    next();
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : STATUS_CODE.FORBIDDEN;
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Failed to verify token: ${message}`);
    sendResponse(res, status, false, message);
  }
}
export async function verifyRestaurantToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers['authorization'];
    const token =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : req.cookies?.accessToken;

    if (!token) {
      return sendResponse(res, STATUS_CODE.FORBIDDEN, false, 'Access restricted, login first');
    }

    const payload = jwt.verify(token, secret) as { id: string; email: string; role: string };
    if (!payload) return sendResponse(res, STATUS_CODE.FORBIDDEN, false, 'Token expired');

    const restaurant = await Restaurant.findById(payload.id);
    if (!restaurant) {
      return sendResponse(res, STATUS_CODE.UNAUTHORIZED, false, 'Hotel not found');
    }

    if (restaurant.role !== 'restaurant') {
      return sendResponse(res, STATUS_CODE.UNAUTHORIZED, false, 'Invalid token role');
    }

    if (restaurant.isRestricted || !restaurant.isApproved) {
      if (req.url !== '/profile' && req.url !== '/update-documents' && req.url !== '/update') {
        if (!restaurant.isApproved) {
          console.log('in here',req.url)
          throw new UNAUTHORIZEDUserFounf()
        };
      }
    }

    req.user = toVendorAuth(restaurant);

    next();
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : STATUS_CODE.FORBIDDEN;
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Failed to verify token: ${message}`);
    sendResponse(res, status, false, message);
  }
}

export async function verifyAdminToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers['authorization'];
    const token =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : req.cookies?.accessToken;

    if (!token) {
      return sendResponse(res, STATUS_CODE.FORBIDDEN, false, 'Access restricted, login first');
    }

    const payload = jwt.verify(token, secret) as { id: string; email: string; role: string };
    if (!payload) return sendResponse(res, STATUS_CODE.FORBIDDEN, false, 'Token expired');

    const admin = await User.findById(payload.id);
    if (!admin) {
      return sendResponse(res, STATUS_CODE.UNAUTHORIZED, false, 'Admin not found');
    }

    if (admin.role !== 'admin') {
      return sendResponse(res, STATUS_CODE.UNAUTHORIZED, false, 'Invalid token role');
    }

    req.user = userSignupDTO(admin);

    next();
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : STATUS_CODE.FORBIDDEN;
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Failed to verify token: ${message}`);
    sendResponse(res, status, false, message);
  }
}

export async function checkRole(req: Request, res: Response, next: NextFunction) {
  const role = req.params.role;
  if (role === 'user') {
    logger.debug(`fuck you ${role}`)
    return verifyToken(req, res, next)
  }
  else if (role === 'admin') return verifyAdminToken(req, res, next);
  else if (role === 'agency') return verifyAgencyToken(req, res, next);
  else if (role === 'hotel') return verifyHotelToken(req, res, next);
  else if (role === 'restaurant') return verifyRestaurantToken(req, res, next);
  else throw new UNAUTHORIZEDUserFounf()
} 