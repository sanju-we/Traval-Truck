import { Document, ObjectId } from 'mongoose';

export interface IPartner extends Document {
  _id: ObjectId;
  PartnerType: String;
  PartnerName: String;
  Status: String;
  ContactPerson: String;
  Phone: Number;
  media: {
    Gallery: String[];
    Logo: String;
  };
  details: {
    AvgPriceRange: Number;
    Category: String;
    Description: String;
    Facilities: String[];
  }[];
  Email: String;
  Location: String;
}