import mongoose, { Schema } from "mongoose";
const WalletSchema = new Schema({
    UserId: { type: Schema.Types.ObjectId },
    role: { type: String, enum: ['admin', 'user', 'agency', 'restaurant', 'hotel'] },
    Transaction: [{
            Type: { type: String, enum: ['credit', 'debit'] },
            Amount: { type: Number },
            Description: { type: String },
            Date: { type: Date },
            paymentIntentId: { type: String },
            orderId: { type: String, ref: "Orders" }
        }],
    Balance: { type: Number },
});
export const Wallet = mongoose.model('Wallet', WalletSchema);
