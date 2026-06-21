"use client";

import { USER_API_METHODS } from "@/services/APIs/user.api.service";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { ApiResponse } from "@/services/api.service";

interface props {
  roomId: string,
  amount: number,
  role: string,
  couponCode?: string,
  startDate: string,
  people: number,
  guestName?: string,
  guestAge?: number,
}

export default function BuyNowButton({ roomId, amount, role, couponCode, startDate, people, guestName, guestAge }: props) {
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    const service = USER_API_METHODS;
    if (!service) {
      console.error("Invalid role");
      return;
    }

    try {
      setLoading(true);

      const res = await service.purchaseRoom({ roomId, role, amount, couponId: couponCode, startDate, people, guestName, guestAge }) as ApiResponse<{ url: string }>;
      console.log(res)
      if (res && res.success && res.data && res.data.url) {
        window.location.href = res.data.url;
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
