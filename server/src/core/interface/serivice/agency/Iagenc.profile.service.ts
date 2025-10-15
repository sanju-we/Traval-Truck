import { vendorRequestDTO } from "../../../DTO/admin/vendor.response.dto/vendor.response.dto.js";

export interface IAgencyProfileService {
  updateProfile(id:string,data:{ownerName:string,companyName:string,phone:number,bankDetails:{ifscCode:string,bankName:string,accountNumber:string,accountHolder:string}}) : Promise<vendorRequestDTO>;
  updateDocument(id:string,files:{ [fieldname: string]: Express.Multer.File[]}) : Promise<vendorRequestDTO>
}