import { PackageDTO } from "../../DTO/agency/request/packageDTO";
import { vendorData } from "types/index";
import { RoomsDTO } from "../../../core/DTO/hotel/roomsDTO";

export interface IAuthValidator {
  signUpValidator(enteredEmail: string, enteredOtp: string, agencyData: vendorData): Promise<void>;
  loginValidator(email: string, password: string): Promise<void>;
  emailValidator(email: string): Promise<void>;
  addPackageValidator(data: PackageDTO): Promise<void>;
  resetPasswordValidator(token: string, newPassword: string): Promise<void>;
  profileUpdateValidator(ownerName: string, companyName: string, phone: number, bankDetails: { accountHolder: string, accountNumber: string, bankName: string, ifscCode: string }): Promise<void>
  RoomValidator(data: RoomsDTO): Promise<void>;
  updateStatusValidator(id:string,status:string):Promise<void>;
}