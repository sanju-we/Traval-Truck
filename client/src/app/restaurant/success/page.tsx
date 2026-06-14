import { createServerAxios } from "@/services/serverApi";
import Link from "next/link";
import { CheckCircle, Sparkles, ArrowRight, Home, CreditCard, Calendar, Shield, Utensils } from "lucide-react";

export const dynamic = "force-dynamic";

async function activateSubscription(subscriptionId: string) {
    const serverApi = await createServerAxios();
    try {
        console.log(`[CLIENT] Activating subscription for session: ${subscriptionId}`);
        const res = await serverApi.post(
            `/shared/subscriptions/restaurant/activate`,
            { subscriptionId }
        );
        console.log(`[CLIENT] Activation response:`, res.data);
        return res.data.success ? res.data.data : null;
    } catch (err) {
        const error = err as Error & { response?: { data?: unknown } };
        console.error("[CLIENT] Activation failed:", error.message, error.response?.data);
        return null;
    }
}

export default async function PaymentSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ session_id?: string; amount?: string }>;
}) {
    const { session_id, amount: rawAmount } = await searchParams;
    const amount = rawAmount || null;

    let subscriptionData = null;

    if (session_id) {
        subscriptionData = await activateSubscription(session_id);
    }

    const activated = !!subscriptionData;
    const transactionId = subscriptionData?.paymentId || "N/A";
    const planName = subscriptionData?.name || "Culinary Partner";
    const displayAmount = subscriptionData?.amount || amount;
    const expiryDate = subscriptionData?.endDate ? new Date(subscriptionData.endDate) : null;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-4 sm:p-6">
            <div className="w-full max-w-lg">
                <div className="relative bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-orange-100">
                    {/* Success Header */}
                    <div className="bg-orange-600 p-8 sm:p-10 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/5 backdrop-blur-[2px]"></div>

                        <div className="relative inline-block">
                            <div className="bg-white rounded-full p-5 shadow-xl">
                                <CheckCircle className="text-orange-600" size={50} strokeWidth={2.5} />
                            </div>
                        </div>

                        <h1 className="text-3xl font-black text-white mt-6 mb-2 uppercase tracking-tighter">
                            Service Online!
                        </h1>
                        <p className="text-orange-100 font-bold uppercase tracking-widest text-[10px]">
                            Dining Partnership Activated
                        </p>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 sm:p-10">
                        {/* Plan & Amount */}
                        <div className="bg-orange-50/50 rounded-3xl p-6 mb-8 border border-orange-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-orange-600 rounded-2xl p-3 shadow-lg">
                                        <Utensils className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{planName}</p>
                                        <p className="text-3xl font-black text-gray-900">₹{displayAmount?.toLocaleString('en-IN')}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="px-3 py-1 bg-white text-orange-600 border border-orange-100 rounded-full text-[10px] font-black uppercase">
                                        Verified
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Status Message */}
                        <div className={`rounded-3xl p-6 mb-8 border ${activated ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                            <div className="flex items-start space-x-4">
                                {activated ? (
                                    <>
                                        <Shield className="w-6 h-6 text-emerald-600 mt-1" />
                                        <div>
                                            <p className="font-black text-gray-900 text-lg uppercase tracking-tight">Active Coverage</p>
                                            <p className="text-emerald-700 text-sm font-medium mt-1 leading-relaxed">
                                                Your restaurant is now featured. Transaction ID: <span className="font-mono font-bold break-all block mt-1 text-xs opacity-60">{transactionId}</span>
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                                            <span className="text-red-600 font-black">!</span>
                                        </div>
                                        <div>
                                            <p className="font-black text-red-900 text-lg uppercase tracking-tight">Sync Delayed</p>
                                            <p className="text-red-700 text-sm font-medium mt-1">
                                                Payment received. Activation pending sync with our global registry. ID: {session_id?.substring(0, 10)}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-6 bg-gray-50 rounded-3xl p-6 mb-8">
                            <div>
                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Issue Date</p>
                                <p className="text-sm font-bold text-gray-900">{new Date().toLocaleDateString('en-IN')}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Coverage End</p>
                                <p className="text-sm font-bold text-gray-900">{expiryDate ? expiryDate.toLocaleDateString('en-IN') : 'N/A'}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4">
                            <Link
                                href="/restaurant/subscriptions"
                                className="flex items-center justify-center gap-3 w-full py-5 bg-orange-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-orange-700 transition-all shadow-xl shadow-orange-100 transform hover:scale-[1.02]"
                            >
                                <Calendar size={18} />
                                Service Deck
                                <ArrowRight size={18} />
                            </Link>

                            <Link
                                href="/restaurant/profile"
                                className="flex items-center justify-center gap-3 w-full py-5 border-2 border-gray-100 text-gray-400 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] hover:bg-gray-50 transition-all"
                            >
                                <Home size={16} />
                                DASHBOARD
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
