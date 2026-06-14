import { Document, Types } from "mongoose";

export interface IPayment extends Document {
  userId?: Types.ObjectId;       // who initiated (user/vendor)
  role?: string;                // 'user' | 'agency' | 'hotel' | 'restaurant' | 'admin'
  type: string;                 // 'wallet' | 'subscription' | 'package' | 'booking' | ...
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'canceled';
  sessionId?: string;           // stripe checkout session id
  paymentIntentId?: string;     // stripe payment_intent id (if available)
  stripeCustomerId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}