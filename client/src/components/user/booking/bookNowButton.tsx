"use client";

import { USER_API_METHODS } from "@/services/APIs/user.api.service";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface props {
  packageId: string,
  amount: number,
  role: string,
  couponCode?: string
}

export default function BuyNowButton({ packageId, amount, role, couponCode }: props) {
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    const service = USER_API_METHODS;
    if (!service) {
      console.error("Invalid role");
      return;
    }

    try {
      setLoading(true);

      const res = await service.PurchasePackage({ packageId, role, amount, couponId:couponCode});
      console.log(res)
      if (res.success && res.data.url) {
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
