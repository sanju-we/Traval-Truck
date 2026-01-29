'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Map, Route, Wallet, MessageSquare, Users, Sparkles, CheckCircle, TrendingUp } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  
  return (
    <main className="bg-gradient-to-br from-blue-50 via-white to-emerald-50 overflow-hidden">

      {/* HERO */}
      <section className="min-h-screen flex items-center justify-center px-6 relative">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full text-emerald-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Travel Planning
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              Plan Trips.
              <span className="block text-emerald-600">Not Just Routes.</span>
            </h1>

            <p className="mt-6 text-lg text-gray-600">
              Travel Truck is an AI-powered travel planning platform that turns
              your ideas into optimized trip mind-maps with routes, budgets,
              and real-world insights.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
              <button 
                onClick={() => router.push('/home')}
                className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Get Started Free
              </button>
              <button className="px-8 py-4 border border-gray-300 bg-white rounded-xl font-semibold hover:bg-gray-50 transition">
                See How It Works
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center md:justify-start gap-6 text-sm text-gray-500">
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

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Hero Image Placeholder - Replace with actual image */}
            <div className="relative w-full aspect-square rounded-2xl bg-gradient-to-br from-emerald-400 to-blue-500 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <Map className="w-32 h-32 text-white opacity-30" />
              </div>
              {/* Floating cards for visual interest */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-10 right-10 bg-white p-4 rounded-lg shadow-xl"
              >
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <Route className="w-5 h-5 text-emerald-600" />
                  Route Optimized
                </div>
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="absolute bottom-10 left-10 bg-white p-4 rounded-lg shadow-xl"
              >
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <Wallet className="w-5 h-5 text-blue-600" />
                  Budget Tracked
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: '10K+', label: 'Trips Planned' },
            { number: '50+', label: 'Countries Covered' },
            { number: '5K+', label: 'Happy Travelers' },
            { number: '4.9★', label: 'User Rating' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-3xl md:text-4xl font-bold text-emerald-600">{stat.number}</div>
              <div className="mt-2 text-gray-600 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WHAT IS TRAVEL TRUCK */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800">
              What is Travel Truck?
            </h2>
            <p className="mt-6 text-gray-600 max-w-3xl mx-auto text-lg">
              Travel Truck helps travelers and agencies design trips visually.
              Instead of scattered notes and maps, you get a single intelligent
              system that handles planning, routing, budgeting, and collaboration.
            </p>
          </motion.div>

          {/* Image showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative w-full aspect-video rounded-2xl bg-gradient-to-br from-blue-100 to-emerald-100 shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Map className="w-24 h-24 text-emerald-600 mx-auto mb-4 opacity-50" />
                <p className="text-gray-500 font-medium">Interactive Trip Mind-Map Preview</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Everything You Need to Plan Perfect Trips
            </h2>
            <p className="text-gray-600">Powerful features that make travel planning effortless</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {f.title}
                </h3>
                <p className="text-gray-600">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-emerald-50 to-blue-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-emerald-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              How Travel Truck Works
            </h2>
            <p className="text-gray-600">Simple, smart, and incredibly powerful</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 text-white flex items-center justify-center font-bold text-xl mb-4">
                    {i + 1}
                  </div>
                  <p className="font-semibold text-gray-800 text-center">{step}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-emerald-400 to-blue-400 z-[-1]"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Built for Everyone Who Travels
            </h2>
            <p className="text-gray-600">Whether you're a solo traveler or managing a travel business</p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <InfoBlock
              title="For Travelers"
              icon={<Users className="w-8 h-8 text-white" />}
              gradient="from-emerald-500 to-teal-500"
              points={[
                'Create trip mind-maps',
                'Optimized routes with real roads',
                'Budget & wallet tracking',
                'Save trips as drafts or confirm',
              ]}
            />
            <InfoBlock
              title="For Agencies & Vendors"
              icon={<TrendingUp className="w-8 h-8 text-white" />}
              gradient="from-blue-500 to-indigo-500"
              points={[
                'Manage client itineraries',
                'Chat with users in real-time',
                'Vendor dashboards & wallets',
                'Centralized trip planning',
              ]}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Smarter trips start with better planning
            </h2>
            <p className="mt-4 text-xl text-gray-300">
              Build your next journey with Travel Truck.
            </p>
            <button 
              onClick={() => router.push('/mind-map')}
              className="inline-block mt-8 px-10 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl font-semibold hover:from-emerald-500 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Start Planning Now
            </button>
            <p className="mt-4 text-sm text-gray-400">No credit card required • Free forever plan</p>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-gray-400 text-sm bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <p>© {new Date().getFullYear()} Travel Truck. All rights reserved.</p>
          <div className="mt-4 flex justify-center gap-6 text-xs">
            <a href="#" className="hover:text-emerald-400 transition">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-400 transition">Terms of Service</a>
            <a href="#" className="hover:text-emerald-400 transition">Contact</a>
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
    desc: 'Generate complete travel plans with routes, insights, and structure.',
    icon: <Sparkles className="w-7 h-7 text-white" />,
  },
  {
    title: 'Real Road Routing',
    desc: 'Google Maps powered shortest and optimized routes.',
    icon: <Route className="w-7 h-7 text-white" />,
  },
  {
    title: 'Draft & Confirm Trips',
    desc: 'Create drafts, review, edit, and confirm when ready.',
    icon: <Map className="w-7 h-7 text-white" />,
  },
  {
    title: 'Wallet & Expenses',
    desc: 'Track budgets, shared wallets, and transactions.',
    icon: <Wallet className="w-7 h-7 text-white" />,
  },
  {
    title: 'Chat System',
    desc: 'User ↔ Agency ↔ Vendor real-time communication.',
    icon: <MessageSquare className="w-7 h-7 text-white" />,
  },
  {
    title: 'Vendor Management',
    desc: 'Hotels, restaurants, agencies in one ecosystem.',
    icon: <Users className="w-7 h-7 text-white" />,
  },
];

const steps = [
  'Create your trip',
  'Add destinations',
  'AI optimizes everything',
  'Travel confidently',
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
      className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow"
    >
      <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-6">{title}</h3>
      <ul className="space-y-3">
        {points.map((p, i) => (
          <li key={i} className="flex items-start gap-3 text-gray-600">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}