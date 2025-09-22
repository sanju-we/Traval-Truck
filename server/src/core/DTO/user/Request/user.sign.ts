import { IUser } from "../../../interface/modelInterface/IUser.js";

export interface IUserRequest{
  name:string;
  email:string;
  phone:number;
  password:string;
}

export const userSignupDTO=(user:IUser):IUserRequest=>({
  name:user.name,
  email:user.email,
  phone:user.phoneNumber,
  password:user.password
});