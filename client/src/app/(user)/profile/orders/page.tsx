'use client';

import { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock, CheckCircle, MessageCircle, Eye, ArrowLeft, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { USER_API_METHODS } from '@/services/APIs/user.api.service';
import { Header } from '@/components/user/header/page';
import { Footer } from '@/components/user/footer/page';

interface product {
  availableFoods: string[];
  description: string;
  itinerary: string[];
  price: number;
  title: string;
  images: string[];
  duration?: string;
}

interface Trip {
  id: string;
  orderId: string;
  product: product;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  agencyId?: string;
  amount: number;
  createdAt?: string;
}

export default function OrdersPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const router = useRouter();

  useEffect(() => {
    fetchTrips();
  }, []);

  async function fetchTrips() {
    try {
      setLoading(true);
      const response = await USER_API_METHODS.orderHistory();
      const data = await response.data;
      
      if (response.success) {
        setTrips(data);
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
    router.push(`/chat/${trip.agencyId || 'agency'}?orderId=${trip.orderId}`);
  }

  function handleViewDetails(trip: Trip) {
    console.log('trip:',typeof trip.id )
    router.push(`/profile/orders/${trip.id}`);
  }

  const filteredTrips = trips.filter(trip => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return trip.status === 'Upcoming' || trip.status === 'Ongoing';
    if (filter === 'completed') return trip.status === 'Completed';
    return true;
  });

  const upcomingTrips = trips.filter(t => t.status === 'Upcoming' || t.status === 'Ongoing');
  const completedTrips = trips.filter(t => t.status === 'Completed');

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

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Orders</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{trips.length}</p>
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

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition ${
              filter === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            All Orders ({trips.length})
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition ${
              filter === 'upcoming'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Upcoming ({upcomingTrips.length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition ${
              filter === 'completed'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Completed ({completedTrips.length})
          </button>
        </div>

        {/* Orders List */}
        {filteredTrips.length === 0 ? (
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
            {filteredTrips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex gap-5">
                  {trip.product.images[0] && (
                    <img
                      src={trip.product.images[0]}
                      alt={trip.product.title}
                      className="w-32 h-32 rounded-xl object-cover flex-shrink-0 border border-gray-200"
                    />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800 text-xl truncate mb-1">
                          {trip.product.title}
                        </h4>
                        <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                          <MapPin size={16} className="flex-shrink-0" />
                          <span className="line-clamp-1">{trip.product.description}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-xs">
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
                      
                      <span
                        className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0 inline-flex items-center gap-1.5 ${
                          trip.status === 'Upcoming'
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

                    {trip.product.duration && (
                      <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                        <Calendar size={16} />
                        <span>{trip.product.duration}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}