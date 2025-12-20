export interface IBaseValidator{
  idValidator(id:string):Promise<void>;
}