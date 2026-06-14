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
  Clock,
  ShieldCheck,
  CreditCard,
  Ticket,
  Utensils,
  ChefHat,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";
import { Subscription } from "@/types/agency";
import TravelTruckLoading from "@/components/shared/TravelTruckLoading";

import { ApiResponse } from "@/services/api.service";

async function getSubscriptionById(id: string) {
  const res = await SHARED_API_METHODS.subscriptionDetails("restaurant", id) as ApiResponse<Subscription>;
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
        <p className="text-xl font-medium">Menu Unavailable</p>
        <Link href="/restaurant/subscriptions" className="text-orange-600 font-bold hover:underline">
          Return to directory
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF7] pb-24 text-gray-900">
      {/* Culinary Banner */}
      <div className="bg-orange-600 text-white pt-10 pb-24 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
           <ChefHat size={300} className="-rotate-12" />
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <Link
            href="/restaurant/subscriptions"
            className="inline-flex items-center gap-2 text-orange-100 hover:text-white transition-colors font-bold text-xs mb-10 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm tracking-widest"
          >
            <ArrowLeft size={14} />
            BACK TO SERVICE PLANS
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border border-white/20">
                <Sparkles size={12} /> Premium Partnership
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase">
                {subscription.name}
              </h1>
              <p className="text-orange-100/80 text-lg font-medium max-w-xl">
                The ultimate tier for high-traffic restaurants looking to capture the global traveler market.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 flex items-center gap-6"
            >
               <div className="p-4 bg-orange-500 rounded-2xl shadow-lg">
                 <Calendar className="text-white" size={32} />
               </div>
               <div>
                 <p className="text-[10px] font-black text-orange-200 uppercase tracking-widest">Plan Validity</p>
                 <p className="text-2xl font-black">{subscription.valid} {subscription.valid === 1 ? 'Year' : 'Years'}</p>
               </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-6 -mt-12">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left: Component List */}
          <div className="lg:col-span-8 bg-white rounded-[2.5rem] shadow-2xl shadow-orange-900/5 p-8 md:p-14 border border-orange-50">
             <div className="flex items-center gap-4 mb-14">
                <div className="h-10 w-2 bg-orange-600 rounded-full" />
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Your Service Journey</h2>
             </div>

             <div className="grid gap-12 relative">
                {/* Visual Connector */}
                <div className="absolute left-[27px] top-4 bottom-4 w-[2px] bg-gray-100" />
                
                {subscription.features.map((feature, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative pl-20"
                  >
                     <div className="absolute left-0 top-0 w-14 h-14 bg-gray-50 border-2 border-white rounded-[1.2rem] flex items-center justify-center shadow-sm z-10 group-hover:bg-orange-600 transition-colors">
                        <CheckCircle size={24} className="text-orange-500" />
                     </div>

                     <div>
                        <h4 className="text-xl font-black text-gray-900 mb-1 leading-none uppercase">
                          {feature}
                        </h4>
                        <p className="text-gray-500 text-sm font-medium mt-2 leading-relaxed">
                          Elevate your operations with our proprietary {feature.toLowerCase()} management tools.
                        </p>
                     </div>
                  </motion.div>
                ))}
             </div>

             <div className="mt-20 grid sm:grid-cols-2 gap-6 pt-12 border-t border-gray-50">
                <div className="flex items-start gap-4 p-6 bg-orange-50/30 rounded-3xl border border-orange-50">
                   <div className="text-orange-600 shrink-0"><Utensils size={24} /></div>
                   <div>
                      <h5 className="font-black text-gray-900 text-sm uppercase">Global Placement</h5>
                      <p className="text-xs text-gray-500 font-medium mt-1">Appear in travel itineraries globally.</p>
                   </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-blue-50/30 rounded-3xl border border-blue-50">
                   <div className="text-blue-600 shrink-0"><Globe size={24} /></div>
                   <div>
                      <h5 className="font-black text-gray-900 text-sm uppercase">Priority Traffic</h5>
                      <p className="text-xs text-gray-500 font-medium mt-1">Rank higher in search results for tourists.</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Right: Pricing Recap */}
          <div className="lg:col-span-4">
             <motion.div 
               initial={{ opacity: 0, y: 40 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-white rounded-[3rem] shadow-2xl p-10 sticky top-10 border border-orange-100 overflow-hidden"
             >
                <div className="flex items-center gap-2 mb-10">
                   <CreditCard className="text-orange-600" size={24} />
                   <h3 className="font-black text-sm uppercase tracking-widest text-gray-400">Merchant Summary</h3>
                </div>

                <div className="space-y-6 mb-10">
                   <div className="flex justify-between items-end border-b border-gray-50 pb-6">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Plan Investment</p>
                        <p className="text-5xl font-black text-gray-900 tracking-tighter mt-1 leading-none">
                          ₹{subscription.amount.toLocaleString('en-IN')}
                        </p>
                      </div>
                   </div>
                   
                   <div className="space-y-4">
                      <div className="flex justify-between text-sm font-bold text-gray-600">
                         <span>Service License</span>
                         <span>INCLUDED</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-gray-600">
                         <span>Global API Access</span>
                         <span>INCLUDED</span>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                  <BuyNowButton
                    subscriptionId={id}
                    role="restaurant"
                  />
                  
                  <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-center gap-2">
                     <ShieldCheck size={16} className="text-emerald-500" />
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Secure Bank-Level Checkout</p>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-between opacity-30 grayscale contrast-200">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" className="h-6" alt="Stripe" />
                </div>
             </motion.div>

             <div className="mt-8 bg-orange-600 rounded-[2.5rem] p-8 text-white flex items-center gap-4 shadow-xl shadow-orange-200">
                <Ticket className="shrink-0 rotate-12" size={40} />
                <p className="text-sm font-bold leading-relaxed">
                  "This plan currently includes a 15% discount on all featured promotions for the first 3 months."
                </p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
