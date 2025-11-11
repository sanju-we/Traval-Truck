'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  const date = new Date().toLocaleString();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/'); 
    }, 8000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-blue-100 p-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="flex justify-center mb-4"
        >
          <CheckCircle2 className="w-20 h-20 text-emerald-500 drop-shadow-md" />
        </motion.div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-emerald-600 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Your transaction has been completed successfully.  
          A confirmation email will be sent shortly.
        </p>

        {/* Transaction Info */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 text-sm text-gray-700 mb-6 text-left">
          <p className="flex justify-between">
            <span>Order ID:</span> <span className="font-medium">{orderId || 'TTX-123456'}</span>
          </p>
          <p className="flex justify-between">
            <span>Amount Paid:</span> <span className="font-medium">₹{amount || '3,499'}</span>
          </p>
          <p className="flex justify-between">
            <span>Date:</span> <span className="font-medium">{date}</span>
          </p>
          <p className="flex justify-between">
            <span>Status:</span>{' '}
            <span className="font-semibold text-emerald-600">Success</span>
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => router.push('/package')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white w-full"
          >
            View My Bookings
          </Button>

          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="w-full"
          >
            Back to Home
          </Button>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Redirecting you automatically in 8 seconds...
        </p>
      </motion.div>
    </div>
  );
}
