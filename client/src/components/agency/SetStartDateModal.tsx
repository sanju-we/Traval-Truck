'use client';

import { useState } from 'react';
import { Calendar, X, AlertCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { AGENCY_API_METHODS } from '@/services/APIs/agency.api.service';

interface SetStartDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    orderId: string;
    userId?: {
      name: string;
    };
    product?: {
      title: string;
    };
    startDate?: string;
  };
  onSuccess: (updatedOrder: any) => void;
}

export default function SetStartDateModal({
  isOpen,
  onClose,
  order,
  onSuccess,
}: SetStartDateModalProps) {
  const [startDate, setStartDate] = useState(
    order.startDate ? new Date(order.startDate).toISOString().split('T')[0] : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get tomorrow's date in YYYY-MM-DD format
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const minDate = getTomorrowDate();

  const handleSubmit = async () => {
    if (!startDate) {
      toast.error('Please select a start date');
      return;
    }

    const selectedDate = new Date(startDate);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    if (selectedDate < tomorrow) {
      toast.error('Start date must be at least tomorrow');
      return;
    }

    setIsSubmitting(true);

    try {
      // Replace with your actual API method
      const response = await AGENCY_API_METHODS.setOrderStartDate(order.id, startDate);

      if (response.success) {
        toast.success('Start date set successfully!');
        onSuccess(response.data);
        onClose();
      } else {
        toast.error(response.message || 'Failed to set start date');
      }
    } catch (error) {
      console.error('Error setting start date:', error);
      toast.error('An error occurred while setting the start date');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Calendar className="text-white" size={20} />
                </div>
                <h2 className="text-xl font-bold text-white">Set Start Date</h2>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Order Info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Order ID</span>
                  <span className="font-mono text-sm font-semibold text-gray-800">
                    #{order.orderId}
                  </span>
                </div>
                {order.userId?.name && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Customer</span>
                    <span className="text-sm font-medium text-gray-800">
                      {order.userId.name}
                    </span>
                  </div>
                )}
                {order.product?.title && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Package</span>
                    <span className="text-sm font-medium text-gray-800">
                      {order.product.title}
                    </span>
                  </div>
                )}
              </div>

              {/* Alert Message */}
              <div className="flex gap-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <AlertCircle className="text-blue-600 flex-shrink-0" size={20} />
                <p className="text-sm text-blue-800">
                  The start date must be at least tomorrow. Past dates and today are not allowed.
                </p>
              </div>

              {/* Date Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Select Start Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={minDate}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-800"
                  />
                  <Calendar
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={20}
                  />
                </div>
                {startDate && (
                  <p className="text-sm text-gray-600">
                    Selected date:{' '}
                    <span className="font-medium">
                      {new Date(startDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </p>
                )}
              </div>

              {/* Current Start Date (if exists) */}
              {order.startDate && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <span className="font-semibold">Current start date:</span>{' '}
                    {new Date(order.startDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex gap-3">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !startDate}
                className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Setting...
                  </>
                ) : (
                  <>
                    <Calendar size={18} />
                    Set Date
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}