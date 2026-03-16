import { PackageDTO } from "../../DTO/agency/request/packageDTO";
import { UserData, vendorData } from "types/index";
import { RoomsDTO } from "../../../core/DTO/hotel/roomsDTO";

export interface IAuthValidator {
  passwordValidator(password: string): Promise<void>;
  signUpValidator(enteredEmail: string, enteredOtp: string, agencyData: vendorData): Promise<void>;
  userSignupValidator(email:string, otp:string, userData:UserData):Promise<void>;
  loginValidator(email: string, password: string): Promise<void>;
  emailValidator(email: string): Promise<void>;
  addPackageValidator(data: PackageDTO): Promise<void>;
  resetPasswordValidator(token: string, newPassword: string): Promise<void>;
  profileUpdateValidator(ownerName: string, companyName: string, phone: number, bankDetails: { accountHolder: string, accountNumber: string, bankName: string, ifscCode: string }): Promise<void>
  RoomValidator(data: RoomsDTO): Promise<void>;
  updateStatusValidator(id:string,status:string):Promise<void>;
  otpStoreValidator(email:string, otp:string):Promise<void>;  
  blockValidator(id:string, status:boolean) :Promise<void>;
  userProfileUpdateValidator(name:string,userName:string,phone:number):Promise<void>;
  tokenValidator(accessToken?:string,refreshToken?:string):Promise<void>;
}