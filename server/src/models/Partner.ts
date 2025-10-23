import { Schema, model } from 'mongoose';
import { IPartner } from '../core/interface/modelInterface/IPartner.js';

const PartnerSchema: Schema = new Schema({
  PartnerType: { type: String, enum: [ 'Hotel', 'Restaurant' ] },
  PartnerName: { type: String },
  Status: { type: String, enum: [ 'Active', 'Inactive', 'Pending' ] },
  ContactPerson: { type: String },
  Phone: { type: Number },
  Media: {
     Gallery: [{ type: String,  }],
     Logo: { type: String },
  },
  Details: [{
     AvgPriceRange: { type: Number },
     Category: { type: String },
     Description: { type: String },
     Facilities: [{ type: String,  }],
  }],
  Email: { type: String },
  Location: {
  type: { type: String, enum: ['Point'], default: 'Point' },
  coordinates: [Number], // [lng, lat]
},
});

// const partnerData = {
//   PartnerName: name,
//   Email: email,
//   Location: {
//     type: "Point",
//     coordinates: [location.lng, location.lat],
//   },
// };


export const Partner = model<IPartner>('Hotel', PartnerSchema);