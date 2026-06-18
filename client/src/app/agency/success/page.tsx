"use client";

import api from "@/services/api";
import Link from "next/link";
import { CheckCircle, Home, Calendar, Shield, Ticket, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");
  const amount = searchParams.get("amount");

  const [subscriptionData, setSubscriptionData] = useState<any>(null);

  useEffect(() => {
    async function activateSubscription() {
      if (session_id) {
        try {
          console.log(`[CLIENT] Activating subscription for session: ${session_id}`);
          const res = await api.post(
            `/shared/subscriptions/agency/activate`,
            { subscriptionId: session_id }
          );
          console.log(`[CLIENT] Activation response:`, res.data);
          if (res.data.success) {
            setSubscriptionData(res.data.data);
          }
        } catch (err) {
          const error = err as Error & { response?: { data?: unknown } };
          console.error("[CLIENT] Activation failed:", error.message, error.response?.data);
        }
      }
    }
    activateSubscription();
  }, [session_id]);

  const activated = !!subscriptionData;
  const transactionId = subscriptionData?.paymentId || "N/A";
  const planName = subscriptionData?.name || "Agency Premium";
  const displayAmount = subscriptionData?.amount || amount;
  const expiryDate = subscriptionData?.endDate ? new Date(subscriptionData.endDate) : null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F0FDF4] p-4 sm:p-6">
      <div className="w-full max-w-xl">
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="relative bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-emerald-100"
        >
          {/* Header Pass */}
          <div className="bg-emerald-600 p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
            <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12">
               <Globe size={120} />
            </div>

            <div className="relative inline-block mb-6">
                <div className="bg-white rounded-full p-6 shadow-xl">
                    <CheckCircle className="text-emerald-600" size={48} strokeWidth={3} />
                </div>
            </div>

            <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
                Cleared for <span className="text-emerald-200">Takeoff</span>
            </h1>
            <p className="text-emerald-100 font-bold uppercase tracking-[0.3em] text-[10px] mt-4 opacity-80">
                Agency Partnership Activated
            </p>
          </div>

          {/* Ticket Body */}
          <div className="p-8 sm:p-12">
            {/* The "Pass" Info */}
            <div className="relative group overflow-hidden bg-emerald-50/50 rounded-[2rem] p-8 border-2 border-dashed border-emerald-200 mb-8">
               <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-6">
                     <div className="bg-emerald-600 p-4 rounded-2xl shadow-emerald-200 shadow-xl">
                        <Ticket className="text-white rotate-45" size={24} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Selected Tier</p>
                        <p className="text-2xl font-black text-gray-900 uppercase tracking-tighter">{planName}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Investment</p>
                     <p className="text-3xl font-black text-emerald-600">₹{Number(displayAmount)?.toLocaleString('en-IN') || '0'}</p>
                  </div>
               </div>
            </div>

            {/* Status Section */}
            <div className={`p-6 rounded-[2rem] mb-8 flex items-start gap-4 ${activated ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100' : 'bg-red-50 text-red-900 border border-red-100'}`}>
               {activated ? (
                 <>
                   <Shield size={24} className="shrink-0" />
                   <div>
                      <h4 className="font-black uppercase text-sm tracking-widest">Identity Verified</h4>
                      <p className="text-emerald-50 text-xs font-bold mt-1">
                        Your global agency license is now active. Ref: <span className="font-mono opacity-80">{transactionId}</span>
                      </p>
                   </div>
                 </>
               ) : (
                 <>
                   <div className="w-6 h-6 bg-red-200 rounded-full flex items-center justify-center shrink-0 mt-1">
                      <span className="text-red-600 font-black">!</span>
                   </div>
                   <div>
                      <h4 className="font-black uppercase text-sm tracking-widest">Syncing Records</h4>
                      <p className="text-red-700/70 text-xs font-bold mt-1">
                        Transaction confirmed. Finalizing your digital credentials. Session: {session_id?.substring(0, 10)}
                      </p>
                   </div>
                 </>
               )}
            </div>

            {/* Itinerary Details */}
            <div className="grid grid-cols-2 gap-8 mb-12 px-2">
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Service Initiation</p>
                  <p className="text-sm font-black text-gray-900">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
               </div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Renewal Window</p>
                  <p className="text-sm font-black text-gray-900 uppercase">
                    {expiryDate ? expiryDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Pending Sync'}
                  </p>
               </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <Link
                  href="/agency/subscriptions"
                  className="flex items-center justify-center gap-3 py-5 bg-gray-900 text-white rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all shadow-xl shadow-gray-200 transform hover:scale-105"
               >
                  <Calendar size={14} /> Service Deck
               </Link>
               <Link
                  href="/agency/dashboard"
                  className="flex items-center justify-center gap-3 py-5 border-2 border-emerald-100 text-emerald-600 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-50 transition-all"
               >
                  <Home size={14} /> Dashboard
               </Link>
            </div>
          </div>

          <div className="bg-gray-50 py-4 text-center">
             <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em]">Official Travel Truck Partner Pass</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
