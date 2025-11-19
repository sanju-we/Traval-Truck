"use client";

import { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/services/api";

export default function SubscriptionPurchaseForm({
  amount,
  role,
  onClose,
}: {
  amount: number;
  role: string;
  onClose?: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // Create payment intent
      const { data } = await api.post("/user/payments/create-payment", {
        amount,
      });

      const result = await stripe.confirmCardPayment(data.data[0], {
        payment_method: { card: elements.getElement(CardElement)! },
      });

      if (result.error) {
        toast.error(result.error.message ? result.error.message : 'Something went wrong');
        setLoading(false);
        return;
      }

      if (result.paymentIntent?.status === "succeeded") {
        // Add to wallet or subscription
        const body = {
          paymentIntentId: data.data[1],
          amount,
        };

        const response = await api.post(
          `/vendor/subscriptions/${role}/purchase`,
          body
        );

        if (response.data.success) {
          toast.success("Subscription activated!");
          if (onClose) onClose();
          router.push(`/vendor/subscriptions`);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded-lg w-full max-w-md mx-auto shadow-md"
    >
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
