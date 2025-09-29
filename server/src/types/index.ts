// User Types
export interface IUser {
  id?: string;
  name: string;
  email: string;
  phoneNumber?: number;
  isBlocked: boolean;
  password: string;
  role: string;
}
export interface UserData {
  name: string;
  email: string;
  password: string;
  phone: number;
}
export interface userProfileDTO {
  id: string;
  name: string;
  email: string;
  phoneNumber?: number;
  role: string;
}

export interface userEdit {
  name:string,
  userName:string,
  phoneNumber:number
}

// {\n  _id: new ObjectId('68d6f500634a89c53390addd'),\n  name: 'Sanju pn',\n  email: 'sanju@gmail.com',\n  interest: [],\n  password: '$2b$10$jRoAeJveo2OIHazxOcW/vOfCt/RwH6eGrOdFfuAIKwK5PXs1mpQZy',\n  createdOn: 2025-09-26T18:51:49.609Z,\n  role: 'user',\n  isBlocked: false,\n  __v: 0\n}
export interface Userauth {
  id: string;
  name?: string;
  email: string;
  interesets?: string[];
  role: string;
  isBlocked: boolean;
}
export interface VendorAuth {
  id: string;
  companyName: string;
  email: string;
  ownerName?: string;
  role: string;
  isBlocked: boolean;
}

// General Types
export interface ResetToken {
  id: string;
  email: string;
}

// Vendor Types
export interface vendorData {
  ownerName: string;
  companyName: string;
  email: string;
  password: string;
  phone: number;
}

// Agency Types
export interface allRequest {
  id: string;
  ownerName: string;
  companyName: string;
  email: string;
  phone: number;
  isApproved: boolean;
  role: string;
}
