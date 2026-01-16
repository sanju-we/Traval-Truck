"use client";

import { useEffect, useState } from "react";
import { SHARED_API_METHODS } from "@/services/APIs/shared.api.service";
import Link from "next/link";
import BuyNowButton from "@/components/subscription/BuyNowButton";
import {
  CheckCircle,
  Calendar,
  ArrowLeft,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Subscription } from "@/types/agency";

async function getSubscriptionById(id: string) {
  const res = await SHARED_API_METHODS.subscriptionDetails("agency", id);
  return res.success ? res.data : null;
}

export default function SubscriptionDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getSubscriptionById(id);
      setSubscription(data);
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-emerald-600" size={36} />
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
        Subscription not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Back */}
        <Link
          href="/hotel/subscriptions"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={18} />
          Back to Subscriptions
        </Link>

        {/* Main Card */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left: Plan Details */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8 border">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-100 p-3 rounded-xl">
                <Sparkles className="text-emerald-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">
                {subscription.name}
              </h1>
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Unlock premium features and grow your business with this plan.
            </p>

            {/* Features */}
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              What’s included
            </h3>

            <ul className="grid sm:grid-cols-2 gap-3">
              {subscription.features.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-gray-700"
                >
                  <CheckCircle
                    size={18}
                    className="text-emerald-500 mt-0.5"
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Pricing Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border flex flex-col justify-between sticky top-6 h-fit">
            <div>
              <p className="text-sm text-gray-500">Plan Price</p>

              <p className="text-4xl font-bold text-emerald-600 mt-1">
                ₹{subscription.amount}
              </p>

              <div className="flex items-center gap-2 text-gray-600 mt-2">
                <Calendar size={16} />
                <span>{subscription.valid} days validity</span>
              </div>

              <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <p className="text-sm text-emerald-800 font-medium">
                  Best for hotels looking to scale operations and increase
                  visibility.
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <BuyNowButton
                subscriptionId={id}
                amount={subscription.amount}
                role="hotel"
              />

              <p className="text-xs text-gray-500 text-center">
                Secure payment powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
