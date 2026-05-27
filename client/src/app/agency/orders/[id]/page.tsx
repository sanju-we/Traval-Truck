'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SideNavbar from '@/components/agency/SideNavbar';
import {
  ArrowLeft,
  Calendar,
  User,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  CreditCard,
  Building2,
  UtensilsCrossed,
  Hotel,
  Briefcase,
  Play,
  Check,
  ChevronRight,
  Flag,
  Circle,
  X
} from 'lucide-react';
import { AGENCY_API_METHODS } from '@/services/APIs/agency.api.service';
import toast from 'react-hot-toast';
import SetStartDateModal from '@/components/agency/SetStartDateModal';
import { OrderDetails } from '@/types/agency';
import VendorFooter from '@/components/shared/Footer';
import TravelTruckLoading from '@/components/shared/TravelTruckLoading';

export default function OrderDetailsPage() {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completingActivity, setCompletingActivity] = useState<{ day: number, activity: number } | null>(null);
  const [testMode, setTestMode] = useState(false);
  const router = useRouter();
  const params = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const orderId = params.id as string;

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  async function fetchOrderDetails() {
    try {
      setLoading(true);
      const response = await AGENCY_API_METHODS.getOrder(orderId);

      if (response.success) {
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

  function handleOpenModal() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  function handleSuccess(updatedOrder: OrderDetails) {
    setOrder(updatedOrder);
  }

  const handleStartTrip = async () => {
    try {
      setActionLoading(true);
      if (!order?.startDate) return toast.error('Start date is not set');

      const response = await AGENCY_API_METHODS.startTrip(orderId);

      if (response.success) {
        toast.success('Trip started successfully!');
        setOrder(response.data);
        setShowStartModal(false);
      } else {
        toast.error(response.message || 'Failed to start trip');
      }
    } catch (error) {
      console.error('Error starting trip:', error);
      toast.error('An error occurred while starting the trip');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteActivity = async (day: number, activityIndex: number) => {
    try {
      setCompletingActivity({ day, activity: activityIndex });
      setActionLoading(true);

      const response = await AGENCY_API_METHODS.completeActivity(orderId, day, activityIndex);

      if (response.success) {
        toast.success('Activity completed!');
        setOrder(response.data);
      } else {
        toast.error(response.message || 'Failed to complete activity');
      }
    } catch (error) {
      console.error('Error completing activity:', error);
      toast.error('An error occurred');
    } finally {
      setActionLoading(false);
      setCompletingActivity(null);
    }
  };

  const handleCompleteDay = async (day: number) => {
    try {
      setActionLoading(true);
      const response = await AGENCY_API_METHODS.completeDayItinerary(orderId, day);

      if (response.success) {
        toast.success(`Day ${day} marked as completed!`);
        setOrder(response.data);
      } else {
        toast.error(response.message || 'Failed to complete day');
      }
    } catch (error) {
      console.error('Error completing day:', error);
      toast.error('An error occurred');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteTrip = async () => {
    try {
      setActionLoading(true);
      const response = await AGENCY_API_METHODS.completeTrip(orderId);

      if (response.success) {
        toast.success('Trip completed successfully!');
        setOrder(response.data);
        setShowCompleteModal(false);
      } else {
        toast.error(response.message || 'Failed to complete trip');
      }
    } catch (error) {
      console.error('Error completing trip:', error);
      toast.error('An error occurred');
    } finally {
      setActionLoading(false);
    }
  };

  const getProductIcon = (type: string) => {
    switch (type) {
      case 'Package':
        return <Briefcase className="text-blue-600" size={24} />;
      case 'Rooms':
        return <Hotel className="text-purple-600" size={24} />;
      case 'Foods':
        return <UtensilsCrossed className="text-orange-600" size={24} />;
      default:
        return <Package className="text-gray-600" size={24} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Ongoing':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Completed':
        return 'bg-green-100 text-green-700 border-green-200';
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

  const canCompleteActivity = (day: number, activityIndex: number) => {
    if (order?.status !== 'Ongoing') return false;
    // const planDay = order?.plan?.find(p => p.day === day);
    // if (!planDay) return false;

    // Check if this is the current day
    // if (!isCurrentDay(day)) return false;

    // Check if already completed
    if (isActivityCompleted(day, activityIndex)) return false;

    // Check if previous activity is completed (or this is the first activity)
    if (activityIndex === 0) return true;
    return isActivityCompleted(day, activityIndex - 1);
  };

  const canCompleteDay = (day: number) => {
    if (order?.status !== 'Ongoing') return false;
    const planDay = order?.plan?.find(p => p.day === day);
    if (!planDay || planDay.isCompleted) return false;

    // All activities must be completed
    const totalActivities = planDay.activities.length;
    const completedCount = planDay.completedActivities?.length || 0;
    return completedCount === totalActivities;
  };

  const allDaysCompleted = () => {
    if (!order?.plan) return false;
    return order.plan.every(day => day.isCompleted);
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
      <div className="bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-screen">
          <TravelTruckLoading />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <SideNavbar />
        <div className="flex-1 flex flex-col">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
              <AlertCircle className="mx-auto text-red-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-700">Order Not Found</h3>
              <p className="text-gray-500 mt-2">The order you're looking for doesn't exist</p>
              <button
                onClick={() => router.back()}
                className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
              >
                Go Back
              </button>
            </div>
          </div>
          <VendorFooter/>
        </div>
      </div>
    );
  }

  const productName = order.product?.title || order.product?.name || 'N/A';
  const hasPlan = order.plan && order.plan.length > 0;

  return (
    <div className="min-h-screen flex bg-gray-50">
      <SideNavbar />
      <div className="flex-1 flex flex-col">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Orders</span>
          </button>

          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold">Order Details</h1>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 border ${getStatusColor(order.status)} bg-white`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </div>
                <p className="text-emerald-100 font-mono text-lg">#{order.orderId}</p>
              </div>
              <div className="text-right">
                <p className="text-emerald-100 text-sm">Order Date</p>
                <p className="text-white font-semibold">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* Trip Actions */}
            {hasPlan && (
              <div className="mt-4 flex flex-wrap gap-3">
                {order.status === 'Upcoming' && order.startDate && (
                  <button
                    onClick={() => setShowStartModal(true)}
                    className="px-4 py-2 bg-white text-emerald-600 rounded-lg hover:bg-emerald-50 transition flex items-center gap-2 font-semibold shadow-md"
                  >
                    <Play size={18} />
                    Start Trip
                  </button>
                )}

                {order.status === 'Ongoing' && allDaysCompleted() && (
                  <button
                    onClick={() => setShowCompleteModal(true)}
                    className="px-4 py-2 bg-white text-emerald-600 rounded-lg hover:bg-emerald-50 transition flex items-center gap-2 font-semibold shadow-md"
                  >
                    <Flag size={18} />
                    Complete Trip
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Main Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Product Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      {getProductIcon(order.productType)}
                    </div>
                    <h2 className="text-lg font-bold text-gray-800">{order.productType} Details</h2>
                  </div>
                </div>

                <div className="p-6">
                  {order.product?.images && order.product.images[0] && (
                    <img
                      src={order.product.images[0]}
                      alt={productName}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}

                  <h3 className="text-xl font-bold text-gray-800 mb-3">{productName}</h3>

                  {order.product?.description && (
                    <p className="text-gray-600 mb-4">{order.product.description}</p>
                  )}

                  {order.product?.duration && (
                    <div className="flex items-center gap-2 text-gray-700 mb-3">
                      <Clock size={18} className="text-gray-400" />
                      <span className="text-sm">
                        <span className="font-medium">Duration:</span> {order.product.duration}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Trip Progress Tracker */}
              {hasPlan && order.status !== 'Cancelled' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-gray-800">Trip Progress</h2>
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
                        <Clock className="mx-auto text-yellow-500 mb-3" size={48} />
                        <p className="text-gray-600 mb-2">Trip hasn't started yet</p>
                        {order.startDate ? (
                          <>
                            <p className="text-sm text-gray-500 mb-4">
                              Scheduled to start on{' '}
                              {new Date(order.startDate).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </p>
                            <button
                              onClick={() => setShowStartModal(true)}
                              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center gap-2 mx-auto"
                            >
                              <Play size={18} />
                              Start Trip
                            </button>
                          </>
                        ) : (
                          <p className="text-sm text-red-500">Please set a start date first</p>
                        )}
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
                              className={`relative border-2 rounded-xl overflow-hidden transition-all ${dayCompleted
                                  ? 'border-green-300 bg-green-50'
                                  : current
                                    ? 'border-blue-400 bg-blue-50 shadow-lg'
                                    : 'border-gray-200 bg-white opacity-75'
                                }`}
                            >
                              {/* Day Header */}
                              <div className="p-5 border-b border-gray-200">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex items-start gap-4 flex-1">
                                    <div
                                      className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg shadow-md ${dayCompleted
                                          ? 'bg-green-500 text-white'
                                          : current
                                            ? 'bg-blue-500 text-white'
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
                                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full animate-pulse">
                                            In Progress
                                          </span>
                                        )}
                                        {dayCompleted && (
                                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
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
                                              className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
                                              style={{ width: `${progress}%` }}
                                            ></div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {order.status === 'Ongoing' && canCompleteDay(dayNumber) && (
                                    <button
                                      onClick={() => handleCompleteDay(dayNumber)}
                                      disabled={actionLoading}
                                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                                    >
                                      <CheckCircle size={16} />
                                      Complete Day
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Activities List */}
                              <div className="p-5">
                                <div className="space-y-3">
                                  {planDay.activities.map((activity, actIdx) => {
                                    const activityCompleted = isActivityCompleted(dayNumber, actIdx);
                                    const canComplete = canCompleteActivity(dayNumber, actIdx);
                                    const isCompletingThis =
                                      completingActivity?.day === dayNumber &&
                                      completingActivity?.activity === actIdx;

                                    return (
                                      <div
                                        key={actIdx}
                                        className={`group flex items-start gap-3 p-4 rounded-lg transition-all duration-300 ${activityCompleted
                                            ? 'bg-green-100 border-2 border-green-300'
                                            : canComplete
                                              ? 'bg-white border-2 border-blue-200 hover:border-blue-400 hover:shadow-md'
                                              : 'bg-gray-50 border-2 border-gray-200'
                                          }`}
                                      >
                                        <div className="flex-shrink-0 mt-0.5">
                                          {activityCompleted ? (
                                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center animate-in zoom-in duration-300">
                                              <Check size={16} className="text-white" />
                                            </div>
                                          ) : canComplete ? (
                                            <Circle size={20} className="text-blue-400" />
                                          ) : (
                                            <Circle size={20} className="text-gray-300" />
                                          )}
                                        </div>

                                        <div className="flex-1">
                                          <p
                                            className={`text-sm ${activityCompleted
                                                ? 'text-green-800 font-medium line-through decoration-2'
                                                : canComplete
                                                  ? 'text-gray-800'
                                                  : 'text-gray-500'
                                              }`}
                                          >
                                            {activity}
                                          </p>
                                        </div>

                                        {canComplete && !activityCompleted && (
                                          <button
                                            onClick={() => handleCompleteActivity(dayNumber, actIdx)}
                                            disabled={actionLoading}
                                            className="px-3 py-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition flex items-center gap-1.5 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100"
                                          >
                                            {isCompletingThis ? (
                                              <>
                                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Completing...</span>
                                              </>
                                            ) : (
                                              <>
                                                <Check size={14} />
                                                <span>Complete</span>
                                              </>
                                            )}
                                          </button>
                                        )}
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
                      <div className="mt-6 p-6 bg-green-50 border-2 border-green-200 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-green-500 rounded-full">
                            <CheckCircle className="text-white" size={32} />
                          </div>
                          <div>
                            <p className="font-bold text-green-800 text-lg">Trip Completed!</p>
                            <p className="text-sm text-green-600 mt-1">
                              Completed on{' '}
                              {order.tripProgress?.completedAt &&
                                new Date(order.tripProgress.completedAt).toLocaleDateString('en-US', {
                                  month: 'long',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Schedule Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Schedule</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
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
                            : 'Not set'}
                        </p>
                      </div>
                    </div>
                    {order.status === 'Upcoming' && (
                      <button
                        onClick={() => handleOpenModal()}
                        className="w-full px-4 py-2.5 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium text-sm"
                      >
                        <Calendar size={18} />
                        {order.startDate ? 'Change Date' : 'Set Date'}
                      </button>
                    )}
                  </div>

                  {order.endDate && (
                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
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

            {/* Right Column - Customer & Payment */}
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200">
                  <h2 className="text-lg font-bold text-gray-800">Customer Info</h2>
                </div>

                <div className="p-6 space-y-4">
                  {order.userId.profilePicture && (
                    <img
                      src={order.userId.profilePicture}
                      alt={order.userId.name}
                      className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-blue-100"
                    />
                  )}

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <User className="text-gray-400 flex-shrink-0 mt-0.5" size={18} />
                      <div>
                        <p className="text-xs text-gray-500">Name</p>
                        <p className="font-medium text-gray-800">{order.userId.name}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="text-gray-400 flex-shrink-0 mt-0.5" size={18} />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="font-medium text-gray-800 break-all">{order.userId.email}</p>
                      </div>
                    </div>

                    {order.userId.phoneNumber && (
                      <div className="flex items-start gap-3">
                        <Phone className="text-gray-400 flex-shrink-0 mt-0.5" size={18} />
                        <div>
                          <p className="text-xs text-gray-500">Phone</p>
                          <p className="font-medium text-gray-800">{order.userId.phoneNumber}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 px-6 py-4 border-b border-emerald-200">
                  <h2 className="text-lg font-bold text-gray-800">Payment Info</h2>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="text-2xl font-bold text-emerald-600">
                      ₹{order.amount.toLocaleString()}
                    </span>
                  </div>

                  {order.paymentId.transactionId && (
                    <div className="flex items-start gap-3">
                      <CreditCard className="text-gray-400 flex-shrink-0 mt-0.5" size={18} />
                      <div>
                        <p className="text-xs text-gray-500">Transaction ID</p>
                        <p className="font-mono text-sm text-gray-800">{order.paymentId.transactionId}</p>
                      </div>
                    </div>
                  )}

                  {order.paymentId.paymentMethod && (
                    <div className="flex items-start gap-3">
                      <CreditCard className="text-gray-400 flex-shrink-0 mt-0.5" size={18} />
                      <div>
                        <p className="text-xs text-gray-500">Payment Method</p>
                        <p className="font-medium text-gray-800">{order.paymentId.paymentMethod}</p>
                      </div>
                    </div>
                  )}

                  {order.paymentId.paymentStatus && (
                    <div className="flex items-start gap-3">
                      <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                      <div>
                        <p className="text-xs text-gray-500">Payment Status</p>
                        <p className="font-medium text-green-600">{order.paymentId.paymentStatus}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Owner Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 border-b border-purple-200">
                  <h2 className="text-lg font-bold text-gray-800">Service Provider</h2>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <Building2 className="text-gray-400 flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <p className="text-xs text-gray-500">Type</p>
                      <p className="font-medium text-gray-800">{order.role}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="text-gray-400 flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="font-medium text-gray-800">
                        {order.ownedBy.agencyName ||
                          order.ownedBy.restaurantName ||
                          order.ownedBy.hotelName ||
                          order.ownedBy.name ||
                          'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <VendorFooter/>
      </div>

      {/* Start Trip Modal */}
      {showStartModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-emerald-100 rounded-full">
                  <Play className="text-emerald-600" size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Start Trip</h2>
              </div>

              <p className="text-gray-600 mb-6">
                Are you sure you want to start this trip? This will mark the trip as "Ongoing" and begin
                tracking the itinerary progress.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowStartModal(false)}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartTrip}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Starting...
                    </>
                  ) : (
                    <>
                      <Play size={18} />
                      Start Trip
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complete Trip Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Flag className="text-green-600" size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Complete Trip</h2>
              </div>

              <p className="text-gray-600 mb-6">
                Congratulations! All days have been completed. Do you want to mark this entire trip as
                completed?
              </p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-2">
                  <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm font-semibold text-green-800">All itinerary days completed</p>
                    <p className="text-xs text-green-600 mt-1">
                      {order?.plan?.length} of {order?.plan?.length} days completed
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCompleteModal(false)}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCompleteTrip}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Completing...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      Complete Trip
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <SetStartDateModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          order={{ id: order.id, orderId: order.orderId }}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}