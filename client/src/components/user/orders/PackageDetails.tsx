import React, { useState } from 'react';
import {
  Package,
  Clock,
  Utensils,
  MapPin,
  Calendar,
  Check,
  CheckCircle,
  Circle,
  AlertCircle,
} from 'lucide-react';

import { ProductData } from '@/types/user/profile';

interface PlanDay {
  date: string;
  day: number;
  title: string;
  activities: string[];
  completedActivities?: number[];
  isCompleted?: boolean;
}

interface PackageDetailsProps {
  product: ProductData;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
  plan?: PlanDay[];
  tripProgress?: {
    currentDay: number;
    completedDays: number[];
    startedAt?: string;
    completedAt?: string;
  };
  startDate?: string;
}

export default function PackageDetails({
  product,
  status,
  plan,
  tripProgress,
  startDate,
}: PackageDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  const productName = product?.title || product?.name;
  const productImages = product?.images || [];
  const productDuration = product?.duration || null;
  const productDescription = product?.description || null;
  const productAvailableFoods = product?.availableFoods || [];
  const hasPlan = plan && plan.length > 0;

  const isActivityCompleted = (day: number, activityIndex: number) => {
    const planDay = plan?.find((p) => p.day === day);
    return planDay?.completedActivities?.includes(activityIndex) || false;
  };

  const isDayCompleted = (day: number) => {
    const planDay = plan?.find((p) => p.day === day);
    return planDay?.isCompleted || false;
  };

  const isCurrentDay = (day: number) => {
    return tripProgress?.currentDay === day;
  };

  const getDayProgress = (day: number) => {
    const planDay = plan?.find((p) => p.day === day);
    if (!planDay) return 0;
    const total = planDay.activities.length;
    const completed = planDay.completedActivities?.length || 0;
    return Math.round((completed / total) * 100);
  };

  return (
    <>
      {/* Package Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Package className="text-blue-600" size={22} />
            Package Information
          </h2>
        </div>

        <div className="p-6">
          {/* Image Gallery */}
          {productImages.length > 0 && (
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
                      <img
                        src={img}
                        alt={`View ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
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
      {hasPlan && status !== 'Cancelled' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Your Trip Plan</h2>
              {status === 'Ongoing' && (
                <span className="text-sm text-blue-600 font-medium">
                  Day {tripProgress?.currentDay || 1} of {plan.length}
                </span>
              )}
            </div>
          </div>

          <div className="p-6">
            {status === 'Upcoming' ? (
              <div className="text-center py-8">
                <Clock className="mx-auto text-blue-500 mb-3" size={48} />
                <p className="text-gray-600 mb-2 font-medium">
                  Your trip starts soon!
                </p>
                {startDate && (
                  <p className="text-sm text-gray-500 mb-4">
                    Starting on{' '}
                    {new Date(startDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                )}
                <p className="text-xs text-gray-400">
                  The agency will start tracking your trip on the start date
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {plan.map((planDay, idx) => {
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
                            const activityCompleted = isActivityCompleted(
                              dayNumber,
                              actIdx
                            );

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

            {status === 'Completed' && (
              <div className="mt-6 p-6 bg-purple-50 border-2 border-purple-200 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500 rounded-full">
                    <CheckCircle className="text-white" size={32} />
                  </div>
                  <div>
                    <p className="font-bold text-purple-800 text-lg">
                      Trip Completed!
                    </p>
                    <p className="text-sm text-purple-600 mt-1">
                      Completed on{' '}
                      {tripProgress?.completedAt &&
                        new Date(tripProgress.completedAt).toLocaleDateString(
                          'en-US',
                          {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          }
                        )}
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
    </>
  );
}