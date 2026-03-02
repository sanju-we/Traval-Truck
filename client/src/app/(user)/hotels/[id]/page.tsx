'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/user/header/page';
import { Footer } from '@/components/user/footer/page';
import BookNowButton from '@/components/user/booking/BookNowButtonRoom';
import TermsModal from '@/components/shared/TermsModal';
import { Loader2, Users, CalendarDays, CheckCircle, Hotel as HotelIcon, Wifi, ArrowLeft, MapPin, Star, Hotel } from 'lucide-react';
import toast from 'react-hot-toast';
import { IRoom } from '@/types/hotel';
import { USER_API_METHODS } from '@/services/APIs/user.api.service';

export default function HotelDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [hotel, setHotel] = useState<any | null>(null);
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [roomLoading, setRoomLoading] = useState(false);

  // Booking states
  const [checkInDate, setCheckInDate] = useState('');
  const [numPeople, setNumPeople] = useState(1);
  const [nights, setNights] = useState(1);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    if (id) {
      const hotelId = id as string;
      fetchHotelDetails(hotelId);
      fetchRooms(hotelId);
    }
  }, [id]);

  async function fetchHotelDetails(hotelId: string) {
    try {
      const res = await USER_API_METHODS.getHotelDetails(hotelId);
      setHotel(res.data);
    } catch (err) {
      toast.error('Failed to load hotel details');
    } finally {
      setLoading(false);
    }
  }

  async function fetchRooms(hotelId: string, filters?: { startDate?: string; endDate?: string; people?: number }) {
    try {
      setRoomLoading(true);
      const res = await USER_API_METHODS.getRoomsByHotel(hotelId, filters);
      setRooms(res.data);
    } catch (err) {
      toast.error('Failed to load room types');
    } finally {
      setRoomLoading(false);
    }
  }

  const handleFilter = () => {
    if (!checkInDate) {
      toast.error('Please select a check-in date first');
      return;
    }
    const endDate = new Date(checkInDate);
    endDate.setDate(endDate.getDate() + nights);

    fetchRooms(id as string, {
      startDate: checkInDate,
      endDate: endDate.toISOString().split('T')[0],
      people: numPeople
    });
    setIsFiltering(true);
  };

  const clearFilter = () => {
    fetchRooms(id as string);
    setIsFiltering(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10 text-emerald-600" />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Hotel not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft size={18} /> Back to Search
        </button>

        {/* Hotel Header */}
        <div className="bg-white rounded-xl shadow p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              <img
                src={hotel.logo || '/images/default-hotel.jpg'}
                className="w-full h-64 object-cover rounded-xl shadow"
                alt={hotel.companyName}
              />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{hotel.companyName}</h1>
              <div className="flex items-center text-gray-500 mb-4">
                <MapPin size={18} className="mr-2 text-emerald-500" />
                {hotel.address}
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {hotel.Description || `Welcome to ${hotel.companyName}. We offer the best hospitality and comfort for your stay.`}
              </p>
              <div className="flex gap-4">
                <div className="flex items-center px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg">
                  <Star size={18} className="mr-2 fill-emerald-500 text-emerald-500" />
                  <span className="font-bold">{hotel.rating || 'New'}</span>
                </div>
                <div className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                  <Users size={18} className="mr-2" />
                  <span>Family Friendly</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stay Selection (Common for all rooms) */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CalendarDays className="text-emerald-600" /> Select Your Stay
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Check-in Date</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full border-gray-200 rounded-lg px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Number of People</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setNumPeople((n) => Math.max(1, n - 1))}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  −
                </button>
                <span className="text-lg font-bold w-8 text-center">{numPeople}</span>
                <button
                  onClick={() => setNumPeople((n) => n + 1)}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  +
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Number of Nights</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setNights((n) => Math.max(1, n - 1))}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  −
                </button>
                <span className="text-lg font-bold w-8 text-center">{nights}</span>
                <button
                  onClick={() => setNights((n) => n + 1)}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 items-center justify-between border-t pt-6">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I have read and accept the{' '}
                <button type="button" onClick={() => setShowTerms(true)} className="text-emerald-600 underline font-medium">
                  Terms & Conditions
                </button>
              </label>
            </div>
            <div className="flex gap-3">
              {isFiltering && (
                <button
                  onClick={clearFilter}
                  className="px-6 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Clear Filter
                </button>
              )}
              <button
                onClick={handleFilter}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium flex items-center gap-2"
              >
                Check Availability
              </button>
            </div>
          </div>
        </div>

        {/* Room Selection */}
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Hotel className="text-emerald-600" /> Available Room Types
        </h2>

        <div className="relative min-h-[400px]">
          {roomLoading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-xl transition-all duration-300">
              <Loader2 className="animate-spin w-12 h-12 text-emerald-600 mb-2" />
              <p className="text-emerald-700 font-bold text-lg">Updating availability...</p>
            </div>
          )}

          <div className={`grid grid-cols-1 gap-6 transition-all duration-300 ${roomLoading ? 'opacity-40 pointer-events-none scale-[0.99]' : 'opacity-100'}`}>
            {rooms.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-xl shadow text-gray-500">
                No room types currently available for these criteria.
              </div>
            ) : (
              rooms.map((room) => (
                <div key={room.id} className="bg-white rounded-xl shadow overflow-hidden flex flex-col md:flex-row hover:shadow-md transition">
                  <div className="w-full md:w-80 h-64 flex-shrink-0">
                    <img
                      src={room.images?.[0] || '/images/room-placeholder.jpg'}
                      className="w-full h-full object-cover"
                      alt={room.roomType}
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-2xl font-bold text-gray-800">{room.roomType}</h3>
                        <div className="text-right">
                          <div className="text-emerald-600 text-2xl font-bold">₹{room.PricePerNight.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">per night</div>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2">{room.Description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                        <span className="flex items-center gap-1">
                          <Users size={16} /> Max {room.Capacity} Adults
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle size={16} className="text-green-500" /> {room.AvailableCount} Rooms Available
                        </span>
                        {isFiltering && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-bold">
                            Required Rooms: {Math.ceil(numPeople / room.Capacity)}
                          </span>
                        )}
                      </div>
                      {room.Facilities?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {room.Facilities.map((f, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              {f}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t flex justify-between items-center">
                      <div className="text-sm">
                        Total for {nights} {nights > 1 ? 'nights' : 'night'}:
                        <span className="font-bold text-gray-900 ml-1">₹{(room.PricePerNight * nights).toLocaleString()}</span>
                      </div>
                      {acceptedTerms && checkInDate && room.Status === 'Available' ? (
                        <BookNowButton
                          roomId={room.id}
                          amount={room.PricePerNight * nights}
                          role="user"
                          startDate={checkInDate}
                          people={numPeople}
                        />
                      ) : (
                        <button
                          disabled
                          className="px-6 py-2 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed text-sm font-medium"
                        >
                          Select stays & accept terms to book
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Footer />
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
    </div>
  );
}
