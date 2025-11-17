"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import StripeProvider from "@/components/payment/StripeProvider";
import CheckoutForm from "@/components/payment/CheckoutForm";

export default function AddMoneyButton({ amount }: { amount: number }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Button */}
      <button
        onClick={() => setOpen(true)}
        className="px-5 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition flex items-center gap-2"
      >
        Add Money
      </button>

      {/* Modal Popup */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div
            className="bg-white rounded-xl p-6 shadow-xl w-[90%] max-w-md relative"
          >
            {/* Close button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Add Money to Wallet
            </h2>

            {/* Stripe Elements Checkout */}
            <StripeProvider>
              <CheckoutForm amount={amount} />
            </StripeProvider>
          </div>
        </div>
      )}
    </>
  );
}
