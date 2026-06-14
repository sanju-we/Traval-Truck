"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SideNavbar from "@/components/restaurant/SideNavbar";
import { CheckCircle, AlertTriangle, Utensils, Sparkles, Map, Compass, Globe, Ticket, Clock, ChefHat } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { SHARED_API_METHODS } from "@/services/APIs/shared.api.service";
import { Subscription } from "@/types/agency";
import { ApiResponse } from "@/services/api.service";
import VendorFooter from "@/components/shared/Footer";
import TravelTruckLoading from "@/components/shared/TravelTruckLoading";

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [activeSubscription, setActiveSubscription] =
    useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const [allRes, currentRes] = await Promise.all([
        SHARED_API_METHODS.getAllSubscriptions('restaurant'),
        SHARED_API_METHODS.currentSubscription('restaurant'),
      ]) as [ApiResponse<Subscription[]>, ApiResponse<Subscription>];

      if (allRes.success) {
        setSubscriptions(allRes.data || []);
      }

      if (currentRes.success && currentRes.data) {
        setActiveSubscription(currentRes.data);
      } else {
        setActiveSubscription(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load dining plans.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh] w-full bg-white">
        <TravelTruckLoading />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white shadow-md sticky top-0 h-screen hidden lg:block">
        <SideNavbar />
      </aside>
      
      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-4 md:p-8">
          {/* Hero Section */}
          <section className="relative py-16 px-8 overflow-hidden rounded-[2.5rem] mb-12 shadow-2xl">
            <div className="absolute inset-0 z-0">
              <img 
                src="/images/subscription_bg.png" 
                alt="Background" 
                className="w-full h-full object-cover opacity-90 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-orange-900/60 via-orange-900/20 to-transparent" />
            </div>

            <div className="relative z-10 max-w-4xl">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-sm font-bold mb-6">
                  <Utensils size={14} className="text-orange-300" />
                  Elevate Your Culinary Reach
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-6 leading-[1.1]">
                   Serve <span className="text-orange-400">Excellence</span> <br /> 
                   to Every Traveler
                </h1>
                <p className="text-xl text-orange-50/90 max-w-2xl leading-relaxed font-medium">
                  Choose a dining partnership plan that puts your restaurant on the global map. 
                  Unlock featured placement, premium menu analytics, and traveler loyalty perks.
                </p>
              </motion.div>
            </div>
          </section>

          <div className="max-w-7xl mx-auto space-y-16 pb-20">
            
            {/* ================= ACTIVE PLAN ================= */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-2 h-8 bg-orange-600 rounded-full" />
                 <h2 className="text-3xl font-black text-gray-900 tracking-tight">Current Dining Tier</h2>
              </div>

              {activeSubscription ? (
                activeSubscription.status === "active" ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group relative overflow-hidden bg-white border border-orange-100 rounded-[2.5rem] shadow-xl transition-all hover:shadow-2xl"
                  >
                    {/* Ticket Header */}
                    <div className="bg-orange-600 px-8 py-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-3">
                             <Ticket size={24} className="rotate-45" />
                             <span className="font-black uppercase tracking-widest text-sm">Restaurant Partner Pass</span>
                        </div>
                        <div className="flex items-center gap-2 font-bold px-4 py-1 bg-white/20 rounded-full text-xs">
                            <CheckCircle size={14} /> ACTIVE SERVICE
                        </div>
                    </div>

                    <div className="p-8 md:p-12 flex flex-col md:flex-row gap-12">
                      {/* Left Info */}
                      <div className="flex-1 space-y-8">
                        <div>
                          <h3 className="text-5xl font-black text-gray-900 tracking-tighter">
                            {activeSubscription.name}
                          </h3>
                          <p className="text-orange-600 font-bold flex items-center gap-2 mt-3 text-lg">
                            <ChefHat size={20} />
                            Featured Merchant • {activeSubscription.valid} Year License
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {activeSubscription.endDate && (
                            <div className="bg-orange-50/50 p-5 rounded-3xl border border-orange-100 flex items-center gap-4">
                               <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-orange-600">
                                 <Clock size={24} />
                               </div>
                               <div>
                                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Valid Until</p>
                                 <p className="text-gray-900 font-black text-lg">{new Date(activeSubscription.endDate).toLocaleDateString()}</p>
                               </div>
                            </div>
                          )}
                          <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100 flex items-center gap-4">
                              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gray-900 text-2xl font-black">
                                ₹
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Tier Investment</p>
                                <p className="text-gray-900 font-black text-lg">₹{activeSubscription.amount.toLocaleString('en-IN')}</p>
                              </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-4">
                          {activeSubscription.features?.map((f: string, i: number) => (
                            <span key={i} className="px-4 py-1.5 bg-orange-50/30 text-orange-800 border border-orange-100 rounded-full text-sm font-bold flex items-center gap-2 transition-colors hover:bg-white hover:shadow-sm">
                              <CheckCircle size={14} className="text-orange-500" /> {f}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions Area */}
                      <div className="md:w-72 flex flex-col items-center justify-center p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                         <Link 
                           href={`/restaurant/subscriptions/${activeSubscription.id}`}
                           className="w-full bg-gray-900 text-white text-center py-4 rounded-2xl font-black hover:bg-black transition-all shadow-lg mb-4"
                         >
                            View Plan Config
                         </Link>
                         <p className="text-xs text-gray-400 font-bold uppercase tracking-widest text-center leading-relaxed">
                            Verified Dining <br /> Partner
                         </p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="bg-red-50 border-2 border-red-100 rounded-[2.5rem] p-10 flex items-start gap-6">
                    <div className="bg-red-100 p-5 rounded-2xl">
                        <AlertTriangle className="text-red-600" size={40} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-3xl font-black text-red-900">Subscription Required</h3>
                      <p className="text-red-700/80 max-w-2xl text-lg font-medium leading-relaxed">
                        Your restaurant's exposure is currently limited. 
                        Purchase a dining plan below to resume active placement and menu accessibility.
                      </p>
                    </div>
                  </div>
                )
              ) : (
                <div className="bg-orange-50/50 border-2 border-dashed border-orange-200 rounded-[2.5rem] p-12 flex items-center justify-between">
                   <div className="flex items-center gap-8">
                      <div className="bg-orange-600 p-6 rounded-3xl shadow-orange-200 shadow-xl">
                          <Utensils className="text-white" size={48} />
                      </div>
                      <div>
                        <h3 className="text-4xl font-black text-gray-900">Start Your Culinary Tour</h3>
                        <p className="text-gray-500 mt-2 text-xl font-medium italic">"No active partnership yet. Let's get your menu seen by thousands."</p>
                      </div>
                   </div>
                   <motion.div 
                     animate={{ rotate: 360 }}
                     transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                     className="hidden lg:block text-orange-200"
                   >
                      <Globe size={64} />
                   </motion.div>
                </div>
              )}
            </section>

            {/* ================= AVAILABLE PLANS ================= */}
            <section>
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                       <div className="w-2 h-8 bg-orange-500 rounded-full" />
                       <h2 className="text-3xl font-black text-gray-900 tracking-tight">Dining Plans</h2>
                    </div>
                    <p className="text-gray-500 font-medium">Select a tier that matches your restaurant's ambition.</p>
                  </div>
               </div>

              {subscriptions.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-gray-100 rounded-[2.5rem] p-24 text-center">
                  <p className="text-gray-400 text-xl font-black uppercase tracking-widest opacity-30">
                    Plans Currently Offline
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
                  {subscriptions.map((sub: Subscription, index: number) => {
                    const isPremium = index > 1 || sub.name.toLowerCase().includes('gold') || sub.name.toLowerCase().includes('platinum');

                    return (
                      <motion.div
                        key={sub.id}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className={`relative flex flex-col bg-white rounded-[3rem] shadow-xl border border-gray-50 overflow-hidden group h-full ${isPremium ? 'ring-2 ring-orange-500 ring-offset-[6px]' : ''}`}
                      >
                        <div className="p-10 flex flex-col h-full">
                          <div className="flex justify-between items-center mb-8">
                             <div className={`p-5 rounded-2xl ${isPremium ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-600'}`}>
                               {isPremium ? <Sparkles size={36} /> : <Utensils size={36} />}
                             </div>
                          </div>

                          <h3 className="text-4xl font-black text-gray-900 mb-3 tracking-tighter group-hover:text-orange-600 transition-colors uppercase">{sub.name}</h3>
                          
                          <div className="flex items-baseline gap-2 mb-8">
                              <span className="text-4xl font-black text-gray-900">₹{sub.amount.toLocaleString('en-IN')}</span>
                              <span className="text-gray-400 font-bold text-sm uppercase tracking-widest">/ {sub.valid} Year</span>
                          </div>

                          <div className="flex-1 space-y-5 mb-10">
                             <ul className="space-y-4">
                                {sub.features.map((f: string, i: number) => (
                                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600 font-bold leading-none">
                                    <CheckCircle size={16} className={`${isPremium ? 'text-orange-500' : 'text-blue-500'} shrink-0 mt-[-2px]`} />
                                    {f}
                                  </li>
                                ))}
                             </ul>
                          </div>

                          <Link
                            href={`/restaurant/subscriptions/${sub.id}`}
                            className={`block text-center py-5 rounded-[2rem] font-black tracking-widest transition-all shadow-xl group-hover:scale-105 ${
                              isPremium 
                              ? 'bg-orange-600 text-white hover:bg-orange-700' 
                              : 'bg-black text-white hover:bg-gray-900'
                            }`}
                          >
                            JOIN TIER
                          </Link>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
          <VendorFooter />
        </div>
      </div>
    </div>
  );
}
