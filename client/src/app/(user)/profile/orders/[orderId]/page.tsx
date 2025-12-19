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
  Image as ImageIcon,
} from 'lucide-react';
import { USER_API_METHODS } from '@/services/APIs/user.api.service';
import toast from 'react-hot-toast';

interface OrderDetails {
  _id: string;
  orderId: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phoneNumber?: string;
  };
  productType: 'Package' | 'Rooms' | 'Foods';
  product: {
    _id: string;
    title?: string;
    name?: string;
    description?: string;
    price: number;
    images?: string[];
    duration?: string;
    availableFoods?: string[];
    itinerary?: {
      day: number;
      title: string;
      activities: string[];
    }[];
    discoveries?: string[];
  };
  amount: number;
  originalAmount?: number;
  discount?: number;
  couponId?: {
    code: string;
    discount: number;
    type: string;
  };
  ownedBy: {
    _id: string;
    name?: string;
    agencyName?: string;
    email?: string;
  };
  startDate?: string;
  endDate?: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  paymentId: {
    _id: string;
    transactionId?: string;
    paymentMethod?: string;
    paymentStatus?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface OrderDetailsPageProps {
  orderId: string;
}

export default function UserOrderDetailsPage() {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const router = useRouter();
  const params = useParams()
  const orderId = Array.isArray(params.orderId) ? params.orderId.join('') : params.orderId ?? "";

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  async function fetchOrderDetails() {
    try {
      setLoading(true);
      const response = await USER_API_METHODS.getOrderDetails(orderId);
      
      if (response.success) {
        console.log(response.data)
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
        return 'bg-green-100 text-green-700 border-green-200';
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
    router.push(`/chat/${order?.ownedBy._id}?orderId=${order?.orderId}`);
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

  const productName = order.product.title || order.product.name || 'N/A';

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
          <div className="flex gap-3 mt-4">
            {order.status !== 'Completed' && (
              <button
                onClick={handleChatWithAgency}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition flex items-center gap-2 font-semibold"
              >
                <MessageCircle size={18} />
                Chat with Agency
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
                  {order.productType} Information
                </h2>
              </div>
              
              <div className="p-6">
                {/* Image Gallery */}
                {order.product.images && order.product.images.length > 0 && (
                  <div className="mb-6">
                    <div className="relative h-64 rounded-lg overflow-hidden mb-3">
                      <img
                        src={order.product.images[selectedImage]}
                        alt={productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {order.product.images.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {order.product.images.slice(0, 4).map((img, idx) => (
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
                
                {order.product.description && (
                  <p className="text-gray-600 mb-4">{order.product.description}</p>
                )}

                {order.product.duration && (
                  <div className="flex items-center gap-2 text-gray-700 mb-3">
                    <Clock size={18} className="text-gray-400" />
                    <span className="text-sm">
                      <span className="font-medium">Duration:</span> {order.product.duration}
                    </span>
                  </div>
                )}

                {/* Itinerary */}
                {order.product.itinerary && order.product.itinerary.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Calendar className="text-blue-600" size={18} />
                      Itinerary
                    </h4>
                    <div className="space-y-4">
                      {order.product.itinerary.map((item, idx) => (
                        <div key={idx} className="relative pl-6 pb-4 border-l-2 border-blue-200 last:border-0">
                          <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-600 rounded-full"></div>
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                            <h5 className="font-bold text-gray-800 mb-2">Day {item.day}: {item.title}</h5>
                            <ul className="space-y-1">
                              {item.activities.map((activity, actIdx) => (
                                <li key={actIdx} className="text-sm text-gray-700 flex items-start gap-2">
                                  <span className="text-blue-600">•</span>
                                  <span>{activity}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Discoveries */}
                {order.product.discoveries && order.product.discoveries.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <MapPin className="text-blue-600" size={18} />
                      Places to Discover
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {order.product.discoveries.map((place, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded-lg p-2">
                          <MapPin size={14} className="text-gray-400" />
                          <span>{place}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Available Foods */}
                {order.product.availableFoods && order.product.availableFoods.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Utensils className="text-orange-600" size={18} />
                      Meals Included
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {order.product.availableFoods.map((food, idx) => (
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

            {/* Schedule Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Trip Schedule</h2>
              <div className="grid md:grid-cols-2 gap-4">
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

          {/* Right Column - Payment & Agency */}
          <div className="space-y-6">
            {/* Payment Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b border-green-200">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <CreditCard className="text-green-600" size={22} />
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
                    <div className="flex items-center justify-between text-green-600">
                      <span className="flex items-center gap-1">
                        Discount
                        {order.couponId && (
                          <span className="text-xs bg-green-100 px-2 py-0.5 rounded font-mono">
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
                    <p className="text-sm text-green-600 text-right">
                      You saved ₹{order.discount.toLocaleString()}!
                    </p>
                  )}
                </div>

                {order.paymentId.transactionId && (
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
                  {/* <p className="font-semibold text-gray-800">
                    {order.ownedBy.agencyName || order.ownedBy.name || 'N/A'}
                  </p> */}
                </div>

                {/* {order.ownedBy.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="text-gray-400 flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm text-gray-800 break-all">{order.ownedBy.email}</p>
                    </div>
                  </div>
                )} */}

                {order.status !== 'Completed' && (
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

            {/* Your Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <User className="text-blue-600" size={22} />
                  Your Information
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
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
                    <p className="text-sm text-gray-800 break-all">{order.userId.email}</p>
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
        </div>
      </div>

      <Footer />
    </div>
  );
}