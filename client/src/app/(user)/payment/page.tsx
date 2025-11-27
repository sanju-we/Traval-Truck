'use client';

import StripeProvider from '@/components/payment/StripeProvider';
import CheckoutForm from '@/components/payment/CheckoutForm';
import { motion } from 'framer-motion';
import { CreditCard, Lock, PlaneTakeoff } from 'lucide-react';

export default function PaymentPage() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md bg-white/70 backdrop-blur-lg shadow-lg rounded-2xl p-8 border border-emerald-100"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="bg-emerald-100 p-3 rounded-full"
            >
              <CreditCard className="text-emerald-600 w-8 h-8" />
            </motion.div>
          </div>
          <h1 className="text-2xl font-bold text-emerald-700 mb-1">Complete Your Payment</h1>
          <p className="text-gray-500 text-sm">Secure checkout powered by Stripe</p>
        </div>

        {/* Package Summary */}
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="font-medium text-gray-700">Package Name</p>
            <p className="text-gray-600">🌴 Kerala Explorer</p>
          </div>
          <div className="flex items-center justify-between mb-2">
            <p className="font-medium text-gray-700">Duration</p>
            <p className="text-gray-600">5 Days / 4 Nights</p>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 mt-2 pt-3">
            <p className="font-semibold text-lg text-gray-800">Total</p>
            <p className="font-bold text-emerald-600 text-xl">₹999</p>
          </div>
        </div>

        <StripeProvider>
          <CheckoutForm amount={999} role='user' onClose={sanju()}/>
        </StripeProvider>

        <div className="flex items-center justify-center gap-2 text-gray-500 text-xs mt-5">
          <Lock className="w-4 h-4 text-emerald-600" />
          <span>All payments are encrypted and secure.</span>
        </div>

        <div className="mt-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-1 text-sm text-emerald-700"
          >
            <PlaneTakeoff size={18} /> <span>Travel Truck</span>
          </motion.div>
          <p className="text-gray-400 text-xs mt-1">Adventure starts after checkout ✈️</p>
        </div>
      </motion.div>
    </div>
  );
}
