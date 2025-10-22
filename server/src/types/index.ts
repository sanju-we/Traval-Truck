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
  phoneNumber: number;
}
export interface userProfileDTO {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  phoneNumber?: number;
  role: string;
}

export interface userEdit {
  name: string;
  userName: string;
  phoneNumber: number;
}

export interface Userauth {
  id: string;
  name?: string;
  email: string;
  interesets?: string[];
  role: string;
  isBlocked: boolean;
  isRestricted?: boolean
}
export interface VendorAuth {
  id: string;
  companyName: string;
  email: string;
  ownerName?: string;
  role: string;
  isBlocked: boolean;
  isRestricted: boolean
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

export interface subscriptionData {
  Name: string,
  Amount: number,
  Category: string,
  Description: string,
  Duration: {
    startingDate: string,
    endingDate: string,
  },
  Features: string[],
  Valid: number
}
