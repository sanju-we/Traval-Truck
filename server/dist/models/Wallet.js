import mongoose, { Schema } from "mongoose";
const WalletSchema = new Schema({
    UserId: { type: Schema.Types.ObjectId },
    Transaction: [{
            Type: { type: String, enum: ['credit', 'debit'] },
            Amount: { type: Number },
            Description: { type: String },
            Date: { type: Date },
            paymentIntentId: { type: String }
        }],
    Balance: { type: Number },
});
export const Wallet = mongoose.model('Wallet', WalletSchema);
