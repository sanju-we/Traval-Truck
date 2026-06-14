import { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock, CheckCircle, MessageCircle, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { USER_API_METHODS } from '@/services/APIs/user.api.service';
import { ApiResponse } from '@/services/api.service';

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
  amount: number;
  product: product;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  agencyId?: string;
}

interface TripHistoryProps {
  userId: string;
}

export default function TripHistory({ userId }: TripHistoryProps) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const router = useRouter();

  useEffect(() => {
    fetchTrips();
  }, [userId]);

  async function fetchTrips() {
    try {
      setLoading(true);
      const response = await USER_API_METHODS.orderHistory(1, 3) as ApiResponse<Trip[]>;
      console.log(response);

      if (response && response.success) {
        setTrips(response.data || []);
      } else {
        toast.error(response?.message || 'Failed to fetch trips');
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
      toast.error('Failed to load trip history');
    } finally {
      setLoading(false);
    }
  }

  function handleChatWithAgency(trip: Trip) {
    // Navigate to chat page with agency
    router.push(`/chat/${trip.agencyId || 'agency'}?orderId=${trip.id}`);
  }

  function handleViewDetails(trip: Trip) {
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
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-3 text-gray-600">Loading your trips...</p>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="text-center py-20">
        <MapPin className="mx-auto text-gray-300" size={64} />
        <h3 className="mt-4 text-lg font-semibold text-gray-700">No trips yet</h3>
        <p className="text-gray-500 mt-2">Start planning your next adventure!</p>
        <button
          className="mt-6 px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
          onClick={() => router.push('/package')}
        >
          Browse Packages
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === 'all'
              ? 'bg-emerald-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            All Trips ({trips.length})
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === 'upcoming'
              ? 'bg-emerald-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Upcoming ({upcomingTrips.length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === 'completed'
              ? 'bg-emerald-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Completed ({completedTrips.length})
          </button>
        </div>

        {/* View All Link */}
        <button
          onClick={() => router.push('/profile/orders')}
          className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium text-sm transition"
        >
          View All
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        {filteredTrips.map((trip) => (
          <div
            key={trip.id}
            className="border rounded-xl p-5 hover:shadow-md transition bg-white"
          >
            <div className="flex gap-4">
              {trip.product.images && trip.product.images[0] && (
                <img
                  src={trip.product.images[0]}
                  alt={trip.product.title}
                  className="w-28 h-28 rounded-lg object-cover flex-shrink-0"
                />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 text-lg truncate">
                      {trip.product.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-gray-600 text-sm">
                      <MapPin size={16} className="flex-shrink-0" />
                      <span className="line-clamp-1">{trip.product.description}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-gray-500 text-xs">
                      <span className="font-mono">Order: {trip.orderId}</span>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${trip.status === 'Upcoming'
                      ? 'bg-blue-100 text-blue-700'
                      : trip.status === 'Ongoing'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-green-100 text-green-700'
                      }`}
                  >
                    {trip.status === 'Upcoming' && <Clock size={12} className="inline mr-1" />}
                    {trip.status === 'Completed' && <CheckCircle size={12} className="inline mr-1" />}
                    {trip.status}
                  </span>
                </div>

                {trip.product.duration && (
                  <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>{trip.product.duration}</span>
                  </div>
                )}

                <div className="flex items-center justify-between mt-4 gap-3">
                  <p className="text-lg font-bold text-emerald-600">
                    ₹{trip.amount.toLocaleString()}
                  </p>

                  <div className="flex gap-2">
                    {trip.status !== 'Completed' && (
                      <button
                        onClick={() => handleChatWithAgency(trip)}
                        className="px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
                      >
                        <MessageCircle size={16} />
                        Chat with Agency
                      </button>
                    )}
                    <button
                      onClick={() => handleViewDetails(trip)}
                      className="px-3 py-2 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition flex items-center gap-2"
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}