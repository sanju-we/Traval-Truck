export default interface User {
  id: string;
  name?: string;
  userName?: string;
  profilePicture?: string;
  ownerName?: string;
  companyName?: string;
  isApproved?: boolean;
  isBlocked?: boolean;
  phone?: number;
  email: string;
  role: string;
  createdAt: string;
  logo:string;
}

export interface UserProfile {
  id: string;
  name: string;
  userName: string;
  email: string;
  password: string;
  isBlocked: boolean;
  role: string;
  googleId: string;
  profilePicture?: string;
  bio?: string;
  phoneNumber?: number;
  gender?: string;
  interest?: string[];
}