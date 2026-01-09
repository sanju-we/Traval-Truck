import { MindMapRequest } from "../../../core/DTO/user/Request/mindMap.js";

export interface IBaseValidator{
  idValidator(id:string):Promise<void>;
  reviewValidator(data:{rating:number,comment:string}):Promise<void>;
  orderIdValidator(orderId:string):Promise<void>
  MindMapValidation(data:MindMapRequest):Promise<void>
}