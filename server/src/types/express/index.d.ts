import { Userauth, VendorAuth } from 'types';

declare global {
  namespace Express {
    interface Request {
      user: Userauth | VendorAuth;
    }
  }
}
