import { Document, ObjectId } from 'mongoose';

export interface IPartner extends Document {
  _id: ObjectId;
  PartnerType: string;
  PartnerName: string;
  Status: string;
  ContactPerson: string;
  Phone: number;
  Media: {
    Gallery: string[];
    Logo: string;
  };
  Details: { 
    AvgPriceRange: number;
    Category: string;
    Description: string;
    Facilities: string[];
  }[];
  Email: string;
  Location: string;
  partner:string[];
}
