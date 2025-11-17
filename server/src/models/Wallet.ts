import mongoose, { Schema } from "mongoose";
import { IWallet } from "../core/interface/modelInterface/IWaller.js";

const WalletSchema: Schema = new Schema({
  UserId: { type: Schema.Types.ObjectId },
  Transacion: [{
    Type: { type: String, enum: ['credit', 'debit'] },
    Amount: { type: Number },
    Description: { type: String },
    Date: { type: Date },
  }],
  Balance: { type: Number },
});

export const Wallet = mongoose.model<IWallet>('Wallet', WalletSchema);