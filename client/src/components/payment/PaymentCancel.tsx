"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";

export default function PaymentCancel({ role }: { role: string }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center">
                <div className="flex justify-center mb-6">
                    <XCircle className="w-20 h-20 text-red-500" />
                </div>

                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Payment Cancelled
                </h1>

                <p className="text-gray-600 mb-8">
                    Your payment was cancelled. No charges have been made to your account.
                </p>

                <div className="space-y-3">
                    <Link
                        href={`/${role}/wallet`}
                        className="inline-block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                        Try Again
                    </Link>

                    <Link
                        href={`/${role}/dashboard`}
                        className="inline-block w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
