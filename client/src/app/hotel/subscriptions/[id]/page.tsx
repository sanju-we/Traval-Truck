"use client";

import { useEffect, useState } from "react";
import { SHARED_API_METHODS } from "@/services/APIs/shared.api.service";
import Link from "next/link";
import BuyNowButton from "@/components/subscription/BuyNowButton";
import {
  CheckCircle,
  Calendar,
  ArrowLeft,
  Sparkles,
  MapPin,
  Plane,
  Clock,
  ShieldCheck,
  CreditCard,
  Ticket,
} from "lucide-react";
import { motion } from "framer-motion";
import { Subscription } from "@/types/agency";
import TravelTruckLoading from "@/components/shared/TravelTruckLoading";
import { ApiResponse } from "@/services/api.service";

async function getSubscriptionById(id: string) {
  const res = await SHARED_API_METHODS.subscriptionDetails("hotel", id) as ApiResponse<Subscription>;
  return res && res.success ? res.data : null;
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
      <div className="min-h-screen flex items-center justify-center bg-white p-10">
        <TravelTruckLoading />
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-500 gap-4">
        <MapPin size={48} className="text-gray-300" />
        <p className="text-xl font-medium">Destination Not Found</p>
        <Link href="/hotel/subscriptions" className="text-emerald-600 font-bold hover:underline">
          Go back to map
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-24">
      {/* Header / Boarding Pass Top */}
      <div className="bg-emerald-600 text-white pt-10 pb-20 px-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <Link
            href="/hotel/subscriptions"
            className="inline-flex items-center gap-2 text-emerald-100 hover:text-white transition-colors font-medium mb-4"
          >
            <ArrowLeft size={18} />
            Back to All Routes
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-2"
            >
              <div className="flex items-center gap-2 text-emerald-200 text-sm font-bold uppercase tracking-widest">
                <Ticket size={16} /> Subscription Ticket
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter">
                {subscription.name}
              </h1>
              <p className="text-emerald-100/80 text-lg font-medium">
                Your direct route to business expansion and global visibility.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 flex items-center gap-4"
            >
              <div className="p-3 bg-white/20 rounded-xl">
                <Plane className="text-white rotate-45" size={32} />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-200 uppercase tracking-widest">Validity</p>
                <p className="text-xl font-black">{subscription.valid} {subscription.valid === 1 ? 'Year' : 'Years'}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-6 -mt-10">
        <div className="grid lg:grid-cols-12 gap-10">

          {/* Left: Itinerary Timeline */}
          <div className="lg:col-span-8 bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 md:p-12 border border-blue-50">
            <div className="flex items-center gap-2 mb-10">
              <h2 className="text-2xl font-black text-gray-900">Plan Itinerary</h2>
              <div className="h-px bg-gray-100 flex-1 ml-4" />
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-emerald-500 via-blue-500 to-transparent opacity-20" />

              <div className="space-y-10">
                {subscription.features.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative pl-10 group"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-0 top-1.5 w-6 h-6 bg-white border-2 border-emerald-500 rounded-full flex items-center justify-center z-10 group-hover:scale-125 transition-transform">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {feature}
                      </h4>
                      <p className="text-gray-500 text-sm mt-1">
                        {i % 2 === 0
                          ? "Full access granted immediately upon boarding this plan."
                          : "Premium priority support included for this feature."}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Additional Info Cards */}
            <div className="grid sm:grid-cols-2 gap-6 mt-16 pt-10 border-t border-gray-50">
              <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 space-y-3">
                <div className="text-blue-600"><Clock size={24} /></div>
                <h5 className="font-bold text-blue-900">Instant Boarding</h5>
                <p className="text-sm text-blue-800/60 leading-snug">Plan activates the moment your transaction is confirmed. No waiting times.</p>
              </div>
              <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 space-y-3">
                <div className="text-emerald-600"><ShieldCheck size={24} /></div>
                <h5 className="font-bold text-emerald-900">Secure Journey</h5>
                <p className="text-sm text-emerald-800/60 leading-snug">Bank-grade security on every transaction through our global payment gateway.</p>
              </div>
            </div>
          </div>

          {/* Right: Checkout Summary */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2rem] shadow-2xl p-8 border border-emerald-50 sticky top-10"
            >
              <div className="flex items-center gap-2 mb-8">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                  <CreditCard size={20} />
                </div>
                <h3 className="font-black text-gray-900 uppercase tracking-tighter text-sm">Fare Summary</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Base Fare</span>
                  <span>₹{subscription.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Taxes & Fees</span>
                  <span className="text-emerald-600 flex items-center gap-1">
                    <Sparkles size={12} /> Included
                  </span>
                </div>
                <div className="h-px bg-gray-100 my-4" />
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total to Pay</p>
                    <p className="text-4xl font-black text-gray-900 mt-1">
                      ₹{subscription.amount.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 space-y-4">
                <BuyNowButton
                  subscriptionId={id}
                  role="hotel"
                />

                <div className="flex flex-col items-center gap-2">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
                    <CreditCard size={10} /> Trusted Payment Gateway
                  </p>
                  <div className="flex gap-4 opacity-50 contrast-0 grayscale">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="bg-gray-900 rounded-[2rem] p-8 text-white">
              <h4 className="font-bold flex items-center gap-2 mb-2">
                <Sparkles size={18} className="text-emerald-400" />
                Premium Add-on
              </h4>
              <p className="text-sm text-gray-400 leading-relaxed italic">
                "This plan includes a premium badge on all your hotel search results for the entire duration of the trip."
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
