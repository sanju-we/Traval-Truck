"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, AlertTriangle, Compass, Globe, Truck, Sparkles, Map, Ticket } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "@/services/api";
import { Subscription } from "@/types/agency";
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
        api.get("/shared/subscriptions/agency/getAll"),
        api.get("/shared/subscriptions/agency/current"),
      ]);

      if (allRes.data.success) {
        setSubscriptions(allRes.data.data || []);
      }

      if (currentRes.data.success && currentRes.data.data) {
        setActiveSubscription(currentRes.data.data);
      } else {
        setActiveSubscription(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh] w-full">
        <TravelTruckLoading />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Hero Section */}
      <section className="relative py-16 px-8 overflow-hidden rounded-[2.5rem] mb-12 shadow-2xl">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/subscription_bg.png" 
            alt="Background" 
            className="w-full h-full object-cover opacity-90 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 via-blue-900/20 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-sm font-bold mb-6">
              <Compass size={14} className="text-blue-300" />
              Scale Your Travel Agency
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-6 leading-[1.1]">
              Chart Your <span className="text-blue-400">Success</span> <br /> 
              Across the Globe
            </h1>
            <p className="text-xl text-blue-50/90 max-w-2xl leading-relaxed font-medium">
              Choose a subscription that fuels your agency's growth. 
              Unlock global packages, premium analytics, and priority booking traffic.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto space-y-16 pb-20">
        
        {/* ================= CURRENT PLAN ================= */}
        <section>
          <div className="flex items-center gap-3 mb-8">
             <div className="w-2 h-8 bg-blue-600 rounded-full" />
             <h2 className="text-3xl font-black text-gray-900 tracking-tight">Active Expedition</h2>
          </div>

          {activeSubscription ? (
            activeSubscription.status === "active" ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative overflow-hidden bg-white border border-blue-100 rounded-[2.5rem] shadow-xl transition-all hover:shadow-2xl"
              >
                {/* Boarding Pass Style Header */}
                <div className="bg-blue-600 px-8 py-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                         <Ticket size={24} className="rotate-45" />
                         <span className="font-black uppercase tracking-widest text-sm">Official Agency Ticket</span>
                    </div>
                    <div className="flex items-center gap-2 font-bold px-4 py-1 bg-white/20 rounded-full text-xs">
                        <CheckCircle size={14} /> LIVE ROUTE
                    </div>
                </div>

                <div className="p-8 md:p-12 flex flex-col md:flex-row gap-12">
                  {/* Left Info */}
                  <div className="flex-1 space-y-8">
                    <div>
                      <h3 className="text-5xl font-black text-gray-900 tracking-tighter">
                        {activeSubscription.name}
                      </h3>
                      <p className="text-blue-600 font-bold flex items-center gap-2 mt-3 text-lg">
                        <Globe size={20} />
                        International Coverage • {activeSubscription.valid} Year Term
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {activeSubscription.endDate && (
                        <div className="bg-blue-50/50 p-5 rounded-3xl border border-blue-100 flex items-center gap-4">
                           <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600">
                             <Sparkles size={24} />
                           </div>
                           <div>
                             <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Route Ends On</p>
                             <p className="text-gray-900 font-black text-lg">{new Date(activeSubscription.endDate).toLocaleDateString()}</p>
                           </div>
                        </div>
                      )}
                      <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100 flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gray-900 text-2xl font-black">
                            ₹
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Invested Amount</p>
                            <p className="text-gray-900 font-black text-lg">₹{activeSubscription.amount.toLocaleString('en-IN')}</p>
                          </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-4">
                      {activeSubscription.features?.map((f: any, i: number) => (
                        <span key={i} className="px-4 py-1.5 bg-blue-50/30 text-blue-800 border border-blue-100 rounded-full text-sm font-bold flex items-center gap-2 transition-colors hover:bg-white hover:shadow-sm">
                          <CheckCircle size={14} className="text-blue-500" /> {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="md:w-72 flex flex-col items-center justify-center p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                     <Link 
                       href={`/agency/subscriptions/${activeSubscription.id}`}
                       className="w-full bg-gray-900 text-white text-center py-4 rounded-2xl font-black hover:bg-black transition-all shadow-lg mb-4"
                     >
                        View Full Details
                     </Link>
                     <p className="text-xs text-gray-400 font-bold uppercase tracking-widest text-center leading-relaxed">
                        Authorized by <br /> Travel Truck Global
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
                  <h3 className="text-3xl font-black text-red-900">Your Journey Has Stalled</h3>
                  <p className="text-red-700/80 max-w-2xl text-lg font-medium leading-relaxed">
                    Your agency subscription expired on {activeSubscription.endDate ? new Date(activeSubscription.endDate).toLocaleDateString() : 'N/A'}. 
                    All active packages are currently suspended. Purchase a new ticket below to resume.
                  </p>
                </div>
              </div>
            )
          ) : (
            <div className="bg-blue-50/50 border-2 border-dashed border-blue-200 rounded-[2.5rem] p-12 flex items-center justify-between">
               <div className="flex items-center gap-8">
                  <div className="bg-blue-600 p-6 rounded-3xl shadow-blue-200 shadow-xl">
                      <Map className="text-white" size={48} />
                  </div>
                  <div>
                    <h3 className="text-4xl font-black text-gray-900">Map Your Career Route</h3>
                    <p className="text-gray-500 mt-2 text-xl font-medium italic">"No active subscription yet. Where would you like to travel today?"</p>
                  </div>
               </div>
               <motion.div 
                 animate={{ x: [0, 10, 0] }}
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="hidden lg:block text-blue-300"
               >
                  <Compass size={64} />
               </motion.div>
            </div>
          )}
        </section>

        {/* ================= AVAILABLE PLANS ================= */}
        <section>
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-2 h-8 bg-emerald-500 rounded-full" />
                   <h2 className="text-3xl font-black text-gray-900 tracking-tight">Available Tickets</h2>
                </div>
                <p className="text-gray-500 font-medium">Select your next business milestone from our curated plans.</p>
              </div>
              <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex -space-x-3">
                     {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center font-bold text-xs">AG</div>)}
                  </div>
                  <p className="text-xs font-bold text-gray-600 mr-2">JOIN 500+ AGENCIES</p>
              </div>
           </div>

          {subscriptions.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-gray-100 rounded-[2.5rem] p-24 text-center">
              <p className="text-gray-400 text-xl font-black uppercase tracking-widest opacity-30">
                No Tickets in Inventory
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {subscriptions.map((sub: any, index: number) => {
                const isPremium = index > 1 || sub.name.toLowerCase().includes('global') || sub.name.toLowerCase().includes('gold');

                return (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -10 }}
                    className={`relative flex flex-col bg-white rounded-[3rem] shadow-xl border border-gray-50 overflow-hidden group h-full ${isPremium ? 'ring-2 ring-emerald-500 ring-offset-[6px]' : ''}`}
                  >
                    <div className="p-10 flex flex-col h-full">
                      {/* Plan Category */}
                      <div className="flex justify-between items-center mb-8">
                         <div className={`p-5 rounded-2xl ${isPremium ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                           {isPremium ? <Truck size={36} /> : <Compass size={36} />}
                         </div>
                         {isPremium && (
                            <span className="bg-emerald-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">BEST VALUE</span>
                         )}
                      </div>

                      <h3 className="text-4xl font-black text-gray-900 mb-3 tracking-tighter group-hover:text-blue-600 transition-colors uppercase">{sub.name}</h3>
                      
                      <div className="flex items-baseline gap-2 mb-8">
                          <span className="text-4xl font-black text-gray-900">₹{sub.amount.toLocaleString('en-IN')}</span>
                          <span className="text-gray-400 font-bold text-sm uppercase tracking-widest">/ {sub.valid} Year</span>
                      </div>

                      <div className="flex-1 space-y-5 mb-10">
                         <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b pb-2">Plan Inclusions</h5>
                         <ul className="space-y-4">
                            {sub.features.slice(0, 5).map((f: string, i: number) => (
                              <li key={i} className="flex items-start gap-3 text-sm text-gray-600 font-bold leading-none">
                                <CheckCircle size={16} className={`${isPremium ? 'text-emerald-500' : 'text-blue-500'} shrink-0 mt-[-2px]`} />
                                {f}
                              </li>
                            ))}
                         </ul>
                      </div>

                      <Link
                        href={`/agency/subscriptions/${sub.id}`}
                        className={`block text-center py-5 rounded-[2rem] font-black tracking-widest transition-all shadow-xl group-hover:scale-105 ${
                          isPremium 
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        RESERVE NOW
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
  );
}
