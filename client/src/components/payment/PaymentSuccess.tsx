"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Suspense } from "react";

function PaymentSuccessContent({ role }: { role: string }) {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center">
                <div className="flex justify-center mb-6">
                    <CheckCircle className="w-20 h-20 text-emerald-500" />
                </div>

                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Payment Successful!
                </h1>

                <p className="text-gray-600 mb-6">
                    Your payment has been processed successfully. Your wallet will be updated shortly.
                </p>

                {sessionId && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-500 mb-1">Session ID</p>
                        <p className="text-xs font-mono text-gray-700 break-all">
                            {sessionId}
                        </p>
                    </div>
                )}

                <Link
                    href={`/${role}/wallet`}
                    className="inline-block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                    Go to Wallet
                </Link>
            </div>
        </div>
    );
}

export default function PaymentSuccess({ role }: { role: string }) {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center">
                <div className="text-gray-600">Loading...</div>
            </div>
        }>
            <PaymentSuccessContent role={role} />
        </Suspense>
    );
}
