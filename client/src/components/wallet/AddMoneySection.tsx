"use client";

import { useState } from "react";
import StripeProvider from "@/components/payment/StripeProvider";
import CheckoutForm from "@/components/payment/CheckoutForm";
import { X } from "lucide-react";

export default function AddMoneySection() {
  const [amount, setAmount] = useState<number>(0);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    if (!amount || amount <= 0) return alert("Enter a valid amount");
    setOpen(true);
  };

  return (
    <>
      {/* Add Money Input + Button */}
      <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Add Money to Wallet
        </h2>

        <div className="flex gap-3">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="Enter amount"
            className="flex-1 border px-4 py-2 rounded-lg text-gray-700 focus:ring-emerald-500 focus:border-emerald-500"
          />

          <button
            onClick={handleOpen}
            className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            Add Money
          </button>
        </div>
      </div>

      {/* Stripe Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-[95%] max-w-md relative shadow-2xl">

            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
              onClick={() => setOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Add ₹{amount}
            </h2>

            <StripeProvider>
              <CheckoutForm amount={amount} />
            </StripeProvider>
          </div>
        </div>
      )}
    </>
  );
}
