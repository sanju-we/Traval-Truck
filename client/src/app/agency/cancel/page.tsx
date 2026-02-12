import Link from "next/link";
import { XCircle, ArrowLeft, Home, RefreshCcw, HelpCircle } from "lucide-react";

export default function PaymentCancelPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-4 sm:p-6">
            <div className="w-full max-w-lg">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
                </div>

                <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Cancel Header with Gradient */}
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 sm:p-8 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

                        {/* Animated Cancel Icon */}
                        <div className="relative inline-block animate-in zoom-in-50 duration-500">
                            <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20"></div>
                            <div className="relative bg-white rounded-full p-4 sm:p-5 shadow-xl">
                                <XCircle className="text-red-600 animate-in zoom-in duration-300 delay-200" size={60} strokeWidth={2.5} />
                            </div>
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-bold text-white mt-6 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                            Payment Cancelled
                        </h1>
                        <p className="text-red-100 text-sm sm:text-base animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
                            Your subscription purchase was not completed
                        </p>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 sm:p-8">
                        {/* Info Message */}
                        <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4 sm:p-5 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
                            <div className="flex items-start space-x-3">
                                <HelpCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-orange-800 text-base sm:text-lg">
                                        What Happened?
                                    </p>
                                    <p className="text-orange-700 text-sm mt-1">
                                        You cancelled the payment process or closed the payment window. No charges were made to your account.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Common Reasons */}
                        <div className="bg-gray-50 rounded-2xl p-5 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-600">
                            <h3 className="font-semibold text-gray-800 mb-3">Common Reasons for Cancellation:</h3>
                            <ul className="space-y-2">
                                {[
                                    'Changed your mind about the subscription',
                                    'Want to review plan features again',
                                    'Payment method issues',
                                    'Accidentally closed the payment window'
                                ].map((reason, idx) => (
                                    <li key={idx} className="flex items-start space-x-2 text-gray-700 text-sm">
                                        <span className="text-orange-500 font-bold mt-0.5">•</span>
                                        <span>{reason}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-700">
                            <Link
                                href="/agency/subscriptions"
                                className="flex items-center justify-center space-x-2 w-full px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                            >
                                <RefreshCcw className="w-5 h-5" />
                                <span>Try Again</span>
                            </Link>

                            <Link
                                href="/agency/dashboard"
                                className="flex items-center justify-center space-x-2 w-full px-6 py-3.5 border-2 border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 font-semibold"
                            >
                                <Home className="w-5 h-5" />
                                <span>Go to Dashboard</span>
                            </Link>
                        </div>

                        {/* Footer Note */}
                        <p className="text-center text-gray-500 text-xs mt-6 animate-in fade-in duration-500 delay-800">
                            Need assistance? Our support team is here to help
                        </p>
                    </div>
                </div>

                {/* Help Text */}
                <p className="text-center text-gray-600 text-sm mt-6 animate-in fade-in duration-500 delay-900">
                    Have questions? <a href="/support" className="text-emerald-600 hover:text-emerald-700 font-medium underline">Contact Support</a>
                </p>
            </div>
        </div>
    );
}
