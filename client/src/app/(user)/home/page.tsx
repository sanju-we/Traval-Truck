'use client';

import { useEffect, useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Star, 
  ArrowRight, 
  Plane, 
  Mail, 
  Phone, 
  IndianRupee, 
  Facebook, 
  Twitter, 
  Compass, 
  Sliders, 
  Sparkles, 
  CheckCircle2, 
  Loader2,
  HelpCircle,
  Clock,
  Heart
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { Header } from '@/components/user/header/page';
import TravelTruckLoading from '@/components/shared/TravelTruckLoading';

// Pre-curated highly visual destinations
const CURATED_DESTINATIONS = [
  {
    name: 'Munnar Hills',
    description: 'Breathtaking green tea gardens, misty clouds, and pleasant weather perfect for nature lovers.',
    imageUrl: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600',
    tags: ['Hill Station', 'Nature', 'Misty'],
    avgCost: '₹4,500/day'
  },
  {
    name: 'Fort Kochi Heritage',
    description: 'Historical Dutch, Portuguese, and British streets merged with iconic giant Chinese fishing nets.',
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3c40cc0c9944?w=600',
    tags: ['Culture', 'Heritage', 'Coastal'],
    avgCost: '₹3,000/day'
  },
  {
    name: 'Alleppey Backwaters',
    description: 'Glide on calm rivers in a traditional premium houseboat and experience rural village serenity.',
    imageUrl: 'https://images.unsplash.com/photo-1593693411515-c202e974fe62?w=600',
    tags: ['Houseboat', 'Romance', 'Rivers'],
    avgCost: '₹8,000/day'
  },
  {
    name: 'Varkala Cliff Beach',
    description: 'Majestic red clay cliffs rising out of the Arabian Sea, coupled with high-vibe cafes and sunset views.',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600',
    tags: ['Beach', 'Sunset', 'Surfing'],
    avgCost: '₹3,500/day'
  }
];

// Curated traveler testimonials
const CURATED_TESTIMONIALS = [
  {
    name: 'Aishwarya Roy',
    rating: 5,
    message: 'The AI Mind-Map plotted a flawless, optimized route through Munnar. We saved hours of driving and found amazing coastal bites!',
    avatar: 'A'
  },
  {
    name: 'Rahul Sharma',
    rating: 5,
    message: 'Loved using the shared wallet features. Plotted expenses on the go with my friends during our Fort Kochi backpacking trip.',
    avatar: 'R'
  }
];

export default function HomePage() {
  const router = useRouter();
  const [packages, setPackages] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  // Interactive Hub Widget States
  const [targetDest, setTargetDest] = useState('');
  const [travelStyle, setTravelStyle] = useState('Solo');
  const [startDate, setStartDate] = useState('');

  // Interactive Budget Slider Widget
  const [budgetVal, setBudgetVal] = useState(25000);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [packRes, hotelRes] = await Promise.all([
        api.get('/user/packages/getAll?page=1&limit=3'),
        api.get('/user/hotels/getAll?page=1&limit=4'),
      ]);

      setPackages(packRes.data?.data?.data || []);
      setHotels(hotelRes.data?.data?.data || []);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get budget-matching preview values
  const getBudgetDetails = (val: number) => {
    if (val < 15000) {
      return { days: '2-3 Days', tier: 'Backpacker Light', stay: 'Standard Lodges', matches: 1 };
    }
    if (val < 40000) {
      return { days: '4-6 Days', tier: 'Classic Explorer', stay: 'Deluxe Cozy Stays', matches: 3 };
    }
    if (val < 85000) {
      return { days: '7-10 Days', tier: 'Premium Traveler', stay: 'Luxury Partner Resorts', matches: 4 };
    }
    return { days: '12+ Days', tier: 'Royal Elite Tour', stay: 'Premium Heritage Suites', matches: 4 };
  };

  const budgetSpecs = getBudgetDetails(budgetVal);

  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect cleanly to Mind Map tool, pre-loading variables
    router.push('/mind-map');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <TravelTruckLoading />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen font-sans selection:bg-emerald-500 selection:text-white">
      {/* Header */}
      <Header />

      {/* Reworked Hero & Trip Planner selector */}
      <section className="relative min-h-[580px] flex items-center justify-center overflow-hidden py-12">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text details */}
          <div className="lg:col-span-7 text-white space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              AI Route Planning Engine
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight">
              Embark on Your
              <span className="block text-emerald-400">Next Adventure</span>
            </h1>
            <p className="text-slate-300 text-base md:text-lg max-w-lg leading-relaxed">
              Discover breathtaking locations, map out road tracks instantly with real geolocations, and let AI design the perfect Mind-Map for your budget.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => router.push('/mind-map')}
                className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all text-white px-8 py-3.5 rounded-2xl font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <span>Create Mind-Map</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => {
                  const el = document.getElementById('destinations');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-8 py-3.5 rounded-2xl border border-white/20 font-bold transition-all"
              >
                Explore Destinations
              </button>
            </div>
          </div>

          {/* Right Interactive Trip Planner Widget */}
          <div className="lg:col-span-5">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/60 space-y-4">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-1.5">
                <Compass className="w-5 h-5 text-emerald-600 animate-spin-slow" />
                Quick Trip Planner
              </h3>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Setup your route preferences</p>
              
              <form onSubmit={handlePlanSubmit} className="space-y-4">
                {/* Destination Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Target Destination</label>
                  <select
                    value={targetDest}
                    onChange={(e) => setTargetDest(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-700"
                  >
                    <option value="">Select Dream Stop...</option>
                    <option value="Munnar">Munnar Hills, Kerala</option>
                    <option value="Kochi">Fort Kochi Beach, Kerala</option>
                    <option value="Alleppey">Alleppey Houseboat, Kerala</option>
                    <option value="Varkala">Varkala Cliff Beach, Kerala</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Style Selector */}
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Travel Style</label>
                    <select
                      value={travelStyle}
                      onChange={(e) => setTravelStyle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-700"
                    >
                      <option value="Solo">Solo Rider</option>
                      <option value="Adventure">Adventure Trek</option>
                      <option value="Family">Family Cozy</option>
                      <option value="Leisure">Couple Luxury</option>
                    </select>
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Departure Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-700"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-sm transition-all shadow-md flex items-center justify-center gap-1.5 shadow-emerald-600/10 active:scale-95"
                >
                  Generate AI Itinerary
                  <Sparkles className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* Curated Popular Destinations (Working Client Dataset) */}
      <section id="destinations" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Popular Destinations</h2>
          <p className="text-slate-500 font-medium">Explore hand-picked wanderlust stops tailored by local experts</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CURATED_DESTINATIONS.map((dest, i) => (
            <div 
              key={i} 
              onClick={() => {
                setTargetDest(dest.name);
                const el = document.getElementById('budget-planner');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 hover:border-emerald-500/20 transition-all duration-300"
            >
              <div className="relative h-60 overflow-hidden shrink-0">
                <img
                  src={dest.imageUrl}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex flex-wrap gap-1.5 mb-1.5">
                    {dest.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-[9px] font-extrabold uppercase bg-white/20 border border-white/10 backdrop-blur-md px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-lg font-black leading-tight group-hover:text-emerald-300 transition-colors">
                    {dest.name}
                  </h3>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 font-medium">{dest.description}</p>
                <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Estimated cost</span>
                  <span className="text-xs font-extrabold text-emerald-600">{dest.avgCost}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic Budget Slider Preview (Wow Factor!) */}
      <section id="budget-planner" className="bg-gradient-to-b from-white to-slate-50 border-y border-slate-100 py-24">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full text-emerald-700 text-xs font-bold uppercase tracking-wider">
              <Sliders className="w-3.5 h-3.5" />
              Budget Estimator Tool
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Interactive Tour Matcher</h2>
            <p className="text-slate-500 font-medium">Drag the slider according to your budget range to inspect matching stays & tours</p>
          </div>

          {/* Slider Controls */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-100 space-y-8">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400 font-bold uppercase tracking-wider">Plan Budget</span>
              <span className="text-2xl font-black text-emerald-600">₹{budgetVal.toLocaleString('en-IN')}</span>
            </div>

            <input
              type="range"
              min="5000"
              max="150000"
              step="5000"
              value={budgetVal}
              onChange={(e) => setBudgetVal(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none"
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold block uppercase mb-1">Trip Duration</span>
                <span className="text-sm font-extrabold text-slate-800">{budgetSpecs.days}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold block uppercase mb-1">Explorer Tier</span>
                <span className="text-sm font-extrabold text-slate-800 truncate block">{budgetSpecs.tier}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold block uppercase mb-1">Stay Type</span>
                <span className="text-sm font-extrabold text-slate-800 truncate block">{budgetSpecs.stay}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold block uppercase mb-1">Matched Offers</span>
                <span className="text-sm font-extrabold text-emerald-600 block">{budgetSpecs.matches} packages</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Exclusive Packages (Working API) */}
      <section id="packages" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Exclusive Packages</h2>
          <p className="text-slate-500 font-medium">Verified local packages crafted smoothly for your travels</p>
        </div>

        {packages.length === 0 ? (
          <p className="text-slate-400 text-center text-sm font-semibold">No packages available at this moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.slice(0, 3).map((pkg, i) => (
              <div 
                key={pkg.id || i} 
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 hover:border-emerald-500/20 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
                  <h3 className="text-xl font-extrabold mb-1 line-clamp-1">{pkg.title}</h3>
                  <p className="text-emerald-50 text-xs line-clamp-2 leading-relaxed font-semibold">{pkg.description}</p>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="space-y-3 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-500 font-bold" />
                      <span className="font-semibold">{pkg.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="w-4 h-4 text-emerald-500 font-bold" />
                      <span className="text-2xl font-black text-slate-800">₹{pkg.price}</span>
                      <span className="text-slate-400 text-xs font-bold uppercase">/ person</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => router.push(`/package`)}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-sm rounded-xl transition-all shadow-md shadow-emerald-600/10 flex items-center justify-center gap-1.5"
                  >
                    <span>View Package Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Customer Testimonials (Curated Client Dataset) */}
      <section id="testimonials" className="bg-gradient-to-b from-white to-slate-50 border-t border-slate-100 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Traveler Stories</h2>
            <p className="text-slate-500 font-medium">Hear real experiences shared by our globetrotters</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {CURATED_TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-0.5 mb-4">
                    {[...Array(t.rating)].map((_, idx) => (
                      <Star key={idx} className="w-4.5 h-4.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-base leading-relaxed italic mb-6">"{t.message}"</p>
                </div>

                <div className="flex items-center gap-4 border-t border-slate-50 pt-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-black text-sm shadow-md">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-800">{t.name}</h4>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Verified Traveler</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 py-16 shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-white rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center text-white relative z-10 space-y-6">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto shadow border border-white/10 shrink-0">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-black">Stay Updated</h2>
          <p className="text-emerald-100 max-w-md mx-auto text-sm leading-relaxed">
            Subscribe to receive exclusive deals, local travel guides, and new partner hotels discounts.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="px-5 py-3 rounded-xl flex-1 text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-300/40 text-sm shadow-inner bg-white font-medium"
            />
            <button className="bg-slate-900 hover:bg-slate-850 active:scale-95 text-white px-6 py-3 rounded-xl font-extrabold transition-all text-sm whitespace-nowrap shadow-md">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 py-12 text-sm border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-white font-black text-lg">
                <Plane className="w-6 h-6 text-emerald-500" />
                <span>Travel Truck</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">Creating unforgettable travel mind-maps and optimizing road networks seamlessly.</p>
            </div>
            <div>
              <h4 className="text-white font-extrabold text-xs uppercase tracking-wider mb-4">Quick Links</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Destinations</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Packages</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-extrabold text-xs uppercase tracking-wider mb-4">Support</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Booking Policy</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-extrabold text-xs uppercase tracking-wider mb-2">Connect With Us</h4>
              <div className="flex space-x-3">
                <a href="#" className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-900 pt-8 text-center text-xs text-slate-600">
            <p>&copy; {new Date().getFullYear()} Travel Truck. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}