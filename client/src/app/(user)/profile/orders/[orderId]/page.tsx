'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/user/header/page';
import { Footer } from '@/components/user/footer/page';
import PackageDetails from '@/components/user/orders/PackageDetails';
import RoomDetails from '@/components/user/orders/RoomDetails';
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Building2,
  MessageCircle,
  Download,
  Share2,
  XCircle,
  Star,
  X,
  Mail,
} from 'lucide-react';
import { USER_API_METHODS } from '@/services/APIs/user.api.service';
import toast from 'react-hot-toast';
import RatingCard from '@/components/user/orders/Rating';
import { PlanDay } from '@/types/user/orders';
import { OrderDetails } from '@/types/user/orders';
import jsPDF from 'jspdf';

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
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [customReason, setCustomReason] = useState('');
  const router = useRouter();
  const params = useParams();
  const orderId = Array.isArray(params.orderId)
    ? params.orderId.join('')
    : params.orderId ?? '';

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
    const agencyId = order?.product?.data?.ownedBy || order?.product?.ownedBy || (typeof order?.ownedBy === 'object' ? (order.ownedBy as any)._id : order?.ownedBy);
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

      const finalReason =
        selectedReason === 'Other (specify below)' ? customReason : selectedReason;

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

  const calculateNights = (start: string, end: string) => {
    return Math.ceil(
      (new Date(end).getTime() - new Date(start).getTime()) /
      (1000 * 60 * 60 * 24)
    );
  };

  const handleDownloadInvoice = () => {
    if (!order) return;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    let yPos = 20;

    // Header
    pdf.setFontSize(24);
    pdf.setTextColor(59, 130, 246); // Blue
    pdf.text('INVOICE', pageWidth / 2, yPos, { align: 'center' });

    yPos += 10;
    pdf.setFontSize(12);
    pdf.setTextColor(107, 114, 128); // Gray
    pdf.text(`Order ID: ${order.orderId}`, pageWidth / 2, yPos, { align: 'center' });

    yPos += 6;
    pdf.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth / 2, yPos, { align: 'center' });

    // Line separator
    yPos += 10;
    pdf.setDrawColor(59, 130, 246);
    pdf.setLineWidth(0.5);
    pdf.line(20, yPos, pageWidth - 20, yPos);

    // Order Details Section
    yPos += 15;
    pdf.setFontSize(14);
    pdf.setTextColor(31, 41, 55); // Dark gray
    pdf.text('Order Details', 20, yPos);

    yPos += 8;
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Package Name: ${order.product?.data?.title || 'N/A'}`, 20, yPos);

    yPos += 6;
    pdf.text(`Type: ${order.productType}`, 20, yPos);

    yPos += 6;
    pdf.text(`Status: ${order.status}`, 20, yPos);

    if (order.startDate) {
      yPos += 6;
      pdf.text(`${order.productType === 'Rooms' ? 'Check-in' : 'Start'} Date: ${new Date(order.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 20, yPos);
    }

    if (order.endDate) {
      yPos += 6;
      pdf.text(`${order.productType === 'Rooms' ? 'Check-out' : 'End'} Date: ${new Date(order.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 20, yPos);
    }

    // Pricing Table
    yPos += 15;
    pdf.setFontSize(14);
    pdf.setTextColor(31, 41, 55);
    pdf.text('Pricing Details', 20, yPos);

    yPos += 10;
    pdf.setFontSize(10);

    // Table header
    pdf.setFillColor(243, 244, 246);
    pdf.rect(20, yPos - 5, pageWidth - 40, 8, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.text('Description', 25, yPos);
    pdf.text('Amount', pageWidth - 50, yPos);

    yPos += 10;
    pdf.setFont('helvetica', 'normal');

    // Original price and discount
    if (order.originalAmount && order.discount && order.discount > 0) {
      pdf.text('Original Price', 25, yPos);
      pdf.text(`Rs.${order.originalAmount.toLocaleString()}`, pageWidth - 50, yPos);

      yPos += 8;
      const discountText = order.couponId && typeof order.couponId === 'object'
        ? `Discount (${order.couponId.code})`
        : 'Discount';
      pdf.text(discountText, 25, yPos);
      pdf.setTextColor(16, 185, 129); // Green
      pdf.text(`- Rs.${order.discount.toLocaleString()}`, pageWidth - 50, yPos);
      pdf.setTextColor(0, 0, 0);

      yPos += 8;
    }

    // Total
    pdf.setFillColor(239, 246, 255);
    pdf.rect(20, yPos - 5, pageWidth - 40, 10, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.text('Total Amount Paid', 25, yPos);
    pdf.text(`Rs.${order.amount.toLocaleString()}`, pageWidth - 50, yPos);
    pdf.setFont('helvetica', 'normal');

    // Payment Information
    if (typeof order.paymentId === 'object' && order.paymentId?.transactionId) {
      yPos += 20;
      pdf.setFontSize(14);
      pdf.setTextColor(31, 41, 55);
      pdf.text('Payment Information', 20, yPos);

      yPos += 8;
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Transaction ID: ${order.paymentId.transactionId}`, 20, yPos);

      if (order.paymentId.paymentMethod) {
        yPos += 6;
        pdf.text(`Payment Method: ${order.paymentId.paymentMethod}`, 20, yPos);
      }

      if (order.paymentId.paymentStatus) {
        yPos += 6;
        pdf.text(`Payment Status: ${order.paymentId.paymentStatus}`, 20, yPos);
      }
    }

    // Vendor Information
    if (order.ownedBy && typeof order.ownedBy === 'object') {
      yPos += 20;
      pdf.setFontSize(14);
      pdf.setTextColor(31, 41, 55);
      pdf.text(`${order.productType === 'Rooms' ? 'Hotel' : 'Agency'} Information`, 20, yPos);

      yPos += 8;
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Name: ${order.ownedBy.companyName || order.ownedBy.name || 'N/A'}`, 20, yPos);

      if (order.ownedBy.email) {
        yPos += 6;
        pdf.text(`Email: ${order.ownedBy.email}`, 20, yPos);
      }
    }

    // Footer
    const footerY = pdf.internal.pageSize.getHeight() - 30;
    pdf.setDrawColor(229, 231, 235);
    pdf.line(20, footerY, pageWidth - 20, footerY);

    pdf.setFontSize(9);
    pdf.setTextColor(107, 114, 128);
    pdf.text('Thank you for your business!', pageWidth / 2, footerY + 8, { align: 'center' });
    pdf.text('This is a computer-generated invoice and does not require a signature.', pageWidth / 2, footerY + 13, { align: 'center' });

    // Save PDF
    pdf.save(`Invoice_${order.orderId}.pdf`);
    toast.success('Invoice downloaded successfully');
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
              <h3 className="text-xl font-semibold text-gray-700">
                Order Not Found
              </h3>
              <p className="text-gray-500 mt-2">
                The order you're looking for doesn't exist
              </p>
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
                  className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 border bg-white ${getStatusColor(
                    order.status
                  )}`}
                >
                  {getStatusIcon(order.status)}
                  {order.status}
                </span>
              </div>
              <p className="text-blue-100 font-mono text-lg">
                Order #{order.orderId}
              </p>
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
            <button
              onClick={handleDownloadInvoice}
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition flex items-center gap-2 font-semibold"
            >
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
          {/* Left Column - Product Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Render Package or Room Details Component */}
            {order.productType === 'Package' ? (
              <PackageDetails
                product={order.product?.data}
                status={order.status}
                plan={order.plan}
                tripProgress={order.tripProgress}
                startDate={order.startDate}
              />
            ) : order.productType === 'Rooms' ? (
              <RoomDetails product={order.product?.data} />
            ) : (
              <div className="bg-white rounded-xl p-6 text-center">
                <p className="text-gray-500">Product type not supported</p>
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
                      <span className="line-through">
                        ₹{order.originalAmount.toLocaleString()}
                      </span>
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

                {typeof order.paymentId === 'object' &&
                  order.paymentId.transactionId && (
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

                {typeof order.paymentId === 'object' &&
                  order.paymentId.paymentMethod && (
                    <div className="flex items-start gap-3">
                      <CreditCard className="text-gray-400 flex-shrink-0 mt-0.5" size={18} />
                      <div>
                        <p className="text-xs text-gray-500">Payment Method</p>
                        <p className="font-medium text-gray-800">
                          {order.paymentId.paymentMethod}
                        </p>
                      </div>
                    </div>
                  )}

                {typeof order.paymentId === 'object' &&
                  order.paymentId.paymentStatus && (
                    <div className="flex items-start gap-3">
                      <CheckCircle className="text-blue-500 flex-shrink-0 mt-0.5" size={18} />
                      <div>
                        <p className="text-xs text-gray-500">Payment Status</p>
                        <p className="font-medium text-blue-600">
                          {order.paymentId.paymentStatus}
                        </p>
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
                  {order.productType === 'Rooms' ? 'Hotel' : 'Travel Agency'}
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    {order.productType === 'Rooms' ? 'Hotel Name' : 'Agency Name'}
                  </p>
                  <p className="font-semibold text-gray-800">
                    {(order.ownedBy &&
                      typeof order.ownedBy === 'object' &&
                      (order.ownedBy.companyName || order.ownedBy.name)) ||
                      (order.product?.data?.ownedBy ? 'Information' : 'N/A')}
                  </p>
                </div>

                {order.ownedBy &&
                  typeof order.ownedBy === 'object' &&
                  order.ownedBy.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="text-gray-400 flex-shrink-0 mt-0.5" size={18} />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm text-gray-800 break-all">
                          {order.ownedBy.email}
                        </p>
                      </div>
                    </div>
                  )}

                {order.status !== 'Completed' && order.status !== 'Cancelled' && (
                  <button
                    onClick={handleChatWithAgency}
                    className="w-full mt-4 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-semibold"
                  >
                    <MessageCircle size={18} />
                    Contact {order.productType === 'Rooms' ? 'Hotel' : 'Agency'}
                  </button>
                )}
              </div>
            </div>

            {/* Schedule Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Calendar className="text-blue-600" size={22} />
                  {order.productType === 'Rooms'
                    ? 'Booking Schedule'
                    : 'Trip Schedule'}
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <Calendar className="text-blue-600" size={24} />
                  <div>
                    <p className="text-sm text-gray-600">
                      {order.productType === 'Rooms' ? 'Check-in Date' : 'Start Date'}
                    </p>
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
                      <p className="text-sm text-gray-600">
                        {order.productType === 'Rooms'
                          ? 'Check-out Date'
                          : 'End Date'}
                      </p>
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

                {/* Calculate and show nights for Rooms */}
                {order.productType === 'Rooms' &&
                  order.startDate &&
                  order.endDate && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total Nights</span>
                        <span className="font-bold text-blue-600 text-lg">
                          {calculateNights(order.startDate, order.endDate)}{' '}
                          {calculateNights(order.startDate, order.endDate) === 1
                            ? 'Night'
                            : 'Nights'}
                        </span>
                      </div>
                    </div>
                  )}
              </div>
            </div>
            {order.status == 'Completed' && order.ownedBy && (order.product?.data?.id || order.product?.data?._id) && (
              <RatingCard
                orderId={order.id}
                productId={{ _id: order.product?.data?.id || order.product?.data?._id }}
                vendor={order.ownedBy}
              />
            )}
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
                  We're sorry to see you cancel your order. Please let us know why
                  you're canceling so we can improve our service.
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
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${selectedReason === reason
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
                    <p className="text-sm font-semibold text-yellow-800">
                      Important Notice
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Once you cancel this order, the action cannot be undone. Refund
                      processing may take 5-7 business days.
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
                disabled={
                  cancelLoading ||
                  !selectedReason ||
                  (selectedReason === 'Other (specify below)' &&
                    !customReason.trim())
                }
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