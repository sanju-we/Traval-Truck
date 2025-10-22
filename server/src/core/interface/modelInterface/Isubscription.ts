import { Document, ObjectId } from 'mongoose';

export interface IDuration {
  startingDate : Date,
  endingDate:Date
}

export interface ISubscriptions extends Document {
  _id: ObjectId;
  Name: string ;
  Category: string ;
  Duration: IDuration;
  Valid:number;
  Description: string ;
  Amount: number ;
  Features: string[] ;
  IsActive: boolean ;
  CreatedAt: Date ;
}
