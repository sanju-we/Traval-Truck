"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { XCircle, ArrowLeft, Home, RefreshCcw, HelpCircle, Ticket, AlertTriangle, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { SHARED_API_METHODS } from "@/services/APIs/shared.api.service";
import { ApiResponse } from "@/services/api.service";
import { Subscription } from "@/types/agency";
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
                const res = await SHARED_API_METHODS.subscriptionDetails("hotel", planId) as ApiResponse<Subscription>;
                if (res && res.success && res.data) {
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
        <div className="flex items-center justify-center min-h-screen bg-[#FFF5F5] p-4 sm:p-6">
            <div className="w-full max-w-xl">
                <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="relative bg-white rounded-[3rem] shadow-2xl overflow-hidden border-2 border-red-50"
                >
                    {/* Header Pass - Cancelled */}
                    <div className="bg-red-600 p-8 sm:p-12 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
                        <div className="absolute -top-10 -left-10 opacity-10">
                           <ShieldAlert size={200} />
                        </div>

                        <div className="relative inline-block mb-6">
                            <div className="bg-white rounded-full p-6 shadow-xl">
                                <XCircle className="text-red-600" size={48} strokeWidth={3} />
                            </div>
                        </div>

                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
                            Route <span className="text-red-200">Interrupted</span>
                        </h1>
                        <p className="text-red-100 font-bold uppercase tracking-[0.3em] text-[10px] mt-4 opacity-80">
                            Transaction Not Finalized
                        </p>
                    </div>

                    {/* Ticket Body */}
                    <div className="p-8 sm:p-12">
                        {/* Info Message */}
                        <div className="bg-red-50/50 border border-red-100 rounded-[2rem] p-8 mb-10">
                            <div className="flex items-start gap-4">
                                <AlertTriangle className="text-red-600 shrink-0" size={24} />
                                <div>
                                    <h4 className="font-black text-gray-900 text-lg uppercase tracking-tight">Payment Cancelled</h4>
                                    <p className="text-gray-500 text-sm font-medium mt-1 leading-relaxed">
                                        The connection to our payment gateway was closed. Your {planName || "Selected Plan"} booking was not completed and zero funds were transferred.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Order Recap (What was missed) */}
                        <div className="space-y-4 mb-10 px-4 scale-95 opacity-80 grayscale">
                           <div className="flex justify-between items-center text-sm font-bold text-gray-400 tracking-widest uppercase">
                              <span className="flex items-center gap-2"><Ticket size={14} /> {planName || "Target Route"}</span>
                              <span>₹{amount?.toLocaleString() || "---"}</span>
                           </div>
                           <div className="h-px bg-gray-100 w-full" />
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link
                                href="/hotel/subscriptions"
                                className="flex items-center justify-center gap-3 py-5 bg-red-600 text-white rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-red-700 transition-all shadow-xl shadow-red-100 transform hover:scale-105"
                            >
                                <RefreshCcw size={16} /> Resume Booking
                            </Link>

                            <Link
                                href="/hotel"
                                className="flex items-center justify-center gap-3 py-5 border-2 border-gray-100 text-gray-400 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-50 transition-all"
                            >
                                <Home size={16} /> Dashboard
                            </Link>
                        </div>
                    </div>

                    <div className="bg-gray-50 py-4 text-center">
                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em]">Help Line: 1-800-TRUCK-SUPPORT</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
