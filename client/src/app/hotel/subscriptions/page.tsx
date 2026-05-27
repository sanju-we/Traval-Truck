"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, AlertTriangle, Compass, Globe, Truck, Sparkles, Map } from "lucide-react";
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
        api.get("/shared/subscriptions/hotel/getAll"),
        api.get("/shared/subscriptions/hotel/current"),
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
      <div className="flex justify-center items-center h-[70vh]">
        <TravelTruckLoading />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 px-6 overflow-hidden rounded-3xl mb-12">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/subscription_bg.png" 
            alt="Background" 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-100 text-sm font-medium mb-6">
              <Sparkles size={14} />
              Set Your Business Route
            </div>
            <h1 className="text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
              Pick the Perfect <span className="text-emerald-400 font-serif italic">Route</span> <br /> 
              for Your Hotel
            </h1>
            <p className="text-xl text-emerald-50/80 max-w-2xl leading-relaxed">
              Unlock unlimited bookings, premium listing visibility, and advanced analytics. 
              Choose the plan that fits your growth destination.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto space-y-16 pb-20">
        
        {/* ================= CURRENT PLAN ================= */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
            <h2 className="text-2xl font-bold text-gray-900">Your Current Itinerary</h2>
          </div>

          {activeSubscription ? (
            activeSubscription.status === "active" ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative overflow-hidden bg-white border-2 border-emerald-500 rounded-3xl shadow-xl transition-all hover:shadow-2xl"
              >
                {/* Status Badge */}
                <div className="absolute top-0 right-0">
                  <div className="bg-emerald-500 text-white px-8 py-1.5 rounded-bl-3xl font-bold text-sm flex items-center gap-2 shadow-sm uppercase tracking-widest">
                    <CheckCircle size={16} />
                    Active Journey
                  </div>
                </div>

                <div className="p-8 md:p-10 flex flex-col md:flex-row gap-10">
                  {/* Left Info */}
                  <div className="flex-1 space-y-6">
                    <div>
                      <h3 className="text-4xl font-black text-gray-900 tracking-tight">
                        {activeSubscription.name}
                      </h3>
                      <p className="text-emerald-600 font-semibold flex items-center gap-2 mt-2">
                        <Map size={18} />
                        Subscription Valid for {activeSubscription.valid} {activeSubscription.valid === 1 ? 'Year' : 'Years'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {activeSubscription.endDate && (
                        <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 flex items-center gap-3">
                           <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-600">
                             <Sparkles size={20} />
                           </div>
                           <div>
                             <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Expires On</p>
                             <p className="text-gray-900 font-bold">{new Date(activeSubscription.endDate).toLocaleDateString()}</p>
                           </div>
                        </div>
                      )}
                      <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-600 text-xl font-black">
                            ₹
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Cost Paid</p>
                            <p className="text-gray-900 font-bold">₹{activeSubscription.amount.toLocaleString('en-IN')}</p>
                          </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 text-sm text-gray-600">
                      {activeSubscription.features?.slice(0, 4).map((f, i) => (
                        <span key={i} className="px-3 py-1 bg-white border border-gray-100 rounded-full flex items-center gap-1 shadow-sm">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> {f}
                        </span>
                      ))}
                      {activeSubscription.features && activeSubscription.features.length > 4 && (
                        <span className="px-3 py-1 bg-gray-50 text-gray-400 rounded-full font-medium">+{activeSubscription.features.length - 4} more</span>
                      )}
                    </div>
                  </div>

                  {/* Right Actions - Minimalist but premium */}
                  <div className="md:w-64 flex flex-col justify-center">
                    <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-gray-200">
                      View full usage
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-4 px-4 font-medium italic">
                      Need more features? <br /> Discover higher routes below.
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-red-50 border-2 border-red-100 rounded-3xl p-8 flex items-start gap-5">
                <div className="bg-red-100 p-4 rounded-2xl">
                    <AlertTriangle className="text-red-600" size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-red-900">Your Route has Expired</h3>
                  <p className="text-red-700/80 mt-2 max-w-xl text-lg">
                    Your subscription itinerary ended on {activeSubscription.endDate ? new Date(activeSubscription.endDate).toLocaleDateString() : 'N/A'}. 
                    Purchase a new plan below to keep your hotel visible to thousands of travelers.
                  </p>
                </div>
              </div>
            )
          ) : (
            <div className="bg-yellow-50 border-2 border-yellow-100/50 rounded-3xl p-8 flex items-center justify-between gap-5">
               <div className="flex items-center gap-5">
                  <div className="bg-yellow-100 p-4 rounded-2xl">
                      <Map className="text-yellow-600" size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-yellow-900 underline decoration-yellow-300 underline-offset-4">Ready to Start Your Journey?</h3>
                    <p className="text-yellow-800/70 mt-1 font-medium">You don't have an active subscription yet. Pick a destination below to begin.</p>
                  </div>
               </div>
            </div>
          )}
        </section>

        {/* ================= AVAILABLE PLANS ================= */}
        <section>
           <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                <h2 className="text-2xl font-bold text-gray-900">Available Journeys</h2>
              </div>
              <div className="text-sm font-bold text-blue-600 flex items-center gap-2 px-4 py-1.5 bg-blue-50 rounded-full border border-blue-100">
                <Truck size={14} /> Global Coverage Guaranteed
              </div>
           </div>

          {subscriptions.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-20 text-center">
              <p className="text-gray-400 font-medium">
                No new journeys available at the moment.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {subscriptions.map((sub, index) => {
                // Determine icon and theme based on name or index
                const isPremium = sub.name.toLowerCase().includes('gold') || sub.name.toLowerCase().includes('elite') || index > 1;
                const isMedium = sub.name.toLowerCase().includes('standard') || index === 1;

                return (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className={`relative flex flex-col bg-white rounded-[2rem] shadow-lg border border-gray-100 overflow-hidden transition-all hover:shadow-2xl ${isPremium ? 'ring-2 ring-emerald-500 ring-offset-4' : ''}`}
                  >
                    {/* Visual Header */}
                    <div className={`h-3 bg-gradient-to-r ${isPremium ? 'from-emerald-500 to-teal-500' : isMedium ? 'from-blue-500 to-indigo-500' : 'from-gray-400 to-gray-600'}`} />
                    
                    <div className="p-8 flex flex-col h-full">
                      {/* Icon & Plan Name */}
                      <div className="flex justify-between items-start mb-6">
                        <div className={`p-4 rounded-2xl ${isPremium ? 'bg-emerald-50 text-emerald-600' : isMedium ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'}`}>
                          {isPremium ? <Truck size={32} /> : isMedium ? <Globe size={32} /> : <Compass size={32} />}
                        </div>
                        {isPremium && (
                           <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">Top Destination</span>
                        )}
                      </div>

                      <h3 className="text-3xl font-black text-gray-900 mb-2">{sub.name}</h3>
                      <p className="text-gray-400 font-medium text-sm mb-6 line-clamp-2 italic leading-snug">
                        Perfect for hotels looking for a {isPremium ? "complete premium takeover" : isMedium ? "balanced growth route" : "solid starting path"}.
                      </p>

                      <div className="space-y-4 mb-8">
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-black text-gray-900">₹{sub.amount.toLocaleString('en-IN')}</span>
                          <span className="text-gray-400 font-bold text-sm">/ {sub.valid} Year</span>
                        </div>
                        
                        {/* Featured Route List */}
                        <div className="border-t border-gray-50 pt-6">
                           <ul className="space-y-4">
                            {sub.features.slice(0, 5).map((f, i) => (
                              <li key={i} className="flex items-start gap-3 text-sm text-gray-600 font-medium leading-tight">
                                <CheckCircle size={16} className={`${isPremium ? 'text-emerald-500' : isMedium ? 'text-blue-500' : 'text-gray-400'} shrink-0 mt-0.5`} />
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Sticky Button at Bottom */}
                      <div className="mt-auto pt-6">
                        <Link
                          href={`/hotel/subscriptions/${sub.id}`}
                          className={`block text-center py-4 rounded-2xl font-black tracking-wide transition-all shadow-lg ${
                            isPremium 
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-emerald-200' 
                            : isMedium 
                            ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200' 
                            : 'bg-white border-2 border-gray-200 text-gray-800 hover:bg-gray-50'
                          }`}
                        >
                          Discover Route
                        </Link>
                      </div>
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
