import { createServerAxios } from "@/services/serverApi";
import Link from "next/link";
import { CheckCircle, Sparkles, ArrowRight, Home, CreditCard, Calendar, Shield } from "lucide-react";

export const dynamic = "force-dynamic";

async function activateSubscription(subscriptionId: string) {
    const serverApi = await createServerAxios();
    try {
        console.log(`[CLIENT] Activating subscription for session: ${subscriptionId}`);
        const res = await serverApi.post(
            `/shared/subscriptions/hotel/activate`,
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
    const planName = subscriptionData?.name || "Premium Plan";
    const displayAmount = subscriptionData?.amount || amount;
    const expiryDate = subscriptionData?.endDate ? new Date(subscriptionData.endDate) : null;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 p-4 sm:p-6">
            <div className="w-full max-w-lg">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
                </div>

                <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Success Header with Gradient */}
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 sm:p-8 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

                        {/* Animated Success Icon */}
                        <div className="relative inline-block animate-in zoom-in-50 duration-500">
                            <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20"></div>
                            <div className="relative bg-white rounded-full p-4 sm:p-5 shadow-xl">
                                <CheckCircle className="text-emerald-600 animate-in zoom-in duration-300 delay-200" size={60} strokeWidth={2.5} />
                            </div>
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-bold text-white mt-6 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                            Payment Successful!
                        </h1>
                        <div className="flex items-center justify-center space-x-2 text-emerald-100 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
                            <Sparkles className="w-4 h-4" />
                            <p className="text-sm sm:text-base">Your transaction is complete</p>
                            <Sparkles className="w-4 h-4" />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 sm:p-8">
                        {/* Plan & Amount Display */}
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 mb-6 border-2 border-emerald-100 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-emerald-500 rounded-full p-2">
                                        <CreditCard className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-xs font-medium uppercase tracking-wider">{planName}</p>
                                        <p className="text-3xl font-bold text-emerald-600">₹{displayAmount}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-400 text-[10px] uppercase font-bold">Status</p>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                        Paid
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Status Message */}
                        <div className={`rounded-2xl p-4 sm:p-5 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-600 ${activated
                            ? 'bg-green-50 border-2 border-green-200'
                            : 'bg-red-50 border-2 border-red-200'
                            }`}>
                            <div className="flex items-start space-x-3">
                                {activated ? (
                                    <>
                                        <Shield className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-green-800 text-base sm:text-lg">
                                                Subscription Activated
                                            </p>
                                            <p className="text-green-600 text-sm mt-1">
                                                Your account has been upgraded. Transaction reference: <span className="font-mono font-bold">{transactionId}</span>
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-6 h-6 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-red-600 font-bold text-sm">!</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-red-800 text-base sm:text-lg">
                                                Activation Pending
                                            </p>
                                            <p className="text-red-600 text-sm mt-1">
                                                Payment received, but activation encountered an issue. Please contact support with ID: <span className="font-mono font-bold">{session_id?.substring(0, 8)}</span>
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="bg-gray-50 rounded-2xl p-5 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-700">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-500 text-[10px] uppercase font-bold mb-1">Transaction ID</p>
                                    <p className="text-xs font-mono text-gray-800 break-all">{transactionId}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-[10px] uppercase font-bold mb-1">Valid Until</p>
                                    <p className="text-sm font-semibold text-gray-800">
                                        {expiryDate ? expiryDate.toLocaleDateString('en-IN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }) : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-900">
                            <Link
                                href="/hotel/subscriptions"
                                className="flex items-center justify-center space-x-2 w-full px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                            >
                                <Calendar className="w-5 h-5" />
                                <span>View Subscriptions</span>
                                <ArrowRight className="w-5 h-5" />
                            </Link>

                            <Link
                                href="/hotel/profile"
                                className="flex items-center justify-center space-x-2 w-full px-6 py-3.5 border-2 border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 font-semibold"
                            >
                                <Home className="w-5 h-5" />
                                <span>Go to Profile</span>
                            </Link>
                        </div>

                        {/* Footer Note */}
                        <p className="text-center text-gray-500 text-xs mt-6 animate-in fade-in duration-500 delay-1000">
                            A confirmation email has been sent to your registered email address
                        </p>
                    </div>
                </div>

                {/* Help Text */}
                <p className="text-center text-gray-600 text-sm mt-6 animate-in fade-in duration-500 delay-1000">
                    Need help? <a href="/support" className="text-emerald-600 hover:text-emerald-700 font-medium underline">Contact Support</a>
                </p>
            </div>
        </div>
    );
}
