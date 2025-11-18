"use client";

import { useState } from "react";
import StripeProvider from "@/components/payment/StripeProvider";
import CheckoutForm from "@/components/payment/CheckoutForm";
import { X } from "lucide-react";

export default function AddMoneySection() {
  const [amount, setAmount] = useState<number | "">("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const handleAmountChange = (value: string) => {
    const num = Number(value);

    if (!num || num <= 0) {
      setAmount("");
      setError("");
      return;
    }

    setAmount(num);

    if (num < 50) {
      setError("Minimum amount is ₹50");
    } else {
      setError("");
    }
  };

  const handleOpen = () => {
    if (!amount || amount < 50) {
      setError("Minimum amount is ₹50");
      return;
    }
    setOpen(true);
  };

  return (
    <>
      {/* Add Money Card */}
      <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Add Money to Wallet
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          {/* Amount Input */}
          <div className="flex-1">
            <input
              type="number"
              min={50}
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="Enter amount"
              className="w-full border px-4 py-2 rounded-lg text-gray-700 
                focus:ring-emerald-500 focus:border-emerald-500"
            />

            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>

          {/* Add Money Button */}
          <button
            onClick={handleOpen}
            disabled={!amount || Number(amount) < 50}
            className={`
              px-5 py-2 rounded-lg font-medium text-white transition
              ${amount && amount >= 50
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-gray-300 cursor-not-allowed"}
            `}
          >
            Add Money
          </button>
        </div>
      </div>

      {/* Stripe Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-[95%] max-w-md relative shadow-2xl">
            {/* Close button */}
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
              onClick={() => setOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Add ₹{amount}
            </h2>

            {/* Stripe Checkout */}
            <StripeProvider>
              <CheckoutForm amount={Number(amount)} role="user" onClose={() => setOpen(false)}/>
            </StripeProvider>
          </div>
        </div>
      )}
    </>
  );
}
