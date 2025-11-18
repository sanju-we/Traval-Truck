'use client';

import { useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/services/api';

export default function CheckoutForm({ amount, role, onClose }: { amount: number, role: string, onClose: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;
    setLoading(true);

    try {
      const { data } = await api.post('/user/payments/create-payment', { amount });
      console.log('data',data)

      const result = await stripe.confirmCardPayment(data.data[0], {
        payment_method: { card: elements.getElement(CardElement)! },
      });
      
      if (result.error) {
        toast.error(result.error.message || 'Payment failed');
      } else if (result.paymentIntent?.status === 'succeeded') {
        const body = {paymentIntentId: data.data[1], amount: amount}
        const res = await api.post(`/shared/wallet/${role}/add-money`, body)
        if (res.data.success) {
          toast.success('Payment successful!');
          onClose();
          router.push('/wallet?role=user');
        }else{
          toast.error(res.data.message)
        }
      }
    } catch (error) {
      toast.error('Something went wrong!');
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg w-full max-w-md mx-auto shadow-md">
      <CardElement className="p-3 border rounded-md mb-4" />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md flex justify-center"
      >
        {loading ? <Loader2 className="animate-spin" /> : `Pay ₹${amount}`}
      </button>
    </form>
  );
}
