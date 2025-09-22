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