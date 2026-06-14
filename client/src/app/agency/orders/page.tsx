'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, MessageCircle, User, Package, Clock, CheckCircle, AlertCircle, Search, SlidersHorizontal, ArrowUpDown, Tag } from 'lucide-react';
import { AGENCY_API_METHODS } from '@/services/APIs/agency.api.service';
import { ApiResponse } from '@/services/api.service';
import { OrderDetails } from '@/types/agency';
import SetStartDateModal from '@/components/agency/SetStartDateModal';
import { useRouter } from 'next/navigation';
import VendorFooter from '@/components/shared/Footer';
import TravelTruckLoading from '@/components/shared/TravelTruckLoading';
import toast from 'react-hot-toast';

export default function PackageOrdersPage() {
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [stats, setStats] = useState({ total: 0, ongoing: 0, completed: 0, upcoming: 0 });
  const ordersPerPage = 5;
  const router = useRouter();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date_desc');

  async function fetchStats() {
    try {
      const res = await AGENCY_API_METHODS.getAllOrders({ limit: 1000 }) as ApiResponse<{ data: OrderDetails[] }>;
      if (res && res.success && res.data && res.data.data) {
        const all = res.data.data;
        setStats({
          total: all.length,
          ongoing: all.filter((o: OrderDetails) => o.status === 'Ongoing').length,
          completed: all.filter((o: OrderDetails) => o.status === 'Completed').length,
          upcoming: all.filter((o: OrderDetails) => o.status === 'Upcoming').length,
        });
      }
    } catch (e) {
      console.error('Error loading stats:', e);
    }
  }

  async function fetchOrders(
    page = currentPage,
    search = searchTerm,
    status = statusFilter,
    price = priceFilter,
    sort = sortBy
  ) {
    try {
      setLoading(true);
      const res = await AGENCY_API_METHODS.getAllOrders({
        page,
        limit: ordersPerPage,
        search: search || undefined,
        status: status !== 'All' ? status : undefined,
        price: price !== 'All' ? price : undefined,
        sortBy: sort
      }) as ApiResponse<{ data: OrderDetails[]; totalPages?: number; total?: number }>;
      if (res && res.success && res.data) {
        setOrders(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalItems(res.data.total || 0);
        setCurrentPage(page);
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

  useEffect(() => {
    fetchStats();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, priceFilter, sortBy]);

  // Debounced/Reactive fetch when filters or page change
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchOrders(currentPage, searchTerm, statusFilter, priceFilter, sortBy);
    }, 300);
    return () => clearTimeout(handler);
  }, [currentPage, searchTerm, statusFilter, priceFilter, sortBy]);

  function handleOpenModal(order: OrderDetails) {
    setSelectedOrder(order);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedOrder(null);
  }

  function handleSuccess(updatedOrder: OrderDetails) {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );
    fetchStats();
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const currentOrders = orders;
  const indexOfFirstOrder = (currentPage - 1) * ordersPerPage;
  const indexOfLastOrder = currentPage * ordersPerPage;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <TravelTruckLoading />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="max-w-7xl mx-auto p-8 space-y-6 w-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Package Orders</h1>
            <p className="text-gray-600 mt-1">Manage, search, and track all your package bookings</p>
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

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by Order ID, Customer, or Package..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <SlidersHorizontal size={14} />
              <span>Filters:</span>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="All">All Amounts</option>
              <option value="under_10k">Under ₹10,000</option>
              <option value="10k_50k">₹10,000 - ₹50,000</option>
              <option value="over_50k">Over ₹50,000</option>
            </select>

            <div className="h-6 w-px bg-gray-200 hidden sm:block mx-1" />

            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <ArrowUpDown size={14} />
              <span>Sort:</span>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="price_desc">Price: High - Low</option>
              <option value="price_asc">Price: Low - High</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100 max-w-lg mx-auto">
            <Package className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-700">No orders yet</h3>
            <p className="text-gray-500 mt-2">Your package bookings will appear here</p>
          </div>
        ) : currentOrders.length > 0 ? (
          <div className="space-y-4">
            {currentOrders.map((order: OrderDetails) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left Section - Order Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span 
                          className="font-mono text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md text-gray-700 cursor-pointer transition-colors" 
                          onClick={() => router.push(`/agency/orders/${order.id}`)}
                          title="Click to view full order itinerary details"
                        >
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
                          <User className="text-gray-400 animate-pulse" size={18} />
                          <span className="text-sm">
                            <span className="text-gray-500">Customer:</span>{' '}
                            <span className="font-medium">{order.userId?.name || 'N/A'}</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700">
                          <span className="text-sm">
                            <span className="text-gray-500">Amount:</span>{' '}
                            <span className="font-bold text-emerald-600">
                              ₹{order.amount.toLocaleString('en-IN')}
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
                    <div className="flex gap-3 lg:flex-col shrink-0">
                      <Link
                        href={`/package/chat/${order.userId}`}
                        className="flex-1 lg:flex-none px-4 py-2.5 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm shadow-sm"
                      >
                        <MessageCircle size={18} />
                        Chat
                      </Link>

                      <button
                        onClick={() => handleOpenModal(order)}
                        className="flex-1 lg:flex-none px-4 py-2.5 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium text-sm shadow-sm"
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
        ) : (
          <div className="bg-white border rounded-xl p-12 text-center shadow-sm max-w-lg mx-auto">
            <Tag className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-700">No matching orders</h3>
            <p className="text-gray-500 text-sm mt-2">
              No orders matched your active search or filters. Please adjust your criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('All');
                setPriceFilter('All');
                setSortBy('date_desc');
              }}
              className="mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs px-4 py-2 border rounded-lg transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Dynamic Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-100 mt-6">
            <p className="text-sm text-gray-600 font-medium">
              Showing {currentOrders.length > 0 ? indexOfFirstOrder + 1 : 0} to {Math.min(indexOfLastOrder, totalItems)} of {totalItems} matching orders
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-sm transition-colors border"
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg font-semibold text-sm border border-emerald-100">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-sm transition-colors border"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      <VendorFooter />

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