'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/services/api';
import { Header } from '@/components/user/header/page';
import { Footer } from '@/components/user/footer/page';
import { Loader2, Wifi, Users, Bed, Hotel, IndianRupee, CheckCircle } from 'lucide-react';

interface RoomData {
  _id: string;
  RoomNumber: number;
  Description: string;
  PricePerNight: number;
  Capacity: number;
  Facilities: string[];
  Images: string[];
  Status: string;
  HotelId: {
    companyName: string;
    email: string;
    phone: string;
    ownerName: string;
    documents: { loeo: string };
  };
}

export default function RoomDetailsPage() {
  const { id } = useParams();
  const [room, setRoom] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchRoomDetails(id as string);
  }, [id]);

  const fetchRoomDetails = async (roomId: string) => {
    try {
      const data = await api.get(`/user/hotels/getRoom/${roomId}`);
      console.log(data.data.data)
      setRoom(data.data.data);
    } catch (error) {
      console.error('Error fetching room details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="animate-spin w-8 h-8 text-emerald-500" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex justify-center items-center h-[80vh] text-gray-600">
        Room not found.
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-800">
      <Header />

      {/* Room Banner */}
      <section className="relative w-full max-w-6xl mx-auto mt-6 px-6">
        <div className="bg-emerald-50 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold text-emerald-700">
            Room {room.RoomNumber}
          </h1>
          <p className="mt-2 text-gray-600">{room.Description}</p>
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-700">
            <span className="flex items-center gap-1">
              <Users size={16} /> Capacity: {room.Capacity}
            </span>
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <IndianRupee size={16} /> {room.PricePerNight} / night
            </span>
            <span
              className={`px-3 py-1 text-xs rounded-full ${
                room.Status === 'Available'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {room.Status}
            </span>
          </div>
        </div>
      </section>

      {/* Room Images */}
      {room.Images?.length > 0 && (
        <section className="max-w-6xl mx-auto mt-8 px-6">
          <h2 className="text-xl font-bold mb-4">Room Gallery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {room.Images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Room Image ${i + 1}`}
                className="w-full h-48 object-cover rounded-lg shadow"
              />
            ))}
          </div>
        </section>
      )}

      {/* Facilities */}
      {room.Facilities?.length > 0 && (
        <section className="max-w-6xl mx-auto mt-10 px-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Wifi className="text-emerald-500" /> Facilities
          </h2>
          <ul className="flex flex-wrap gap-3">
            {room.Facilities.map((f, i) => (
              <li
                key={i}
                className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm flex items-center gap-2"
              >
                <CheckCircle size={14} /> {f}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Hotel Info */}
      {room.HotelId && (
        <section className="max-w-6xl mx-auto mt-10 px-6 mb-12">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Hotel className="text-emerald-500" /> Hotel Details
          </h2>
          <div className="border rounded-lg p-6 shadow bg-white flex flex-col sm:flex-row gap-6">
            <img
              src={room.HotelId.documents?.loeo || '/images/default-hotel.jpg'}
              alt={room.HotelId.companyName}
              className="w-48 h-48 object-cover rounded-lg shadow"
            />
            <div>
              <h3 className="text-lg font-semibold text-emerald-700">
                {room.HotelId.companyName}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Owned by: {room.HotelId.ownerName}
              </p>
              <p className="text-gray-600 text-sm mt-1">
                📞 {room.HotelId.phone}
              </p>
              <p className="text-gray-600 text-sm">✉️ {room.HotelId.email}</p>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
