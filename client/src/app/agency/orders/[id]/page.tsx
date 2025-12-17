'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SideNavbar from '@/components/agency/SideNavbar';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Package, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Building2,
  UtensilsCrossed,
  Hotel,
  Briefcase
} from 'lucide-react';
import { AGENCY_API_METHODS } from '@/services/APIs/agency.api.service';
import toast from 'react-hot-toast';

interface OrderDetails {
  _id: string;
  orderId: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    profilePicture?: string;
  };
  productType: 'Package' | 'Rooms' | 'Foods';
  role: 'Agency' | 'Restaurant' | 'Hotel';
  product: {
    _id: string;
    title?: string;
    name?: string;
    description?: string;
    price: number;
    images?: string[];
    duration?: string;
    availableFoods?: string[];
    itinerary?: string[];
  };
  amount: number;
  ownedBy: {
    _id: string;
    name?: string;
    agencyName?: string;
    restaurantName?: string;
    hotelName?: string;
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


export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const orderId = params.id

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

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <SideNavbar />
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 font-medium">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <SideNavbar />
        <div className="p-6 md:p-10">
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
        </div>
      </div>
    );
  }

  const productName = order.product.title || order.product.name || 'N/A';

  return (
    <div className="bg-gray-50 min-h-screen">
      <SideNavbar />
      
      <div className="p-6 md:p-10">
        <div className="max-w-5xl mx-auto space-y-6">
          
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
                  {order.product.images && order.product.images[0] && (
                    <img
                      src={order.product.images[0]}
                      alt={productName}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
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

                  {order.product.itinerary && order.product.itinerary.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Itinerary</h4>
                      <ul className="space-y-2">
                        {order.product.itinerary.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {order.product.availableFoods && order.product.availableFoods.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Available Foods</h4>
                      <div className="flex flex-wrap gap-2">
                        {order.product.availableFoods.map((food, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm"
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
                <h2 className="text-lg font-bold text-gray-800 mb-4">Schedule</h2>
                <div className="grid md:grid-cols-2 gap-4">
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
      </div>
    </div>
  );
}