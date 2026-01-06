export interface IBaseValidator{
  idValidator(id:string):Promise<void>;
  reviewValidator(data:{rate:number,comment:string}):Promise<void>;
}