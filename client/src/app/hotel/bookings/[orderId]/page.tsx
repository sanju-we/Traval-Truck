'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SideNavbar from '@/components/hotel/SideNavbar';
import { HOTEL_API_METHODS } from '@/services/APIs/hotel.api.service';
import {
  ArrowLeft,
  Loader2,
  Bed,
  Users,
  IndianRupee,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  CreditCard,
  User,
} from 'lucide-react';
import toast from 'react-hot-toast';

/* ----------------------------- Types ----------------------------- */

interface HotelOrderDetails {
  id: string;
  orderId: string;
  amount: number;
  status: 'Upcoming' | 'Completed' | 'Cancelled' | 'Ongoing';
  startDate?: string;
  endDate?: string;
  createdAt: string;
  userId: {
    name: string;
    email: string;
    phoneNumber?: string;
  };
  product: {
    _id: string;
    RoomNumber: number;
    Capacity: number;
    Description: string;
    Facilities: string[];
    PricePerNight: number;
    Images: string[];
    Status: string;
  };
}

/* ----------------------------- Page ------------------------------ */

export default function HotelOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = typeof params.orderId === 'string'
    ? params.orderId
    : params.orderId?.[0];

  const [order, setOrder] = useState<HotelOrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (orderId) fetchOrder();
  }, [orderId]);

  async function fetchOrder() {
    try {
      setLoading(true);
      const res = await HOTEL_API_METHODS.getOrderDetails(orderId!);

      if (res.success) {
        setOrder(res.data);
      } else {
        toast.error(res.message || 'Failed to load order');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const statusBadge = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-blue-100 text-blue-700';
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
      case 'Ongoing':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return <Clock size={16} />;
      case 'Completed':
        return <CheckCircle size={16} />;
      case 'Ongoing':
        return <AlertCircle size={16} />;
      default:
        return null;
    }
  };

  /* ----------------------------- States ----------------------------- */

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <SideNavbar />
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="animate-spin text-emerald-600" size={36} />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <SideNavbar />
        <div className="flex-1 flex justify-center items-center">
          <p className="text-gray-500">Order not found</p>
        </div>
      </div>
    );
  }

  const room = order.product;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideNavbar />

      <div className="flex-1 p-6 md:p-10">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Back */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={18} />
            Back to Orders
          </button>

          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Order #{order.orderId}
              </h1>
              <p className="text-gray-500 text-sm">
                Booked on{' '}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${statusBadge(
                order.status
              )}`}
            >
              {statusIcon(order.status)}
              {order.status}
            </span>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6">

            {/* Left - Room */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border p-6 space-y-6">

              {/* Images */}
              {room.Images?.length > 0 && (
                <div>
                  <div className="h-64 rounded-xl overflow-hidden mb-3">
                    <img
                      src={room.Images[selectedImage]}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {room.Images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {room.Images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedImage(i)}
                          className={`h-16 rounded-lg overflow-hidden border-2 ${
                            selectedImage === i
                              ? 'border-emerald-500'
                              : 'border-gray-200'
                          }`}
                        >
                          <img src={img} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Room Info */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Room #{room.RoomNumber}
                </h2>
                <p className="text-gray-600 mb-4">{room.Description}</p>

                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    Capacity: {room.Capacity}
                  </div>
                  <div className="flex items-center gap-2">
                    <IndianRupee size={16} />
                    ₹{room.PricePerNight} / night
                  </div>
                </div>
              </div>

              {/* Facilities */}
              {room.Facilities?.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Facilities</h3>
                  <div className="flex flex-wrap gap-2">
                    {room.Facilities.map((f, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right - Summary */}
            <div className="space-y-6">

              {/* Booking */}
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Calendar size={18} />
                  Booking Schedule
                </h3>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500">Check-in</p>
                    <p className="font-medium">
                      {order.startDate
                        ? new Date(order.startDate).toLocaleDateString()
                        : 'Not set'}
                    </p>
                  </div>

                  {order.endDate && (
                    <div>
                      <p className="text-gray-500">Check-out</p>
                      <p className="font-medium">
                        {new Date(order.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <CreditCard size={18} />
                  Payment Summary
                </h3>

                <div className="flex justify-between text-lg font-bold text-emerald-600">
                  <span>Total Paid</span>
                  <span>₹{order.amount}</span>
                </div>
              </div>

              {/* Customer */}
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <User size={18} />
                  Guest Details
                </h3>

                <p className="font-medium">{order.userId.name}</p>
                <p className="text-sm text-gray-600">{order.userId.email}</p>
                {order.userId.phoneNumber && (
                  <p className="text-sm text-gray-600">
                    {order.userId.phoneNumber}
                  </p>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
