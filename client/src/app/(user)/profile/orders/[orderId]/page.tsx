'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/user/header/page';
import { Footer } from '@/components/user/footer/page';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
  CreditCard,
  User,
  Phone,
  Mail,
  Building2,
  MessageCircle,
  Download,
  Share2,
  Utensils,
  XCircle,
  X,
  Circle,
  Check,
  ChevronRight,
} from 'lucide-react';
import { USER_API_METHODS } from '@/services/APIs/user.api.service';
import toast from 'react-hot-toast';

interface PlanDay {
  date: string;
  day: number;
  title: string;
  activities: string[];
  completedActivities?: number[];
  isCompleted?: boolean;
}

interface OrderDetails {
  id: string;
  orderId: string;
  userId: string | {
    _id: string;
    name: string;
    email: string;
    phoneNumber?: string;
  };
  productType?: 'Package' | 'Rooms' | 'Foods';
  product: any;
  amount: number;
  originalAmount?: number;
  discount?: number;
  couponId?: {
    code: string;
    discount: number;
    type: string;
  };
  ownedBy?: any;
  startDate?: string;
  endDate?: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
  plan?: PlanDay[];
  tripProgress?: {
    currentDay: number;
    completedDays: number[];
    startedAt?: string;
    completedAt?: string;
  };
  paymentId: any;
  createdAt: string;
  updatedAt?: string;
}

const CANCEL_REASONS = [
  'Change of plans',
  'Found a better deal',
  'Health issues',
  'Work commitments',
  'Weather concerns',
  'Financial reasons',
  'Travel restrictions',
  'Other (specify below)',
];

export default function UserOrderDetailsPage() {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [customReason, setCustomReason] = useState('');
  const router = useRouter();
  const params = useParams();
  const orderId = Array.isArray(params.orderId) ? params.orderId.join('') : params.orderId ?? "";

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  async function fetchOrderDetails() {
    try {
      setLoading(true);
      const response = await USER_API_METHODS.getOrderDetails(orderId);

      if (response.success) {
        console.log('Order data:', response.data);
        setOrder(response.data);
      } else {
        toast.error(response.message || 'Failed to load order details');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('An error occurred while loading order details');
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Ongoing':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Completed':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return <Clock size={16} />;
      case 'Ongoing':
        return <AlertCircle size={16} />;
      case 'Completed':
        return <CheckCircle size={16} />;
      default:
        return null;
    }
  };

  const handleChatWithAgency = () => {
    const agencyId = order?.product?.ownedBy || order?.ownedBy;
    if (agencyId) {
      router.push(`/chat/${agencyId}?orderId=${order?.orderId}`);
    } else {
      toast.error('Agency information not available');
    }
  };

  const openCancelModal = () => {
    setShowCancelModal(true);
    setSelectedReason('');
    setCustomReason('');
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedReason('');
    setCustomReason('');
  };

  const handleCancelOrder = async () => {
    if (!order) return;

    if (!selectedReason) {
      toast.error('Please select a cancellation reason');
      return;
    }

    if (selectedReason === 'Other (specify below)' && !customReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    try {
      setCancelLoading(true);

      const finalReason = selectedReason === 'Other (specify below)' ? customReason : selectedReason;

      const response = await USER_API_METHODS.cancelOrder(orderId, finalReason);

      if (response.success) {
        toast.success('Order cancelled successfully');
        setOrder(response.data);
        closeCancelModal();
      } else {
        toast.error(response.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('An error occurred while cancelling the order');
    } finally {
      setCancelLoading(false);
    }
  };

  const isActivityCompleted = (day: number, activityIndex: number) => {
    const planDay = order?.plan?.find(p => p.day === day);
    return planDay?.completedActivities?.includes(activityIndex) || false;
  };

  const isDayCompleted = (day: number) => {
    const planDay = order?.plan?.find(p => p.day === day);
    return planDay?.isCompleted || false;
  };

  const isCurrentDay = (day: number) => {
    return order?.tripProgress?.currentDay === day;
  };

  const getDayProgress = (day: number) => {
    const planDay = order?.plan?.find(p => p.day === day);
    if (!planDay) return 0;
    const total = planDay.activities.length;
    const completed = planDay.completedActivities?.length || 0;
    return Math.round((completed / total) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 font-medium">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="p-6 md:p-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
              <AlertCircle className="mx-auto text-red-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-700">Order Not Found</h3>
              <p className="text-gray-500 mt-2">The order you're looking for doesn't exist</p>
              <button
                onClick={() => router.push('/orders')}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                View All Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const productName = order.product?.title;
  const productImages = order.product?.images || [];
  const productDuration = order.product?.duration || null;
  const productDescription = order.product?.description || null;
  const productItinerary = order.product?.itinerary || [];
  const productDiscoveries = order.product?.discoveries || [];
  const productAvailableFoods = order.product?.availableFoods || [];
  const hasPlan = order.plan && order.plan.length > 0;

  const userName = typeof order.userId === 'object' ? order.userId.name : 'N/A';
  const userEmail = typeof order.userId === 'object' ? order.userId.email : 'N/A';
  const userPhone = typeof order.userId === 'object' ? order.userId.phoneNumber : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Orders</span>
        </button>

        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">Order Details</h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 border bg-white ${getStatusColor(order.status)}`}
                >
                  {getStatusIcon(order.status)}
                  {order.status}
                </span>
              </div>
              <p className="text-blue-100 font-mono text-lg">Order #{order.orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm">Booking Date</p>
              <p className="text-white font-semibold">
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-4">
            {order.status !== 'Completed' && order.status !== 'Cancelled' && (
              <button
                onClick={handleChatWithAgency}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition flex items-center gap-2 font-semibold"
              >
                <MessageCircle size={18} />
                Chat with Agency
              </button>
            )}
            {order.status === 'Upcoming' && (
              <button
                onClick={openCancelModal}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2 font-semibold"
              >
                <XCircle size={18} />
                Cancel Order
              </button>
            )}
            <button className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition flex items-center gap-2 font-semibold">
              <Download size={18} />
              Download Invoice
            </button>
            <button className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition flex items-center gap-2 font-semibold">
              <Share2 size={18} />
              Share
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Package Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Package Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Package className="text-blue-600" size={22} />
                  {order.productType || 'Package'} Information
                </h2>
              </div>

              <div className="p-6">
                {/* Image Gallery */}
                {order.product?.images && productImages.length > 0 && (
                  <div className="mb-6">
                    <div className="relative h-64 rounded-lg overflow-hidden mb-3">
                      <img
                        src={productImages[selectedImage]}
                        alt={productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {productImages.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {productImages.slice(0, 4).map((img: string, idx: number) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedImage(idx)}
                            className={`relative h-16 rounded-lg overflow-hidden border-2 transition ${
                              selectedImage === idx
                                ? 'border-blue-500'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <h3 className="text-xl font-bold text-gray-800 mb-3">{productName}</h3>

                {productDescription && (
                  <p className="text-gray-600 mb-4">{productDescription}</p>
                )}

                {productDuration && (
                  <div className="flex items-center gap-2 text-gray-700 mb-3">
                    <Clock size={18} className="text-gray-400" />
                    <span className="text-sm">
                      <span className="font-medium">Duration:</span> {productDuration}
                    </span>
                  </div>
                )}

                {/* Available Foods */}
                {productAvailableFoods.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Utensils className="text-orange-600" size={18} />
                      Meals Included
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {productAvailableFoods.map((food: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium border border-orange-100"
                        >
                          {food}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Trip Plan Progress Tracker */}
            {hasPlan && order.status !== 'Cancelled' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-800">Your Trip Plan</h2>
                    {order.status === 'Ongoing' && (
                      <span className="text-sm text-blue-600 font-medium">
                        Day {order.tripProgress?.currentDay || 1} of {order.plan?.length}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  {order.status === 'Upcoming' ? (
                    <div className="text-center py-8">
                      <Clock className="mx-auto text-blue-500 mb-3" size={48} />
                      <p className="text-gray-600 mb-2 font-medium">Your trip starts soon!</p>
                      {order.startDate && (
                        <p className="text-sm text-gray-500 mb-4">
                          Starting on{' '}
                          {new Date(order.startDate).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">The agency will start tracking your trip on the start date</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {order.plan?.map((planDay, idx) => {
                        const dayNumber = planDay.day;
                        const dayCompleted = isDayCompleted(dayNumber);
                        const current = isCurrentDay(dayNumber);
                        const progress = getDayProgress(dayNumber);

                        return (
                          <div
                            key={idx}
                            className={`relative border-2 rounded-xl overflow-hidden transition-all ${
                              dayCompleted
                                ? 'border-purple-300 bg-purple-50'
                                : current
                                ? 'border-orange-400 bg-orange-50 shadow-lg'
                                : 'border-gray-200 bg-white opacity-75'
                            }`}
                          >
                            {/* Day Header */}
                            <div className="p-5 border-b border-gray-200">
                              <div className="flex items-start gap-4">
                                <div
                                  className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg shadow-md ${
                                    dayCompleted
                                      ? 'bg-purple-500 text-white'
                                      : current
                                      ? 'bg-orange-500 text-white'
                                      : 'bg-gray-200 text-gray-600'
                                  }`}
                                >
                                  {dayCompleted ? <CheckCircle size={28} /> : dayNumber}
                                </div>

                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-bold text-gray-800 text-xl">
                                      Day {dayNumber}: {planDay.title}
                                    </h3>
                                    {current && !dayCompleted && (
                                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full animate-pulse">
                                        In Progress
                                      </span>
                                    )}
                                    {dayCompleted && (
                                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full flex items-center gap-1">
                                        <Check size={12} />
                                        Completed
                                      </span>
                                    )}
                                  </div>

                                  <p className="text-sm text-gray-600">
                                    {new Date(planDay.date).toLocaleDateString('en-US', {
                                      weekday: 'long',
                                      month: 'long',
                                      day: 'numeric',
                                      year: 'numeric',
                                    })}
                                  </p>

                                  {/* Progress Bar */}
                                  {!dayCompleted && progress > 0 && (
                                    <div className="mt-3">
                                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                        <span>Progress</span>
                                        <span className="font-semibold">{progress}%</span>
                                      </div>
                                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-orange-500 rounded-full transition-all duration-500 ease-out"
                                          style={{ width: `${progress}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Activities List */}
                            <div className="p-5">
                              <div className="space-y-3">
                                {planDay.activities.map((activity, actIdx) => {
                                  const activityCompleted = isActivityCompleted(dayNumber, actIdx);

                                  return (
                                    <div
                                      key={actIdx}
                                      className={`flex items-start gap-3 p-4 rounded-lg transition-all duration-300 ${
                                        activityCompleted
                                          ? 'bg-purple-100 border-2 border-purple-300'
                                          : 'bg-gray-50 border-2 border-gray-200'
                                      }`}
                                    >
                                      <div className="flex-shrink-0 mt-0.5">
                                        {activityCompleted ? (
                                          <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                                            <Check size={16} className="text-white" />
                                          </div>
                                        ) : (
                                          <Circle size={20} className="text-gray-300" />
                                        )}
                                      </div>

                                      <div className="flex-1">
                                        <p
                                          className={`text-sm ${
                                            activityCompleted
                                              ? 'text-purple-800 font-medium line-through decoration-2'
                                              : 'text-gray-700'
                                          }`}
                                        >
                                          {activity}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {order.status === 'Completed' && (
                    <div className="mt-6 p-6 bg-purple-50 border-2 border-purple-200 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500 rounded-full">
                          <CheckCircle className="text-white" size={32} />
                        </div>
                        <div>
                          <p className="font-bold text-purple-800 text-lg">Trip Completed!</p>
                          <p className="text-sm text-purple-600 mt-1">
                            Completed on{' '}
                            {order.tripProgress?.completedAt &&
                              new Date(order.tripProgress.completedAt).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                          </p>
                          <p className="text-xs text-purple-500 mt-2">
                            We hope you had an amazing experience! 🎉
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Payment & Agency */}
          <div className="space-y-6">
            {/* Payment Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <CreditCard className="text-blue-600" size={22} />
                  Payment Details
                </h2>
              </div>

              <div className="p-6 space-y-4">
                {order.originalAmount && order.discount && order.discount > 0 && (
                  <>
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Original Price</span>
                      <span className="line-through">₹{order.originalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-blue-600">
                      <span className="flex items-center gap-1">
                        Discount
                        {order.couponId && (
                          <span className="text-xs bg-blue-100 px-2 py-0.5 rounded font-mono">
                            {order.couponId.code}
                          </span>
                        )}
                      </span>
                      <span>- ₹{order.discount.toLocaleString()}</span>
                    </div>
                  </>
                )}

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-medium">Total Amount</span>
                    <span className="text-3xl font-bold text-blue-600">
                      ₹{order.amount.toLocaleString()}
                    </span>
                  </div>
                  {order.originalAmount && order.discount && order.discount > 0 && (
                    <p className="text-sm text-blue-600 text-right">
                      You saved ₹{order.discount.toLocaleString()}!
                    </p>
                  )}
                </div>

                {typeof order.paymentId === 'object' && order.paymentId.transactionId && (
                  <div className="pt-4 border-t">
                    <div className="flex items-start gap-3">
                      <CreditCard className="text-gray-400 flex-shrink-0 mt-0.5" size={18} />
                      <div>
                        <p className="text-xs text-gray-500">Transaction ID</p>
                        <p className="font-mono text-sm text-gray-800 break-all">
                          {order.paymentId.transactionId}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {typeof order.paymentId === 'object' && order.paymentId.paymentMethod && (
                  <div className="flex items-start gap-3">
                    <CreditCard className="text-gray-400 flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <p className="text-xs text-gray-500">Payment Method</p>
                      <p className="font-medium text-gray-800">{order.paymentId.paymentMethod}</p>
                    </div>
                  </div>
                )}

                {typeof order.paymentId === 'object' && order.paymentId.paymentStatus && (
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-blue-500 flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <p className="text-xs text-gray-500">Payment Status</p>
                      <p className="font-medium text-blue-600">{order.paymentId.paymentStatus}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Agency Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 border-b border-purple-200">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Building2 className="text-purple-600" size={22} />
                  Travel Agency
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Agency Name</p>
                  <p className="font-semibold text-gray-800">
                    {(order.ownedBy && typeof order.ownedBy === 'object' && (order.ownedBy.companyName || order.ownedBy.name)) ||
                      (order.product?.ownedBy ? 'Agency Information' : 'N/A')}
                  </p>
                </div>

                {order.ownedBy && typeof order.ownedBy === 'object' && order.ownedBy.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="text-gray-400 flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm text-gray-800 break-all">{order.ownedBy.email}</p>
                    </div>
                  </div>
                )}

                {order.status !== 'Completed' && order.status !== 'Cancelled' && (
                  <button
                    onClick={handleChatWithAgency}
                    className="w-full mt-4 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-semibold"
                  >
                    <MessageCircle size={18} />
                    Contact Agency
                  </button>
                )}
              </div>
            </div>

            {/* Schedule Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className='bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200'>
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Calendar className="text-blue-600" size={22} />
                  Trip Schedule
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <Calendar className="text-blue-600" size={24} />
                  <div>
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p className="font-semibold text-gray-800">
                      {order.startDate
                        ? new Date(order.startDate).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })
                        : 'Not set yet'}
                    </p>
                  </div>
                </div>

                {order.endDate && (
                  <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <Calendar className="text-purple-600" size={24} />
                    <div>
                      <p className="text-sm text-gray-600">End Date</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(order.endDate).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <XCircle className="text-red-600" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Cancel Order</h2>
                  <p className="text-sm text-gray-500">Order #{order.orderId}</p>
                </div>
              </div>
              <button
                onClick={closeCancelModal}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  We're sorry to see you cancel your order. Please let us know why you're canceling so we can improve our service.
                </p>
              </div>

              {/* Cancellation Reasons */}
              <div className="space-y-3 mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select a reason for cancellation:
                </label>
                {CANCEL_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                      selectedReason === reason
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancelReason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="w-5 h-5 text-red-600 focus:ring-red-500"
                    />
                    <span className="ml-3 text-gray-800 font-medium">{reason}</span>
                  </label>
                ))}
              </div>

              {/* Custom Reason Text Area */}
              {selectedReason === 'Other (specify below)' && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Please specify your reason:
                  </label>
                  <textarea
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Enter your reason for cancellation..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none resize-none"
                  />
                  {customReason.trim() && (
                    <p className="text-sm text-gray-500 mt-2">
                      {customReason.length} characters
                    </p>
                  )}
                </div>
              )}

              {/* Warning Message */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm font-semibold text-yellow-800">Important Notice</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Once you cancel this order, the action cannot be undone. Refund processing may take 5-7 business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 rounded-b-2xl">
              <button
                onClick={closeCancelModal}
                disabled={cancelLoading}
                className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancelLoading || !selectedReason || (selectedReason === 'Other (specify below)' && !customReason.trim())}
                className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {cancelLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Cancelling...</span>
                  </>
                ) : (
                  <>
                    <XCircle size={18} />
                    <span>Confirm Cancellation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}