"use client";

import { useState } from "react";
import api from "@/services/api";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import AddMoneyButton from "./AddMoneyButton";

export default function AddMoneySection({role}:{role:string}) {
  const [amount, setAmount] = useState<number | "">("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const rawRole = searchParams.get("role");


  async function handlePay() {
    if (!amount || Number(amount) < 50) {
      setError("Minimum amount is ₹50");
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post(
        `/shared/payments/${role}/create-payment`,
        { amount }
      );

      if (data.success && data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
      setError("Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Add Money to Wallet
      </h2>

      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <div className="flex-1">
          <input
            type="number"
            value={amount}
            min={50}
            onChange={(e) => {
              const v = Number(e.target.value);
              setAmount(v);
              setError(v < 50 ? "Minimum amount is ₹50" : "");
            }}
            className="w-full border px-4 py-2 rounded-lg"
            placeholder="Enter amount"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <AddMoneyButton amount={Number(amount)} role={role} />
      </div>
    </div>
  );
}
