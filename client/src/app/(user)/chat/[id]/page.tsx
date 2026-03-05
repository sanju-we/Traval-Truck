'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/user/header/page';
import { Footer } from '@/components/user/footer/page';
import ChatWindow from '@/components/shared/ChatWindow';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { USER_API_METHODS } from '@/services/APIs/user.api.service';
import { MessageSquare, ArrowLeft, Building2, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UserChatPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const receiverId = params.id as string;
    const orderId = searchParams.get('orderId');
    const user = useSelector((state: RootState) => state.details.currentUser);
    const [receiverInfo, setReceiverInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (receiverId) {
            fetchReceiverInfo();
        }
    }, [receiverId]);

    const fetchReceiverInfo = async () => {
        try {
            setLoading(true);
            // We need an API to get agency details specifically
            // Assuming USER_API_METHODS has something or we can use getAll and filter
            const response = await USER_API_METHODS.getAgencyDetails(receiverId);
            if (response.success) {
                setReceiverInfo(response.data);
            }
        } catch (error) {
            console.error('Error fetching receiver info:', error);
            // Fallback to name from order if available?
            setReceiverInfo({ _id: receiverId, companyName: 'Agency' });
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return null; // Protected by middleware anyway
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium">Back</span>
                    </button>
                    {orderId && (
                        <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                            Discussion for Order #{orderId}
                        </div>
                    )}
                </div>

                <div className="grid lg:grid-cols-4 gap-8 h-[70vh]">
                    {/* Sidebar: Participants/Info */}
                    <div className="lg:col-span-1 hidden lg:block">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
                            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <MessageSquare className="text-emerald-600" size={20} />
                                Chat Details
                            </h2>

                            {loading ? (
                                <div className="space-y-4 animate-pulse">
                                    <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md">
                                        <Building2 size={40} className="text-emerald-600" />
                                    </div>
                                    <h3 className="font-bold text-xl text-gray-800 mb-1">
                                        {receiverInfo?.companyName || 'Agency'}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-4 italic">
                                        Verified Business Partner
                                    </p>

                                    <div className="pt-6 border-t border-gray-100 space-y-4 text-left">
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                                                <UserIcon size={16} />
                                            </div>
                                            <span>Response time: ~2h</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="lg:col-span-3 h-full relative">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full overflow-hidden flex flex-col">
                            {/* We can either use ChatWindow directly or refactor its content */}
                            {/* For now, I'll use it directly but ideally it would be a "ChatContent" component */}
                            <ChatWindow
                                userId={user.id}
                                receiverId={receiverId}
                                receiverName={receiverInfo?.companyName || 'Agency'}
                                receiverModel="Agency"
                                isOpen={true}
                                onClose={() => router.back()}
                                isModal={false}
                            />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Custom Styles for full-page ChatWindow */}
            <style jsx global>{`
                .fixed.bottom-4.right-4 {
                    position: relative !important;
                    bottom: 0 !important;
                    right: 0 !important;
                    width: 100% !important;
                    height: 100% !important;
                    box-shadow: none !important;
                    border: none !important;
                }
            `}</style>
        </div>
    );
}
