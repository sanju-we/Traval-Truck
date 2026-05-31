'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SideNavbar from '@/components/hotel/SideNavbar';
import { HOTEL_API_METHODS } from '@/services/APIs/hotel.api.service';
import { LogIn, LogOut } from 'lucide-react';
import {
  ArrowLeft,
  Loader2,
  Users,
  IndianRupee,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  CreditCard,
  User,
  Bed,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { HotelOrderDetails } from '../../../../types/hotel';
import VendorFooter from '@/components/shared/Footer';
import TravelTruckLoading from '@/components/shared/TravelTruckLoading';

export default function HotelOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId =
    typeof params.orderId === 'string'
      ? params.orderId
      : params.orderId?.[0];

  const [order, setOrder] = useState<HotelOrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);

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
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  /* ----------------------------- Helpers ----------------------------- */

  const statusStyle = (status: string) => {
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

  async function handleCheckIn() {
    try {
      setActionLoading(true);
      const res = await HOTEL_API_METHODS.checkInOrder(order!.id);

      if (res.success) {
        toast.success('Guest checked in successfully');
        setOrder({ ...order!, status: 'Ongoing' });
      } else {
        toast.error(res.message || 'Check-in failed');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCheckOut() {
    try {
      setActionLoading(true);
      const res = await HOTEL_API_METHODS.checkOutOrder(order!.id);

      if (res.success) {
        toast.success('Guest checked out successfully');
        setOrder({ ...order!, status: 'Completed' });
      } else {
        toast.error(res.message || 'Check-out failed');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setActionLoading(false);
    }
  }


  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <SideNavbar />
        <div className="flex-1 flex justify-center items-center">
          <TravelTruckLoading />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <SideNavbar />
        <div className="flex-1 flex justify-center items-center text-gray-500">
          Order not found
        </div>
      </div>
    );
  }

  const room = order.product;

  const nights =
    order.startDate && order.endDate
      ? Math.max(
        1,
        Math.ceil(
          (new Date(order.endDate).getTime() -
            new Date(order.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
        )
      )
      : Math.max(1, Math.round(order.amount / room.PricePerNight));

  const requiredRooms = Math.max(1, Math.round(order.amount / (room.PricePerNight * nights)));

  /* ----------------------------- UI ----------------------------- */

  return (
    <div className="min-h-screen flex bg-gray-50">
      <SideNavbar />
      <div className="flex-1 flex flex-col">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Back */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={18} />
            Back to Orders
          </button>

          {/* Header */}
          <div className="bg-white rounded-2xl border shadow-sm p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Order #{order.orderId}
              </h1>
              <p className="text-sm text-gray-500">
                Booked on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${statusStyle(
                order.status
              )}`}
            >
              {statusIcon(order.status)}
              {order.status}
            </span>
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">

            {/* Room Details */}
            <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm p-6 space-y-6">

              {/* Images */}
              {room.Images?.length > 0 && (
                <>
                  <div className="h-72 rounded-xl overflow-hidden">
                    <img
                      src={room.Images[selectedImage]}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {room.Images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(i)}
                        className={`h-16 rounded-lg overflow-hidden border-2 ${selectedImage === i
                          ? 'border-emerald-500'
                          : 'border-gray-200'
                          }`}
                      >
                        <img src={img} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Info */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Room #{room.RoomNumber}
                </h2>
                <p className="text-gray-600 mb-4">{room.Description}</p>

                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users size={16} /> Capacity: {room.Capacity}
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

            {/* Right Column */}
            <div className="space-y-6">

              {/* Actions */}
              {order.status !== 'Cancelled' && (
                <div className="bg-white rounded-2xl border shadow-sm p-6">
                  <h3 className="font-semibold mb-4">Guest Actions</h3>

                  {order.status === 'Upcoming' && (
                    <button
                      onClick={handleCheckIn}
                      disabled={actionLoading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-60"
                    >
                      {actionLoading ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <>
                          <LogIn size={18} />
                          Mark Check-In
                        </>
                      )}
                    </button>
                  )}

                  {order.status === 'Ongoing' && (
                    <button
                      onClick={handleCheckOut}
                      disabled={actionLoading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-60"
                    >
                      {actionLoading ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <>
                          <LogOut size={18} />
                          Mark Check-Out
                        </>
                      )}
                    </button>
                  )}

                  {order.status === 'Completed' && (
                    <p className="text-sm text-green-700 font-medium text-center">
                      Guest checked out. Payment will be released by admin.
                    </p>
                  )}
                </div>
              )}


              {/* Stay Details */}
              <div className="bg-white rounded-2xl border shadow-sm p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Bed size={18} /> Stay Details
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

                  <div>
                    <p className="text-gray-500">Total Nights</p>
                    <p className="font-semibold">{nights}</p>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-2xl border shadow-sm p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <CreditCard size={18} /> Payment Summary
                </h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>₹{room.PricePerNight} × {nights} {nights > 1 ? 'nights' : 'night'} × {requiredRooms} {requiredRooms > 1 ? 'rooms' : 'room'}</span>
                    <span>₹{order.amount}</span>
                  </div>

                  <div className="border-t pt-3 flex justify-between text-lg font-bold text-emerald-600">
                    <span>Total Paid</span>
                    <span>₹{order.amount}</span>
                  </div>
                </div>
              </div>

              {/* Guest */}
              <div className="bg-white rounded-2xl border shadow-sm p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <User size={18} /> Guest Details
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
        <VendorFooter/>
      </div>
    </div>
  );
}
