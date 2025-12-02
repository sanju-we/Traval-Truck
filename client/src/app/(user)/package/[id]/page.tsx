'use client';

import { useEffect, useState } from 'react';
import BookNowButton from '@/components/user/booking/bookNowButton';
import { useParams } from 'next/navigation';
import { USER_API_METHODS } from '@/services/APIs/user.api.service';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/user/header/page';
import { Footer } from '@/components/user/footer/page';
import {
  Loader2,
  Clock,
  Hotel,
  MapPin,
  Utensils,
  CalendarDays,
} from 'lucide-react';

interface HotelData {
  PartnerName: string;
  Location?: string;
  Media?: { Logo?: string };
}

interface DiningData {
  PartnerName: string;
  Media?: { Logo?: string };
}

interface PackageData {
  _id: string;
  title: string;
  duration: string;
  price: number;
  description: string;
  hotels: HotelData[];
  discoveries: string[];
  dining: DiningData[];
  availableFoods: string[];
  itinerary: { day: string; activities: string[] }[];
  CreatedBy: string;
}

export default function PackageDetailsPage() {
  const { id } = useParams();
  const [pack, setPack] = useState<PackageData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter()

  useEffect(() => {
    if (id) fetchPackageDetails(id as string);
  }, [id]);

  const fetchPackageDetails = async (packageId: string) => {
    try {
      const res = await USER_API_METHODS.packageDetails(packageId);
      console.log(res.data)
      setPack(res.data);
    } catch (error) {
      console.error('Error fetching package details:', error);
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

  if (!pack) {
    return (
      <div className="flex justify-center items-center h-[80vh] text-gray-600">
        Package not found.
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-800">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full max-w-6xl mx-auto mt-6 px-6">
        <div className="bg-emerald-100 rounded-xl p-6 shadow-md">
          <h1 className="text-3xl font-bold text-emerald-700">{pack.title}</h1>
          <p className="mt-2 text-gray-600">{pack.description}</p>
          <div className="flex flex-wrap items-center gap-6 mt-4 text-sm text-gray-700">
            <span className="flex items-center gap-1">
              <Clock size={16} /> {pack.duration}
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays size={16} /> Created on{' '}
              {new Date(pack.CreatedBy).toLocaleDateString()}
            </span>
            <span className="text-emerald-600 font-semibold">
              ₹{pack.price.toLocaleString()} / person
            </span>
          </div>
        </div>
      </section>

      {/* Hotels */}
      {pack.hotels?.length > 0 && (
        <section className="max-w-6xl mx-auto mt-10 px-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Hotel className="text-emerald-500" /> Hotels
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {pack.hotels.map((h, i) => (
              <div
                key={i}
                className="border rounded-lg p-4 shadow hover:shadow-md transition"
              >
                <img
                  src={h.Media?.Logo || '/images/default-hotel.jpg'}
                  alt={h.PartnerName}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold">{h.PartnerName}</h3>
                <p className="text-sm text-gray-500">{h.Location}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Discoveries */}
      {pack.discoveries?.length > 0 && (
        <section className="max-w-6xl mx-auto mt-10 px-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MapPin className="text-emerald-500" /> Discoveries
          </h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            {pack.discoveries.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Dining */}
      {pack.dining?.length > 0 && (
        <section className="max-w-6xl mx-auto mt-10 px-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Utensils className="text-emerald-500" /> Dining Options
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {pack.dining.map((d, i) => (
              <div
                key={i}
                className="border rounded-lg p-4 shadow hover:shadow-md transition text-center"
              >
                <img
                  src={d.Media?.Logo || '/images/default-restaurant.jpg'}
                  alt={d.PartnerName}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold">{d.PartnerName}</h3>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Available Foods */}
      {pack.availableFoods?.length > 0 && (
        <section className="max-w-6xl mx-auto mt-10 px-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Utensils className="text-emerald-500" /> Available Foods
          </h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            {pack.availableFoods.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Itinerary */}
      {pack.itinerary?.length > 0 && (
        <section className="max-w-6xl mx-auto mt-10 px-6 mb-12">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CalendarDays className="text-emerald-500" /> Itinerary
          </h2>
          <div className="space-y-4">
            {pack.itinerary.map((item, i) => (
              <div
                key={i}
                className="border rounded-lg p-4 shadow-sm bg-emerald-50"
              >
                <h3 className="font-semibold text-emerald-700">Day {item.day}</h3>
                <ul className="list-disc ml-5 text-sm text-gray-700 mt-2">
                  {item.activities.map((act, idx) => (
                    <li key={idx}>{act}</li>
                  ))}
                </ul>
              </div>
            ))}
            <BookNowButton
              packageId={id}
              amount={pack.price}
              role='user'
            />
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
