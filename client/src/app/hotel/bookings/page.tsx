'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SideNavbar from '@/components/hotel/SideNavbar';
import { HOTEL_API_METHODS } from '@/services/APIs/hotel.api.service';
import {
  Loader2,
  Calendar,
  IndianRupee,
  Bed,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
} from 'lucide-react';
import toast from 'react-hot-toast';

/* ----------------------------- Types ----------------------------- */

interface HotelOrder {
  id: string;
  orderId: string;
  amount: number;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
  startDate?: string;
  endDate?: string;
  createdAt: string;
  product: {
    RoomNumber: number;
    PricePerNight: number;
    Capacity: number;
    Images?: string[];
  };
}

/* ----------------------------- Page ------------------------------ */

export default function HotelOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<HotelOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      setLoading(true);
      const res = await HOTEL_API_METHODS.getAllOrders();

      if (res.success) {
        setOrders(res.data || []);
      } else {
        toast.error(res.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const statusBadge = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-blue-100 text-blue-700';
      case 'Ongoing':
        return 'bg-orange-100 text-orange-700';
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return <Clock size={14} />;
      case 'Ongoing':
        return <AlertCircle size={14} />;
      case 'Completed':
        return <CheckCircle size={14} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SideNavbar />

      {/* Main */}
      <div className="flex-1 p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Hotel Orders</h1>
            <p className="text-gray-500 mt-1">
              Manage and track all room bookings
            </p>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="animate-spin text-emerald-600" size={32} />
            </div>
          ) : orders.length === 0 ? (
            /* Empty State */
            <div className="bg-white border rounded-xl p-12 text-center shadow-sm">
              <Bed className="mx-auto text-gray-300 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-700">
                No Orders Found
              </h3>
              <p className="text-gray-500 mt-2">
                Room bookings will appear here once users start booking.
              </p>
            </div>
          ) : (
            /* Orders List */
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
                >
                  <div className="p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                    {/* Left */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-mono text-sm bg-gray-100 px-3 py-1 rounded-md">
                          #{order.orderId}
                        </span>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusBadge(
                            order.status
                          )}`}
                        >
                          {statusIcon(order.status)}
                          {order.status}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <Bed size={16} className="text-gray-400" />
                          Room #{order.product?.RoomNumber}
                        </div>

                        <div className="flex items-center gap-2">
                          <IndianRupee size={16} className="text-emerald-600" />
                          ₹{order.amount}
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-400" />
                          Start:{' '}
                          {order.startDate
                            ? new Date(order.startDate).toLocaleDateString()
                            : 'Not set'}
                        </div>

                        {order.endDate && (
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-gray-400" />
                            End:{' '}
                            {new Date(order.endDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          router.push(`/hotel/booking/${order.id}`)
                        }
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-medium"
                      >
                        <Eye size={16} />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
