'use client';

import { useEffect, useState } from 'react';
import { Footer } from '@/components/user/footer/page';
import { Header } from '@/components/user/header/page';
import api from '@/services/api';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [destRes, tripRes, packRes, testiRes] = await Promise.all([
        api.get('/user/destinations'),
        api.get('/user/trips/recent'),
        api.get('/user/packages'),
        api.get('/user/testimonials'),
      ]);

      setDestinations(destRes.data.data || []);
      setTrips(tripRes.data.data || []);
      setPackages(packRes.data.data || []);
      setTestimonials(testiRes.data.data || []);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="animate-spin w-6 h-6 text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-800">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full max-w-6xl mx-auto mt-6">
        <img
          src="/images/Home head.png"
          alt="Hero"
          className="w-full h-[400px] object-cover rounded-xl"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white bg-black/40 rounded-xl">
          <h2 className="text-3xl font-bold">Embark on Your Next Adventure</h2>
          <button className="mt-4 px-6 py-3 bg-emerald-500 rounded-lg hover:bg-emerald-600">
            Plan Your Journey
          </button>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="max-w-6xl mx-auto mt-12 px-6">
        <h3 className="text-xl font-bold mb-4">Popular Destinations</h3>
        {destinations.length === 0 ? (
          <p className="text-gray-500">No destinations available.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {destinations.map((dest, i) => (
              <div key={i} className="rounded-lg overflow-hidden shadow hover:shadow-lg transition">
                <img
                  src={dest.imageUrl}
                  alt={dest.name}
                  className="w-full h-32 object-cover"
                />
                <div className="p-2 text-sm">
                  <h4 className="font-medium">{dest.name}</h4>
                  <p className="text-gray-500 text-xs">{dest.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Trips */}
      <section className="max-w-6xl mx-auto mt-12 px-6">
        <h3 className="text-xl font-bold mb-4">Recent Trips</h3>
        {trips.length === 0 ? (
          <p className="text-gray-500">No trips found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trips.map((trip, i) => (
              <div key={i}>
                <img
                  src={trip.imageUrl}
                  alt={trip.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <h4 className="mt-2 font-medium">{trip.title}</h4>
                <p className="text-gray-500 text-sm">
                  {trip.duration || 'Trip duration not specified'}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="max-w-6xl mx-auto mt-12 px-6">
        <h3 className="text-xl font-bold mb-4">Exclusive Packages</h3>
        {packages.length === 0 ? (
          <p className="text-gray-500">No packages available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg, i) => (
              <div key={i} className="border rounded-lg p-4 shadow hover:shadow-md transition">
                <h4 className="mt-2 font-medium">{pkg.title}</h4>
                <p className="text-gray-500 text-sm">{pkg.description}</p> <br />
                Dration :<p className="text-gray-500 text-sm">{pkg.duration}</p>
                Package Price :<p className="text-gray-500 text-sm">{pkg.price}</p>
                <button className="mt-3 px-4 py-2 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600">
                  Join Adventure
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Customer Testimonials */}
      <section className="max-w-6xl mx-auto mt-12 px-6">
        <h3 className="text-xl font-bold mb-4">Customer Testimonials</h3>
        {testimonials.length === 0 ? (
          <p className="text-gray-500">No testimonials available.</p>
        ) : (
          <div className="grid gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="p-4 border rounded-lg shadow-sm">
                <p className="text-gray-600 text-sm mb-2">“{t.message}”</p>
                <h4 className="font-medium">{t.name}</h4>
                <p className="text-yellow-500">
                  {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="max-w-6xl mx-auto mt-12 px-6 text-center">
        <h3 className="text-xl font-bold">Stay Updated</h3>
        <p className="text-gray-500 text-sm mt-2">
          Sign up for our newsletter to receive exclusive deals and travel inspiration.
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <input
            type="email"
            placeholder="Your email address"
            className="px-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
            Subscribe
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
