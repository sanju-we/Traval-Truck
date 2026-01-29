'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter()
  return (
    <main className="bg-gradient-to-br from-blue-50 via-white to-emerald-50 overflow-hidden">

      {/* HERO */}
      <section className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl text-center"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Plan Trips.
            <span className="block text-emerald-600">Not Just Routes.</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Travel Truck is an AI-powered travel planning platform that turns
            your ideas into optimized trip mind-maps with routes, budgets,
            and real-world insights.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <a className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition">
              Get Started Free
            </a>
            <a className="px-8 py-4 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition">
              See How It Works
            </a>
          </div>
        </motion.div>
      </section>

      {/* WHAT IS TRAVEL TRUCK */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-800"
          >
            What is Travel Truck?
          </motion.h2>

          <p className="mt-6 text-gray-600 max-w-3xl mx-auto">
            Travel Truck helps travelers and agencies design trips visually.
            Instead of scattered notes and maps, you get a single intelligent
            system that handles planning, routing, budgeting, and collaboration.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow border border-gray-100 hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {f.title}
              </h3>
              <p className="text-gray-600 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-gradient-to-r from-blue-50 to-emerald-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">
            How Travel Truck Works
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow border border-gray-100"
              >
                <div className="w-10 h-10 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                  {i + 1}
                </div>
                <p className="mt-4 font-medium text-gray-700">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT’S FOR */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10">
          <InfoBlock
            title="For Travelers"
            points={[
              'Create trip mind-maps',
              'Optimized routes with real roads',
              'Budget & wallet tracking',
              'Save trips as drafts or confirm',
            ]}
          />
          <InfoBlock
            title="For Agencies & Vendors"
            points={[
              'Manage client itineraries',
              'Chat with users in real-time',
              'Vendor dashboards & wallets',
              'Centralized trip planning',
            ]}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gray-900 text-white text-center">
        <h2 className="text-4xl font-bold">
          Smarter trips start with better planning
        </h2>
        <p className="mt-4 text-gray-300">
          Build your next journey with Travel Truck.
        </p>
        <a className="inline-block mt-8 px-10 py-4 bg-emerald-600 rounded-xl font-semibold hover:bg-emerald-700 transition" onClick={()=> router.push('/mindMap')}>
          Start Planning Now
        </a>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-gray-500 text-sm bg-black">
        © {new Date().getFullYear()} Travel Truck. All rights reserved.
      </footer>
    </main>
  );
}

/* ------------------ DATA ------------------ */

const features = [
  {
    title: 'AI Trip Mind-Maps',
    desc: 'Generate complete travel plans with routes, insights, and structure.',
  },
  {
    title: 'Real Road Routing',
    desc: 'Google Maps powered shortest and optimized routes.',
  },
  {
    title: 'Draft & Confirm Trips',
    desc: 'Create drafts, review, edit, and confirm when ready.',
  },
  {
    title: 'Wallet & Expenses',
    desc: 'Track budgets, shared wallets, and transactions.',
  },
  {
    title: 'Chat System',
    desc: 'User ↔ Agency ↔ Vendor real-time communication.',
  },
  {
    title: 'Vendor Management',
    desc: 'Hotels, restaurants, agencies in one ecosystem.',
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
  points,
}: {
  title: string;
  points: string[];
}) {
  return (
    <div className="bg-gray-50 p-8 rounded-2xl shadow border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
      <ul className="space-y-2 text-gray-600">
        {points.map((p, i) => (
          <li key={i}>• {p}</li>
        ))}
      </ul>
    </div>
  );
}
