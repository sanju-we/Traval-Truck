"use client";

import api from "@/services/api";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function BuyNowButton({ subscriptionId, role }: any) {
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    try {
      setLoading(true);

      const { data } = await api.post(`/shared/subscriptions/${role}/purchase`, {
        subscriptionId,
        role
      });

      if (data.success && data.data.url) {
        window.location.href = data.data.url; // redirect to Stripe checkout
      }
    } catch (err) {
      console.error("Buy error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
    >
      {loading ? <Loader2 className="animate-spin" /> : "Buy Now"}
    </button>
  );
}
