'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SideNavbar from '@/components/agency/SideNavbar';
import { Calendar, MessageCircle, User, Package, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { AGENCY_API_METHODS } from '@/services/APIs/agency.api.service';
import SetStartDateModal from '@/components/agency/SetStartDateModal';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import VendorFooter from '@/components/shared/Footer';

export default function PackageOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter()

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      setLoading(true);
      const data = await AGENCY_API_METHODS.getAllOrders();
      if (data.success) {
        setOrders(data.data);
      } else {
        toast.error('Failed to load orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('An error occurred while loading orders');
    } finally {
      setLoading(false);
    }
  }

  function handleOpenModal(order: any) {
    setSelectedOrder(order);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedOrder(null);
  }

  function handleSuccess(updatedOrder: any) {
    // Update the orders list with the updated order
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );
  }

  // Statistics
  const stats = {
    total: orders.length,
    ongoing: orders.filter((o: any) => o.status === 'Ongoing').length,
    completed: orders.filter((o: any) => o.status === 'Completed').length,
    upcoming: orders.filter((o: any) => o.status === 'Upcoming').length,
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <SideNavbar />
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 font-medium">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <SideNavbar />
      <div className="flex-1 flex flex-col">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Package Orders</h1>
              <p className="text-gray-600 mt-1">Manage and track all your package bookings</p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Upcoming</p>
                  <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.upcoming}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="text-yellow-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Ongoing</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">{stats.ongoing}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Completed</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{stats.completed}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
              <Package className="mx-auto text-gray-300 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-700">No orders yet</h3>
              <p className="text-gray-500 mt-2">Your package orders will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order: any) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                      {/* Left Section - Order Info */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-mono text-sm bg-gray-100 px-3 py-1 rounded-md text-gray-700" onClick={() => router.push(`/agency/orders/${order.id}`)}>
                            #{order.orderId}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${order.status === 'Ongoing'
                                ? 'bg-blue-100 text-blue-700'
                                : order.status === 'Completed'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                          >
                            {order.status === 'Ongoing' && <AlertCircle size={14} />}
                            {order.status === 'Completed' && <CheckCircle size={14} />}
                            {order.status === 'Upcoming' && <Clock size={14} />}
                            {order.status}
                          </span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="flex items-center gap-2 text-gray-700">
                            <User className="text-gray-400" size={18} />
                            <span className="text-sm">
                              <span className="text-gray-500">Customer:</span>{' '}
                              <span className="font-medium">{order.userId?.name || 'N/A'}</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-gray-700">
                            <span className="text-sm">
                              <span className="text-gray-500">Amount:</span>{' '}
                              <span className="font-bold text-emerald-600">
                                ₹{order.amount.toLocaleString()}
                              </span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-gray-700">
                            <Calendar className="text-gray-400" size={18} />
                            <span className="text-sm">
                              <span className="text-gray-500">Start Date:</span>{' '}
                              <span className="font-medium">
                                {order.startDate
                                  ? new Date(order.startDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })
                                  : 'Not set'}
                              </span>
                            </span>
                          </div>

                          {order.product?.title && (
                            <div className="flex items-center gap-2 text-gray-700">
                              <Package className="text-gray-400" size={18} />
                              <span className="text-sm">
                                <span className="text-gray-500">Package:</span>{' '}
                                <span className="font-medium">{order.product.title}</span>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Section - Action Buttons */}
                      <div className="flex gap-3 lg:flex-col">
                        <Link
                          href={`/package/chat/${order.userId}`}
                          className="flex-1 lg:flex-none px-4 py-2.5 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm"
                        >
                          <MessageCircle size={18} />
                          Chat
                        </Link>

                        <button
                          onClick={() => handleOpenModal(order)}
                          className="flex-1 lg:flex-none px-4 py-2.5 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium text-sm"
                        >
                          <Calendar size={18} />
                          Set Date
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      <VendorFooter />
      </div>

      {/* Modal */}
      {selectedOrder && (
        <SetStartDateModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          order={selectedOrder}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}