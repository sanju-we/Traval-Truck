'use client';

import { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock, CheckCircle, MessageCircle, Eye, ArrowLeft, Package, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { USER_API_METHODS } from '@/services/APIs/user.api.service';
import { Header } from '@/components/user/header/page';
import { Footer } from '@/components/user/footer/page';
import { Trip } from '@/types/user/profile';

export default function OrdersPage() {
  const [allTrips, setAllTrips] = useState<Trip[]>([]);
  const [displayTrips, setDisplayTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const router = useRouter();

  useEffect(() => {
    fetchAllTripsForStats();
  }, []);
  useEffect(() => {
    fetchCurrentPage();
  }, [currentPage, filter]);

  async function fetchAllTripsForStats() {
    try {
      const response = await USER_API_METHODS.orderHistory();
      if (response.success) {
        setAllTrips(response.data);
      }
    } catch (error) {
      console.error('Error fetching trip statistics:', error);
    }
  }

  async function fetchCurrentPage() {
    try {
      setLoading(true);
      const response = await USER_API_METHODS.orderHistory();
      const data = await response.data;

      if (response.success) {
        console.log('data:', data);

        const filtered = data.filter((trip: Trip) => {
          if (filter === 'all') return true;
          if (filter === 'upcoming') return trip.status === 'Upcoming' || trip.status === 'Ongoing';
          if (filter === 'completed') return trip.status === 'Completed';
          return true;
        });

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setDisplayTrips(filtered.slice(startIndex, endIndex));
      } else {
        toast.error(response.message || 'Failed to fetch trips');
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
      toast.error('Failed to load trip history');
    } finally {
      setLoading(false);
    }
  }

  function handleChatWithAgency(trip: Trip) {
    const agencyId = trip.product.data.ownedBy || trip.agencyId;
    if (agencyId) {
      router.push(`/chat/${agencyId}?orderId=${trip.orderId}`);
    } else {
      toast.error('Agency information not available');
    }
  }

  function handleViewDetails(trip: Trip) {
    console.log('trip:', typeof trip.id)
    router.push(`/profile/orders/${trip.id}`);
  }

  const upcomingTrips = allTrips.filter((t: Trip) => t.status === 'Upcoming' || t.status === 'Ongoing');
  const completedTrips = allTrips.filter((t: Trip) => t.status === 'Completed');

  const filteredCount = allTrips.filter((trip: Trip) => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return trip.status === 'Upcoming' || trip.status === 'Ongoing';
    if (filter === 'completed') return trip.status === 'Completed';
    return true;
  }).length;

  const totalPages = Math.ceil(filteredCount / itemsPerPage);

  const handleFilterChange = (newFilter: 'all' | 'upcoming' | 'completed') => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Orders</h1>
          <p className="text-gray-600">View and manage all your bookings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Orders</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{allTrips.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Upcoming Trips</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">{upcomingTrips.length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="text-orange-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Completed</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{completedTrips.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition ${filter === 'all'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
          >
            All Orders ({allTrips.length})
          </button>
          <button
            onClick={() => handleFilterChange('upcoming')}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition ${filter === 'upcoming'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
          >
            Upcoming ({upcomingTrips.length})
          </button>
          <button
            onClick={() => handleFilterChange('completed')}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition ${filter === 'completed'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
          >
            Completed ({completedTrips.length})
          </button>
        </div>

        {displayTrips.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <MapPin className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-700">No orders found</h3>
            <p className="text-gray-500 mt-2">
              {filter === 'all'
                ? "You haven't made any bookings yet"
                : `No ${filter} trips found`}
            </p>
            {filter === 'all' && (
              <button
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                onClick={() => router.push('/package')}
              >
                Browse Packages
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {displayTrips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
              >
                {/* Top Section: Title Left, Image Right */}
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-800 text-xl truncate mb-1">
                      {trip.product.data.title || trip.product.data.Description}
                    </h4>
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                      <MapPin size={16} className="flex-shrink-0" />
                      <span className="line-clamp-1">{trip.product.data.description || trip.product.data.Description}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center text-gray-500 text-xs mt-2">
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                        Order #{trip.orderId}
                      </span>
                      {trip.createdAt && (
                        <span>
                          • Booked on {new Date(trip.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                  {trip.product.data.images && trip.product.data.images.length > 0 && (
                    <img
                      src={trip.product.data.images[0]}
                      alt={trip.product.data.title || 'Room'}
                      className="w-24 h-24 rounded-lg object-cover flex-shrink-0 border border-gray-200"
                    />
                  )}
                </div>

                {/* Middle Section: Status & Details, People Count Right */}
                <div className="flex flex-wrap justify-between items-center gap-4 py-4 border-y border-gray-50 mb-4">
                  <div className="flex flex-wrap gap-4 items-center">
                    {trip.product.data.duration && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={16} />
                        <span>{trip.product.data.duration}</span>
                      </div>
                    )}
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap inline-flex items-center gap-1.5 ${trip.status === 'Upcoming'
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : trip.status === 'Ongoing'
                          ? 'bg-orange-100 text-orange-700 border border-orange-200'
                          : 'bg-green-100 text-green-700 border border-green-200'
                        }`}
                    >
                      {trip.status === 'Upcoming' && <Clock size={14} />}
                      {trip.status === 'Completed' && <CheckCircle size={14} />}
                      {trip.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-blue-700 font-semibold bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                    <Users size={18} />
                    <span>{trip.people || 1} People</span>
                  </div>
                </div>

                {/* Bottom Section: Price & Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ₹{trip.amount.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    {trip.status !== 'Completed' && (
                      <button
                        onClick={() => handleChatWithAgency(trip)}
                        className="px-4 py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-semibold"
                      >
                        <MessageCircle size={18} />
                        Chat with Agency
                      </button>
                    )}
                    <button
                      onClick={() => handleViewDetails(trip)}
                      className="px-4 py-2.5 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition flex items-center gap-2 font-semibold"
                    >
                      <Eye size={18} />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition ${currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-semibold transition ${currentPage === page
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition ${currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}