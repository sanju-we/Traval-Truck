'use client'

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Map, 
  Route, 
  Wallet, 
  MessageSquare, 
  Users, 
  Sparkles, 
  CheckCircle, 
  TrendingUp, 
  IndianRupee, 
  Star, 
  Loader2, 
  Calendar, 
  ArrowRight, 
  MapPin,
  ChevronRight,
  Compass,
  Heart
} from 'lucide-react';
import api from '@/services/api';

export default function LandingPage() {
  const router = useRouter();
  const [packages, setPackages] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pkgRes, hotelRes] = await Promise.all([
          api.get('/user/packages/getAll?page=1&limit=3'),
          api.get('/user/hotels/getAll?page=1&limit=4'),
        ]);
        setPackages(pkgRes.data?.data?.data || []);
        setHotels(hotelRes.data?.data?.data || []);
      } catch (error) {
        console.error('Error fetching landing page data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAction = () => {
    router.push('/login');
  };

  return (
    <main className="bg-gradient-to-b from-emerald-50/60 via-white to-blue-50/50 min-h-screen text-slate-800 font-sans selection:bg-emerald-500 selection:text-white overflow-hidden">
      
      {/* Immersive Travel Hero */}
      <section className="min-h-screen flex items-center justify-center px-6 relative py-12">
        {/* Soft floating blurred background nodes */}
        <div className="absolute top-20 left-10 w-80 h-80 bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-2xl animate-pulse delay-1000"></div>

        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Left Hero Text Block */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-700 text-sm font-semibold shadow-sm">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
              AI-Powered Travel Planning
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight">
              Plan Trips.
              <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 bg-clip-text text-transparent">
                Not Just Routes.
              </span>
            </h1>

            <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-xl">
              Travel Truck is a smart AI travel planner that transforms your wandering thoughts into beautifully optimized mind-maps, real road networks, budgets, and live local insights.
            </p>

            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 pt-4">
              <button
                onClick={handleAction}
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-extrabold transition-all shadow-lg shadow-emerald-600/20 active:scale-95 flex items-center justify-center gap-2 text-base"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => {
                  const el = document.getElementById('how-it-works');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl font-bold transition-all"
              >
                See How It Works
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-slate-500 font-semibold pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                Free forever plan
              </div>
            </div>
          </motion.div>

          {/* Right Hero Visual Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-600 to-indigo-600 shadow-2xl shadow-emerald-950/20 overflow-hidden flex items-center justify-center group">
              <div className="absolute inset-0 bg-black/10 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <Compass className="w-36 h-36 text-white/20 animate-spin-slow shrink-0" />
              
              {/* Floating Route Optimized Card */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-12 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/40"
              >
                <div className="flex items-center gap-2.5 text-sm font-bold text-slate-800">
                  <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                    <Route className="w-4 h-4" />
                  </div>
                  Route Optimized
                </div>
              </motion.div>

              {/* Floating Budget Tracked Card */}
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5, ease: "easeInOut" }}
                className="absolute bottom-12 left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/40"
              >
                <div className="flex items-center gap-2.5 text-sm font-bold text-slate-800">
                  <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                    <Wallet className="w-4 h-4" />
                  </div>
                  Budget Tracked
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Global Counters Strip */}
      <section className="py-12 bg-white border-y border-slate-100 shadow-sm relative z-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: '10K+', label: 'Trips Planned' },
            { number: '50+', label: 'Countries Covered' },
            { number: '5K+', label: 'Happy Travelers' },
            { number: '4.9★', label: 'User Rating' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="text-3xl md:text-4xl font-extrabold text-emerald-600 tracking-tight">{stat.number}</div>
              <div className="mt-1 text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Immersive Concept Section */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              What is Travel Truck?
            </h2>
            <p className="text-slate-600 max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
              We replace thousands of scattered, messy notes, maps, and spreadsheets with a single, highly visual, collaborative travel engine built to turn dreams into seamless itineraries.
            </p>
          </motion.div>

          {/* Interactive Showcase Graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative w-full aspect-video rounded-3xl bg-gradient-to-br from-emerald-100 to-indigo-100 shadow-2xl border border-slate-100/50 overflow-hidden flex items-center justify-center"
          >
            <div className="text-center p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl max-w-md border border-white">
              <Map className="w-16 h-16 text-emerald-600 mx-auto mb-4 animate-bounce" />
              <h4 className="font-extrabold text-slate-800 text-lg">Interactive Mind-Map Preview</h4>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                Watch routes, stops, restaurants, and stays snap into an optimized structure with a beautiful visual layout.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modern Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Plan Perfect Trips Effortlessly
            </h2>
            <p className="text-slate-500 font-medium text-base">Unleash advanced travel tools constructed for today's explorers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group bg-gradient-to-b from-white to-slate-50/50 p-8 rounded-3xl border border-slate-100 hover:border-emerald-500/20 hover:shadow-xl transition-all duration-300 shadow-sm"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-5 text-white shadow-md group-hover:scale-105 transition-transform duration-300">
                  {f.icon}
                </div>
                <h3 className="text-lg font-extrabold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors">
                  {f.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Strip */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-emerald-50/30 via-slate-50 to-blue-50/20 relative overflow-hidden border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              How Travel Truck Works
            </h2>
            <p className="text-slate-500 font-medium">Simple steps to plan your next holiday like a professional</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100/80 hover:shadow-md hover:border-slate-200 transition-all flex flex-col items-center text-center"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-extrabold text-base mb-4 shadow-sm">
                  {i + 1}
                </div>
                <p className="font-bold text-slate-700 text-sm">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Travel Packages (Working API) */}
      <section id="packages" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Popular Travel Packages</h2>
            <p className="text-slate-500 font-medium">Hand-picked coordinates with rich itineraries</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm font-semibold">
              Currently compiling curated travel packages. Keep exploring!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packages.slice(0, 3).map((pkg, i) => (
                <motion.div
                  key={pkg.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 hover:border-emerald-500/20 overflow-hidden transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white relative overflow-hidden">
                      <h3 className="text-xl font-extrabold mb-1 line-clamp-1">{pkg.title}</h3>
                      <p className="text-emerald-100 text-xs line-clamp-2 leading-relaxed font-medium">{pkg.description}</p>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div className="space-y-3 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-500" />
                        <span className="font-semibold">{pkg.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IndianRupee className="w-4 h-4 text-emerald-500" />
                        <span className="text-xl font-extrabold text-slate-800">₹{pkg.price}</span>
                        <span className="text-slate-400 text-xs font-bold uppercase">/ person</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleAction}
                      className="w-full py-3 bg-emerald-50 border border-emerald-100 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 text-emerald-700 font-extrabold text-sm rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      View Details
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Stays & Rooms (Working API) */}
      <section id="rooms" className="py-24 bg-gradient-to-b from-white to-slate-50/50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Featured Rooms & Stays</h2>
            <p className="text-slate-500 font-medium">Enjoy maximum comfort in our verified partner rooms</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
            </div>
          ) : hotels.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm font-semibold">
              Currently preparing partner premium hotel rooms.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {hotels.slice(0, 4).map((hotel, i) => (
                <motion.div
                  key={hotel.id || i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 hover:border-emerald-500/20 transition-all duration-300"
                  onClick={handleAction}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={hotel.Images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500'}
                      alt={hotel.HotelName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                    
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex items-center gap-1 text-[10px] bg-white/20 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 w-max mb-1">
                        <MapPin className="w-3 h-3 text-emerald-300" />
                        <span className="font-bold uppercase tracking-wider">{hotel.location || "Kerala"}</span>
                      </div>
                      <h3 className="font-extrabold text-sm line-clamp-1 group-hover:text-emerald-300 transition-colors">
                        {hotel.HotelName}
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-0.5 text-xs text-amber-500 font-extrabold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{hotel.Rating || '4.5'}</span>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Starting</span>
                      <span className="text-xs font-black text-emerald-600">₹{hotel.startingPrice || '1,200'} / night</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              Smarter trips start with better planning
            </h2>
            <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto">
              Build your next journey with Travel Truck. Optimize routes, manage budgets, and map your path effortlessly.
            </p>
          </motion.div>

          <button
            onClick={handleAction}
            className="inline-flex items-center gap-2 px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-extrabold transition-all shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-95 text-base"
          >
            <span>Start Planning Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <p className="text-xs text-slate-500 font-semibold">No credit card required • Free forever plan</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 text-slate-500 text-sm bg-slate-950 border-t border-slate-900">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-black text-lg">
            <div className="bg-emerald-600 p-1.5 rounded-lg">
              <Compass className="w-5 h-5 text-white animate-spin-slow" />
            </div>
            Travel Truck
          </div>
          <p className="text-xs">© {new Date().getFullYear()} Travel Truck. All rights reserved.</p>
          <div className="flex gap-6 text-xs font-semibold">
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ------------------ DATA ------------------ */

const features = [
  {
    title: 'AI Trip Mind-Maps',
    desc: 'Generate complete, beautiful travel plans with routes, insights, and structures instantly.',
    icon: <Sparkles className="w-6 h-6" />,
  },
  {
    title: 'Real Road Routing',
    desc: 'Powered by Google Maps APIs to navigate via shortest, optimized road paths.',
    icon: <Route className="w-6 h-6" />,
  },
  {
    title: 'Draft & Confirm',
    desc: 'Draft your travel plans, customize coordinates, and confirm when ready to depart.',
    icon: <Map className="w-6 h-6" />,
  },
  {
    title: 'Wallet & Expenses',
    desc: 'Keep travel accounts crystal clear. Plan collective budgets and track transactions.',
    icon: <Wallet className="w-6 h-6" />,
  },
  {
    title: 'Collaborative Chat',
    desc: 'Real-time user-agency-vendor group chat services tailored for trip plans.',
    icon: <MessageSquare className="w-6 h-6" />,
  },
  {
    title: 'Local Explorer',
    desc: 'Map out the best restaurants, cafes, hotels, and attractions live near you.',
    icon: <Users className="w-6 h-6" />,
  },
];

const steps = [
  'Create your trip plan',
  'Add dream stops',
  'AI auto-optimizes',
  'Explore confidently',
];

function InfoBlock({
  title,
  icon,
  gradient,
  points,
}: {
  title: string;
  icon: React.ReactNode;
  gradient: string;
  points: string[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
    >
      <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mb-6 shadow text-white`}>
        {icon}
      </div>
      <h3 className="text-xl font-extrabold text-slate-800 mb-4">{title}</h3>
      <ul className="space-y-3 text-sm text-slate-600">
        {points.map((p, i) => (
          <li key={i} className="flex items-center gap-2 font-medium">
            <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}