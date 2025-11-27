'use client';

import { useEffect, useState } from 'react';
import { Loader2, MapPin, Calendar, DollarSign, Star, ArrowRight, Plane, Mail, Phone, Instagram, Facebook, Twitter } from 'lucide-react';
import api from '@/services/api';
import { Header } from '@/components/user/header/page';

export default function HomePage() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

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
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="text-center">
          <Loader2 className="animate-spin w-12 h-12 text-emerald-500 mx-auto" />
          <p className="mt-4 text-gray-600 font-medium">Loading your adventure...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <Header/>

      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Embark on Your
              <span className="block text-emerald-400">Next Adventure</span>
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Discover breathtaking destinations and create memories that last a lifetime
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full font-semibold flex items-center space-x-2 transition transform hover:scale-105 shadow-lg">
                <span>Plan Your Journey</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold border-2 border-white/30 transition">
                Explore Destinations
              </button>
            </div>
          </div>
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-5xl px-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">150+</div>
              <div className="text-gray-600 text-sm font-medium">Destinations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">12K+</div>
              <div className="text-gray-600 text-sm font-medium">Happy Travelers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">98%</div>
              <div className="text-gray-600 text-sm font-medium">Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">24/7</div>
              <div className="text-gray-600 text-sm font-medium">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section id="destinations" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Destinations</h2>
          <p className="text-gray-600 text-lg">Explore the world's most captivating places</p>
        </div>
        
        {destinations.length === 0 ? (
          <p className="text-gray-500 text-center">No destinations available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((dest, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <img
                    src={dest.imageUrl}
                    alt={dest.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="w-4 h-4" />
                      <h3 className="text-xl font-bold">{dest.name}</h3>
                    </div>
                    <p className="text-gray-200 text-sm">{dest.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Trips */}
      <section id="trips" className="bg-gradient-to-br from-emerald-50 to-teal-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Recent Adventures</h2>
            <p className="text-gray-600 text-lg">See what our travelers have been exploring</p>
          </div>
          
          {trips.length === 0 ? (
            <p className="text-gray-500 text-center">No trips found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {trips.map((trip, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                  <div className="relative overflow-hidden">
                    <img
                      src={trip.imageUrl}
                      alt={trip.title}
                      className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{trip.duration || 'Duration TBD'}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{trip.title}</h3>
                    <p className="text-gray-600 mb-4">An incredible journey through stunning landscapes and cultural experiences.</p>
                    <button className="text-emerald-600 font-semibold flex items-center space-x-2 hover:space-x-3 transition-all">
                      <span>View Details</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Exclusive Packages */}
      <section id="packages" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Exclusive Packages</h2>
          <p className="text-gray-600 text-lg">Carefully curated experiences for every traveler</p>
        </div>
        
        {packages.length === 0 ? (
          <p className="text-gray-500 text-center">No packages available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-emerald-200">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{pkg.title}</h3>
                  <p className="text-emerald-50">{pkg.description}</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center space-x-3 text-gray-700">
                      <Calendar className="w-5 h-5 text-emerald-500" />
                      <span className="font-medium">{pkg.duration}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-5 h-5 text-emerald-500" />
                      <span className="text-2xl font-bold text-gray-900">{pkg.price}</span>
                      <span className="text-gray-500">per person</span>
                    </div>
                  </div>
                  <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold transition transform hover:scale-105 flex items-center justify-center space-x-2">
                    <span>Join Adventure</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Customer Testimonials */}
      <section id="testimonials" className="bg-gradient-to-br from-gray-50 to-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Traveler Stories</h2>
            <p className="text-gray-600 text-lg">Hear from our happy adventurers</p>
          </div>
          
          {testimonials.length === 0 ? (
            <p className="text-gray-500 text-center">No testimonials available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                  <div className="flex items-center mb-4">
                    {[...Array(t.rating)].map((_, idx) => (
                      <Star key={idx} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-lg mb-6 italic">"{t.message}"</p>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{t.name}</h4>
                      <p className="text-gray-500 text-sm">Verified Traveler</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <Mail className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-emerald-50 text-lg mb-8">
            Subscribe to receive exclusive deals, travel tips, and destination inspiration
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="px-6 py-4 rounded-full flex-1 text-gray-900 focus:outline-none focus:ring-4 focus:ring-emerald-300"
            />
            <button className="bg-white text-emerald-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition transform hover:scale-105 whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Plane className="w-8 h-8 text-emerald-500" />
                <span className="text-xl font-bold text-white">Travel Truck</span>
              </div>
              <p className="text-gray-400">Creating unforgettable travel experiences since 2010</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-emerald-400 transition">About Us</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Destinations</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Packages</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-emerald-400 transition">FAQs</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Booking Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect With Us</h4>
              <div className="flex space-x-4 mb-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-500 transition">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-500 transition">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-500 transition">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">hello@Travel Truck.com</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2025 Travel Truck . All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}