"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { XCircle, ArrowLeft, Home, RefreshCcw, HelpCircle, Ticket, AlertTriangle, ShieldAlert, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { SHARED_API_METHODS } from "@/services/APIs/shared.api.service";
import TravelTruckLoading from "@/components/shared/TravelTruckLoading";

export default function PaymentCancelPage() {
    const searchParams = useSearchParams();
    const planId = searchParams.get("planId");
    const amount = searchParams.get("amount");
    const [planName, setPlanName] = useState<string | null>(null);
    const [loading, setLoading] = useState(!!planId);

    useEffect(() => {
        if (planId) {
            (async () => {
                const res = await SHARED_API_METHODS.subscriptionDetails("agency", planId);
                if (res.success) {
                    setPlanName(res.data.name);
                }
                setLoading(false);
            })();
        }
    }, [planId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white p-10">
                <TravelTruckLoading />
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#FFF5F5] p-4 sm:p-6 text-slate-900">
            <div className="w-full max-w-xl">
                <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="relative bg-white rounded-[3rem] shadow-2xl overflow-hidden border-2 border-red-50"
                >
                    {/* Header Pass - Cancelled */}
                    <div className="bg-red-600 p-8 sm:p-12 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
                        <div className="absolute -top-10 -right-10 opacity-10">
                           <Globe size={200} className="rotate-12" />
                        </div>

                        <div className="relative inline-block mb-6">
                            <div className="bg-white rounded-full p-6 shadow-xl">
                                <XCircle className="text-red-600" size={48} strokeWidth={3} />
                            </div>
                        </div>

                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
                            Identity <span className="text-red-200">Pending</span>
                        </h1>
                        <p className="text-red-100 font-bold uppercase tracking-[0.3em] text-[10px] mt-4 opacity-80">
                            Agency Verification Interrupted
                        </p>
                    </div>

                    {/* Ticket Body */}
                    <div className="p-8 sm:p-12">
                        {/* Info Message */}
                        <div className="bg-red-50/50 border border-red-100 rounded-[2rem] p-8 mb-10">
                            <div className="flex items-start gap-4">
                                <AlertTriangle className="text-red-600 shrink-0" size={24} />
                                <div>
                                    <h4 className="font-black text-gray-900 text-lg uppercase tracking-tight">Transaction Paused</h4>
                                    <p className="text-gray-500 text-sm font-medium mt-1 leading-relaxed">
                                        Your agency credentials for <span className="font-bold text-gray-700">{planName || "the selected tier"}</span> hasn't been upgraded. You can resume the secure boarding process whenever you're ready.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Order Recap */}
                        <div className="space-y-4 mb-10 px-4 opacity-50 grayscale">
                           <div className="flex justify-between items-center text-xs font-black text-gray-400 tracking-[0.2em] uppercase">
                              <span className="flex items-center gap-2"><Ticket size={14} className="rotate-45" /> {planName || "Service Package"}</span>
                              <span>₹{amount?.toLocaleString() || "---"}</span>
                           </div>
                           <div className="h-px bg-gray-100 w-full" />
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link
                                href="/agency/subscriptions"
                                className="flex items-center justify-center gap-3 py-5 bg-red-600 text-white rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-red-700 transition-all shadow-xl shadow-red-100 transform hover:scale-105"
                            >
                                <RefreshCcw size={16} /> Re-verify Payment
                            </Link>

                            <Link
                                href="/agency"
                                className="flex items-center justify-center gap-3 py-5 border-2 border-gray-100 text-gray-400 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-50 transition-all"
                            >
                                <Home size={16} /> Dashboard
                            </Link>
                        </div>
                    </div>

                    <div className="bg-gray-50 py-4 text-center">
                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em]">Official Agency Support Protocol</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
