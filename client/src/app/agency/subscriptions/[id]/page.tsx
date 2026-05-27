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
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";
import { Subscription } from "@/types/agency";
import TravelTruckLoading from "@/components/shared/TravelTruckLoading";

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
      <div className="min-h-screen flex items-center justify-center bg-white p-10">
        <TravelTruckLoading />
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-500 gap-4">
        <MapPin size={48} className="text-gray-300" />
        <p className="text-xl font-medium">Route Discontinued</p>
        <Link href="/agency/subscriptions" className="text-blue-600 font-bold hover:underline">
          Select another route
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Flight Banner / Header */}
      <div className="bg-blue-600 text-white pt-10 pb-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/agency/subscriptions"
            className="inline-flex items-center gap-2 text-blue-100 hover:text-white transition-colors font-bold text-sm mb-10 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm"
          >
            <ArrowLeft size={16} />
            BACK TO FLIGHT LIST
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border border-white/20">
                <Ticket size={12} className="rotate-45" /> Confirmation Required
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                {subscription.name}
              </h1>
              <p className="text-blue-100/70 text-lg font-medium max-w-xl">
                Elevate your agency's reach and dominate the global travel market with this premium tier.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white text-blue-600 rounded-[2rem] p-8 shadow-2xl flex flex-col items-center gap-2 border-4 border-blue-500/20 active:scale-95 transition-transform cursor-default"
            >
               <Globe className="animate-spin-slow" size={40} />
               <div className="text-center">
                 <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Global Status</p>
                 <p className="text-2xl font-black">UNLOCKED</p>
               </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-6 -mt-12">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left: Journey Steps */}
          <div className="lg:col-span-7 bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 p-8 md:p-14 border border-blue-50 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <Plane size={200} className="rotate-12" />
             </div>

             <div className="relative z-10">
                 <div className="flex items-center gap-4 mb-12">
                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Route Privileges</h2>
                    <div className="h-2 w-2 bg-blue-600 rounded-full animate-ping" />
                 </div>

                 <div className="relative space-y-12">
                    {/* The Path */}
                    <div className="absolute left-[11px] top-4 bottom-4 w-[2px] bg-dashed border-l-2 border-dashed border-gray-100" />
                    
                    {subscription.features.map((feature, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="relative pl-12"
                      >
                         <div className="absolute left-0 top-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-200">
                            <CheckCircle size={14} className="text-white" />
                         </div>

                         <div>
                            <h4 className="text-xl font-black text-gray-900 mb-1">
                              {feature}
                            </h4>
                            <p className="text-gray-500 text-sm font-medium">
                              Industry-leading standard for {feature.toLowerCase()} included as part of your agency's growth kit.
                            </p>
                         </div>
                      </motion.div>
                    ))}
                 </div>

                 <div className="mt-16 p-8 bg-gray-50 rounded-3xl border border-gray-100 flex items-center gap-6">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600">
                       <ShieldCheck size={32} />
                    </div>
                    <div>
                       <h5 className="font-black text-gray-900">Premium Protection</h5>
                       <p className="text-sm text-gray-500 font-medium">Every transaction and listing is covered by our traveler satisfaction guarantee.</p>
                    </div>
                 </div>
             </div>
          </div>

          {/* Right: Boarding Summary */}
          <div className="lg:col-span-5">
             <motion.div 
               initial={{ opacity: 0, y: 40 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-[#1E293B] text-white rounded-[3rem] shadow-2xl p-10 sticky top-10 border border-white/5 overflow-hidden"
             >
                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl" />
                
                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
                       <h3 className="font-black text-xl tracking-tighter italic">FARE TOTAL</h3>
                       <div className="bg-white/10 px-4 py-1 rounded-full text-[10px] font-black tracking-widest">STRICTLY NON-REFUNDABLE</div>
                    </div>

                    <div className="space-y-6 mb-10">
                       <div className="flex justify-between text-gray-400 font-bold text-sm tracking-widest uppercase">
                          <span>Subscription Fee</span>
                          <span className="text-white">₹{subscription.amount.toLocaleString('en-IN')}</span>
                       </div>
                       <div className="flex justify-between text-gray-400 font-bold text-sm tracking-widest uppercase">
                          <span>Standard Taxes</span>
                          <span className="text-emerald-400">WAIVED</span>
                       </div>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-6 mb-10 flex flex-col items-center">
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Grand Total Paid</p>
                        <p className="text-6xl font-black tracking-tighter">
                          ₹{subscription.amount.toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-gray-500 font-bold mt-2 uppercase tracking-widest">One-time payment for {subscription.valid} year</p>
                    </div>

                    <BuyNowButton
                      subscriptionId={id}
                      amount={subscription.amount}
                      role="agency"
                    />
                    
                    <p className="text-[10px] text-gray-500 font-bold text-center mt-6 uppercase tracking-widest leading-loose">
                      By proceeding, you agree to our <br /> 
                      <span className="text-blue-400 hover:underline cursor-pointer">International Agency Terms</span>
                    </p>
                </div>
             </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
