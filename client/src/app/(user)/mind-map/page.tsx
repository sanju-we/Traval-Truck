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
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Header } from '@/components/user/header/page';
import { Footer } from '@/components/user/footer/page';
import toast from 'react-hot-toast';

/* -------------------- Types -------------------- */

interface MindMapTrip {
  id: string;
  title: string;
  startDate?: string;
  days: number;
  places: number;
  coverImage?: string;
  status: 'Draft' | 'Planned' | 'Booked';
}

/* -------------------- Page -------------------- */

export default function MindMapsPage() {
  const router = useRouter();
  const [myPlans, setMyPlans] = useState<MindMapTrip[]>([]);
  const [loading, setLoading] = useState(true);

  /* Simulated fetch (replace with API later) */
  useEffect(() => {
    setTimeout(() => {
      setMyPlans([
        {
          id: '1',
          title: 'My Kerala Dream Trip',
          days: 5,
          places: 8,
          status: 'Draft',
          coverImage:
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
        },
        {
          id: '2',
          title: 'Weekend at Wayanad',
          days: 2,
          places: 4,
          status: 'Planned',
          coverImage:
            'https://images.unsplash.com/photo-1524492412937-b28074a5d7da',
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-10 space-y-20">

        {/* ---------------- HERO INTRO ---------------- */}
        <section className="grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              Your Travel,
              <span className="text-emerald-600"> Your Mind-Map</span>
            </h1>

            <p className="mt-4 text-gray-600 text-lg">
              Mind-Maps let you visually design your trips step-by-step —
              explore ideas, add places, adjust days, and turn them into real bookings.
            </p>

            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={() => router.push('/mind-map/create')}
                className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition flex items-center gap-2"
              >
                <PlusCircle size={20} />
                Create Mind-Map
              </button>

              <span className="text-sm text-gray-500">
                No payment required
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-emerald-200 blur-3xl opacity-30 rounded-full"></div>
            <img
              src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff"
              alt="Mind Map Travel"
              className="relative rounded-2xl shadow-xl"
            />
          </motion.div>
        </section>

        {/* ---------------- HOW IT WORKS ---------------- */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How Mind-Map Trips Work
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: Brain,
                title: 'Think & Imagine',
                desc: 'Start with just an idea. No dates, no pressure.',
              },
              {
                icon: Map,
                title: 'Add Places',
                desc: 'Drag & connect places visually on your trip map.',
              },
              {
                icon: Route,
                title: 'Build the Flow',
                desc: 'Decide days, order, food, hotels, and experiences.',
              },
              {
                icon: Sparkles,
                title: 'Make it Real',
                desc: 'Convert your plan into bookings when ready.',
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md transition"
              >
                <step.icon className="text-emerald-600 mb-4" size={28} />
                <h3 className="font-semibold text-lg text-gray-800">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ---------------- USER PLANS ---------------- */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              My Mind-Map Trips
            </h2>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading your plans…</p>
          ) : myPlans.length === 0 ? (
            <div className="bg-white rounded-xl p-10 text-center border">
              <ImageIcon className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-600">
                You haven’t created any Mind-Map trips yet.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myPlans.map(plan => (
                <div
                  key={plan.id}
                  className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition cursor-pointer"
                  onClick={() => router.push(`/mind-maps/${plan.id}`)}
                >
                  {plan.coverImage && (
                    <img
                      src={plan.coverImage}
                      className="h-40 w-full object-cover"
                    />
                  )}

                  <div className="p-5 space-y-2">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {plan.title}
                    </h3>

                    <div className="flex gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={14} />
                        {plan.days} days
                      </span>
                      <span className="flex items-center gap-1">
                        <Map size={14} />
                        {plan.places} places
                      </span>
                    </div>

                    <span
                      className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${
                        plan.status === 'Draft'
                          ? 'bg-gray-100 text-gray-700'
                          : plan.status === 'Planned'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {plan.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
}
