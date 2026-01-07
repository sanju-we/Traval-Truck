'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Brain,
  Map,
  Sparkles,
  Route,
  PlusCircle,
  ChevronRight,
  CalendarDays,
  Image as ImageIcon,
  MapPin,
  Clock,
  ArrowRight,
  Zap,
  Heart,
  Users,
  TrendingUp,
  CheckCircle2,
  Star,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Header } from '@/components/user/header/page';
import { Footer } from '@/components/user/footer/page';
import toast from 'react-hot-toast';
import { USER_API_METHODS } from '@/services/APIs/user.api.service';

interface Place {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  description: string;
  dayPreference?: number;
  timePreference?: 'morning' | 'afternoon' | 'evening' | 'any';
  selected: boolean;
  placeId: string;
}

interface MindMapTrip {
  id:string;
  title: string;
  orderId:string;
  startDate?: string;
  days: number;
  places: Place[];
  coverImage?: string;
  status: 'Draft' | 'Planned' | 'Booked';
}

export default function MindMapsPage() {
  const router = useRouter();
  const [myPlans, setMyPlans] = useState<MindMapTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchMindmap = async (page: number) => {
    const map = await USER_API_METHODS.getMindMap(page);
    if (map) return map;
    return [];
  };

  useEffect(() => {
    const loadMindmap = async () => {
      const plans = await fetchMindmap(page);
      console.log(plans)
      setMyPlans(plans.data.data);
      setLoading(false);
    };
    loadMindmap();
  }, [page]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-24">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-blue-400/10 rounded-3xl blur-3xl"></div>
          
          <div className="relative grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles size={16} />
                AI-Powered Trip Planning
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Your Travel,
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
                  Visually Mapped
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Transform your travel ideas into beautiful, interactive mind-maps. 
                Plan visually, collaborate easily, and bring your dream trips to life.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => router.push('/mind-map/create')}
                  className="group px-8 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                >
                  <PlusCircle size={20} />
                  Create Your First Mind-Map
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center gap-2 text-gray-600">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  <span className="text-sm font-medium">Free to start • No credit card</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200">
                <div>
                  <div className="text-3xl font-bold text-gray-900">50K+</div>
                  <div className="text-sm text-gray-600">Trips Planned</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">95%</div>
                  <div className="text-sm text-gray-600">Satisfaction</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">200+</div>
                  <div className="text-sm text-gray-600">Destinations</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
              <div className="relative bg-white p-2 rounded-3xl shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800"
                  alt="Mind Map Planning"
                  className="rounded-2xl w-full h-[500px] object-cover"
                />
                
                {/* Floating cards */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-8 -left-6 bg-white p-4 rounded-xl shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <MapPin className="text-emerald-600" size={20} />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">5 Places</div>
                      <div className="text-xs text-gray-500">Added today</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  className="absolute bottom-8 -right-6 bg-white p-4 rounded-xl shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Zap className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">AI Optimized</div>
                      <div className="text-xs text-gray-500">Best route</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Mind-Map Planning?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The smartest way to plan, visualize, and execute your perfect trip
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Brain,
                color: 'emerald',
                title: 'Visual Planning',
                desc: 'See your entire trip at a glance with intuitive mind-map interface',
              },
              {
                icon: Sparkles,
                color: 'blue',
                title: 'AI Recommendations',
                desc: 'Get smart suggestions for places, routes, and experiences',
              },
              {
                icon: Route,
                color: 'purple',
                title: 'Smart Routing',
                desc: 'Optimize travel time with intelligent route planning',
              },
              {
                icon: Users,
                color: 'pink',
                title: 'Collaborate',
                desc: 'Plan together with friends and family in real-time',
              },
              {
                icon: Heart,
                color: 'red',
                title: 'Save Favorites',
                desc: 'Bookmark and organize your dream destinations',
              },
              {
                icon: TrendingUp,
                color: 'orange',
                title: 'Track Progress',
                desc: 'Monitor your planning journey from idea to reality',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 hover:border-transparent transition-all duration-300 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br from-${feature.color}-50 to-${feature.color}-100 opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                
                <div className="relative">
                  <div className={`w-14 h-14 bg-${feature.color}-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`text-${feature.color}-600`} size={28} />
                  </div>
                  
                  <h3 className="font-bold text-xl text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* How It Works */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-purple-100/50 rounded-3xl -z-10"></div>
          
          <div className="p-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600">
                From dream to reality in 4 simple steps
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8 relative">
              {/* Connection line */}
              <div className="hidden md:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-emerald-200 via-blue-200 to-purple-200"></div>

              {[
                {
                  icon: Brain,
                  step: '01',
                  title: 'Start with Ideas',
                  desc: 'No dates needed. Just brainstorm where you want to go.',
                  color: 'emerald',
                },
                {
                  icon: MapPin,
                  step: '02',
                  title: 'Add & Connect',
                  desc: 'Search places, drag them onto your map, and connect them.',
                  color: 'blue',
                },
                {
                  icon: Route,
                  step: '03',
                  title: 'Organize & Refine',
                  desc: 'Set days, times, add notes, and let AI optimize the route.',
                  color: 'purple',
                },
                {
                  icon: CheckCircle2,
                  step: '04',
                  title: 'Book & Go',
                  desc: 'Convert your plan into real bookings when you\'re ready.',
                  color: 'pink',
                },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative"
                >
                  <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-${step.color}-500 to-${step.color}-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg z-10`}>
                    {step.step}
                  </div>

                  <div className="bg-white rounded-2xl p-6 pt-10 shadow-lg hover:shadow-2xl transition-shadow">
                    <div className={`w-16 h-16 bg-${step.color}-100 rounded-2xl flex items-center justify-center mb-4 mx-auto`}>
                      <step.icon className={`text-${step.color}-600`} size={32} />
                    </div>
                    
                    <h3 className="font-bold text-lg text-gray-900 text-center mb-2">
                      {step.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 text-center leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* My Mind-Maps */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                My Mind-Map Trips
              </h2>
              <p className="text-gray-600">
                Your journey from imagination to reality
              </p>
            </div>

            {myPlans.length > 0 && (
              <button
                onClick={() => router.push('/mind-map/create')}
                className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition flex items-center gap-2"
              >
                <PlusCircle size={20} />
                New Mind-Map
              </button>
            )}
          </motion.div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600 mb-4"></div>
              <p className="text-gray-600 font-medium">Loading your mind-maps...</p>
            </div>
          ) : myPlans.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-16 text-center border-2 border-dashed border-gray-300 hover:border-emerald-400 transition-colors"
            >
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Map className="text-emerald-600" size={40} />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Start Your First Mind-Map
              </h3>
              
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Turn your travel dreams into visual plans. Create your first mind-map 
                and see where your imagination takes you!
              </p>

              <button
                onClick={() => router.push('/mind-map/create')}
                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all inline-flex items-center gap-2"
              >
                <PlusCircle size={20} />
                Create Your First Mind-Map
                <ArrowRight size={18} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {myPlans?.map((plan, index) => (
                <motion.div
                  key={plan.orderId}
                  variants={itemVariants}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2"
                  onClick={() => router.push(`/mind-maps/${plan.id}`)}
                >
                  {/* Cover Image */}
                  <div className="relative h-48 bg-gradient-to-br from-emerald-400 to-blue-500 overflow-hidden">
                    {plan.coverImage ? (
                      <img
                        src={plan.coverImage}
                        alt={plan.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Map className="text-white/30" size={80} />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${
                          plan.status === 'Draft'
                            ? 'bg-gray-900/70 text-white'
                            : plan.status === 'Planned'
                            ? 'bg-blue-600/90 text-white'
                            : 'bg-emerald-600/90 text-white'
                        }`}
                      >
                        {plan.status === 'Booked' && <CheckCircle2 size={12} />}
                        {plan.status}
                      </span>
                    </div>

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <h3 className="font-bold text-xl text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                      {plan.title}
                    </h3>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <CalendarDays size={16} className="text-emerald-600" />
                        <span className="font-medium">{plan.days} days</span>
                      </div>
                      
                      <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                      
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <MapPin size={16} className="text-blue-600" />
                        <span className="font-medium">{plan.places?.map((p) => p.name)} places</span>
                      </div>
                    </div>

                    {/* View button */}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-emerald-600 font-semibold text-sm group-hover:text-emerald-700">
                        <span>View Details</span>
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-3xl"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative px-12 py-16 text-center"
          >
            <Star className="text-yellow-300 mx-auto mb-6" size={48} fill="currentColor" />
            
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Plan Your Dream Trip?
            </h2>
            
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of travelers who are creating beautiful, organized trip plans with Mind-Maps
            </p>

            <button
              onClick={() => router.push('/mind-map/create')}
              className="px-10 py-4 bg-white text-emerald-600 rounded-xl font-bold text-lg hover:bg-gray-50 hover:scale-105 transition-all shadow-xl inline-flex items-center gap-3"
            >
              <PlusCircle size={24} />
              Start Creating Now
              <ArrowRight size={20} />
            </button>

            <p className="text-white/80 text-sm mt-4">
              ✨ Free forever • No credit card required
            </p>
          </motion.div>
        </section>
      </div>

      <Footer />
    </div>
  );
}