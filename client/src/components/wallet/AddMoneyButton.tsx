"use client";

import { useState } from "react";
import api from "@/services/api";
import { Loader2 } from "lucide-react";

export default function AddMoneyButton({ amount, role }: { amount: number; role: string }) {
  const [loading, setLoading] = useState(false);

  async function handleAddMoney() {
    try {
      setLoading(true);

      const { data } = await api.post(`/shared/payments/${role}/create-payment`, {
        amount,
        type: "wallet",
      });

      if (data.success && data.data.url) {
        window.location.href = data.data.url;
      }
    } catch (err) {
      console.error("Wallet topup error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleAddMoney}
      disabled={loading}
      className="px-5 py-2 rounded-lg font-medium bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
    >
      {loading ? <Loader2 className="animate-spin" /> : "Add Money"}
    </button>
  );
}
