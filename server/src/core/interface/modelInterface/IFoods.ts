import { Document, ObjectId } from 'mongoose';

export interface IFoods extends Document {
  _id: ObjectId;
  Restaurant:  string ;
  Name:  string ;
  Price:  number ;
  AvailableQuantity:  number ;
  Category:  string ;
  Description:  string ;
  Image:  string[];
  Status:string;
}