"use client";

import { AGENCY_API_METHODS } from "@/services/APIs/agency.api.service";
import { HOTEL_API_METHODS } from "@/services/APIs/hotel.api.service";
import { RESTAURANT_API_METHODS } from "@/services/APIs/restaurant.api.service";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { ApiResponse } from "@/services/api.service";

interface BuyNowButtonProps {
  subscriptionId: string;
  role: string;
}

export default function BuyNowButton({ subscriptionId, role }: BuyNowButtonProps) {
  const [loading, setLoading] = useState(false);

  const getService = (role: string) => {
    switch (role) {
      case 'agency': return AGENCY_API_METHODS;
      case 'hotel': return HOTEL_API_METHODS;
      case 'restaurant': return RESTAURANT_API_METHODS;
      default: return null;
    }
  };

  const handleBuy = async () => {
    const service = getService(role);
    if (!service) {
      console.error("Invalid role");
      return;
    }

    try {
      setLoading(true);

      const data = await service.purchaseSubscription({
        subscriptionId,
        role
      }) as ApiResponse<{ url: string }>;

      console.log('data:', data)

      if (data && data.success && data.data && data.data.url) {
        window.location.href = data.data.url; // redirect to Stripe checkout
      } else {
        toast.error("Failed to initiate checkout");
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
