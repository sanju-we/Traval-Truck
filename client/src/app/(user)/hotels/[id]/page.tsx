'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/services/api';
import { Header } from '@/components/user/header/page';
import { Footer } from '@/components/user/footer/page';
import BookNowButton from '@/components/user/booking/BookNowButtonRoom';
import TermsModal from '@/components/shared/TermsModal';
import {
  Loader2,
  Users,
  IndianRupee,
  CalendarDays,
  CheckCircle,
  Hotel,
  Wifi,
  ArrowLeft,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { RoomData } from '@/types/hotel';

export default function RoomDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [room, setRoom] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(true);

  // Booking states
  const [checkInDate, setCheckInDate] = useState('');
  const [nights, setNights] = useState(1);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    if (id) fetchRoom(id as string);
  }, [id]);

  async function fetchRoom(roomId: string) {
    try {
      const res = await api.get(`/user/hotels/getRoom/${roomId}`);
      setRoom(res.data.data);
    } catch (err) {
      toast.error('Failed to load room');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10 text-emerald-600" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Room not found
      </div>
    );
  }

  const totalAmount = room.PricePerNight * nights;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft size={18} /> Back
        </button>

        {/* Room Info */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* Images */}
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden shadow">
              <img
                src={room.images?.[0] || '/images/room-placeholder.jpg'}
                className="w-full h-80 object-cover"
                alt="Room"
              />
            </div>

            {room.images?.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {room.images.slice(1, 4).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    className="h-24 w-full object-cover rounded-lg"
                    alt="Room"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="bg-white rounded-xl shadow p-6 space-y-5">
            <h1 className="text-3xl font-bold text-gray-800">
              Room {room.RoomNumber}
            </h1>

            <p className="text-gray-600">{room.Description}</p>

            <div className="flex flex-wrap gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Users size={16} /> {room.Capacity} Guests
              </span>
              <span className="flex items-center gap-1 font-semibold text-emerald-600">
                <IndianRupee size={16} /> {room.PricePerNight} / night
              </span>
            </div>

            {/* Facilities */}
            {room.Facilities?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Wifi size={16} /> Facilities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {room.Facilities.map((f, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Booking Section */}
        <div className="mt-10 bg-white rounded-xl shadow p-8">
          <h2 className="text-2xl font-bold mb-6">
            Complete Your Booking
          </h2>

          {/* Stay Inputs */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Check-in Date
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Nights
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setNights((n) => Math.max(1, n - 1))}
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  −
                </button>
                <span className="font-semibold">{nights}</span>
                <button
                  onClick={() => setNights((n) => n + 1)}
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-gray-50 border rounded-lg p-4 mb-6">
            <div className="flex justify-between">
              <span>Total Amount</span>
              <span className="font-bold text-emerald-600">
                ₹{totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Terms */}
          <div className="mb-6">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 accent-emerald-600"
              />
              <span className="text-sm">
                I accept the{' '}
                <button
                  type="button"
                  onClick={() => setShowTerms(true)}
                  className="text-emerald-600 underline"
                >
                  Terms & Conditions
                </button>
              </span>
            </label>
          </div>

          {/* Book Button */}
          <div className="flex justify-end">
            {acceptedTerms && room.Status == 'Available' && checkInDate ? (
              <BookNowButton
                roomId={room.id}
                amount={totalAmount}
                role="user"
                startDate={checkInDate}
              />
            ) : (
              <button
                disabled
                className="px-8 py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
              >
                Select date & accept terms & only if the Room is Available
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
    </div>
  );
}
