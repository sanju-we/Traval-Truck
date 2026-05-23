'use client';

import { Card, CardContent } from '@/components/shared/ui/card';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const bookingStats = [
  { label: "Today's Bookings", value: 14 },
  { label: 'Checked-in Guests', value: 23 },
  { label: 'Available Rooms', value: 12 },
  { label: "Today's Revenue", value: '₹8,200' },
];

const recentBookings = [
  {
    guest: 'Anjali R.',
    type: 'Deluxe A/C',
    in: 'Aug 17',
    out: 'Aug 19',
    status: 'Checked-In',
    amount: '₹5,400',
  },
  {
    guest: 'Arjun K.',
    type: 'Standard',
    in: 'Aug 18',
    out: 'Aug 20',
    status: 'Upcoming',
    amount: '₹3,200',
  },
  {
    guest: 'Priya S.',
    type: 'Suite',
    in: 'Aug 16',
    out: 'Aug 19',
    status: 'Checked-Out',
    amount: '₹7,800',
  },
  {
    guest: 'Vikram M.',
    type: 'Deluxe A/C',
    in: 'Aug 19',
    out: 'Aug 21',
    status: 'Upcoming',
    amount: '₹5,400',
  },
  {
    guest: 'Deepa N.',
    type: 'Standard',
    in: 'Aug 17',
    out: 'Aug 19',
    status: 'Checked-In',
    amount: '₹3,200',
  },
];

const occupancyData = [
  { category: 'Deluxe', value: 45 },
  { category: 'Standard', value: 30 },
  { category: 'Suite', value: 25 },
];

export default function HotelDashboard() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get('/hotel/auth/dashboard');
        if (!res.data.success) {
          toast.error(res.data.message);
        }
      } catch (err) {
        console.error('Failed to fetch vendor requests:', err);
      }
    };
    fetchRequests();
  }, []);

  return (
    <>
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Namaskaram, Kumarakom Lakeview Hotel{' '}
          <span className="inline-block animate-bounce ml-1">👋</span>
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          Here&apos;s a snapshot of your hotel&apos;s performance today.
        </p>
      </header>

      {/* Booking Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {bookingStats.map((stat, idx) => (
          <Card key={idx} className="border-none shadow-sm bg-white hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-400 group-hover:text-emerald-500 transition-colors uppercase tracking-wider">{stat.label}</span>
                <span className="text-3xl font-bold mt-2 text-gray-900">{stat.value}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings - Left Column (Larger) */}
        <div className="lg:col-span-2">
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden min-h-full">
            <CardContent className="p-0">
              <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
                <button className="text-emerald-600 font-semibold text-sm hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 text-gray-400 font-medium text-xs uppercase tracking-wider">
                      <th className="px-6 py-4">Guest</th>
                      <th className="px-6 py-4">Room</th>
                      <th className="px-6 py-4">Dates</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentBookings.map((booking, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-800">{booking.guest}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">{booking.type}</td>
                        <td className="px-6 py-4 text-gray-500 text-sm">
                          {booking.in} - {booking.out}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                              booking.status === 'Checked-In'
                                ? 'bg-emerald-100 text-emerald-700'
                                : booking.status === 'Upcoming'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-gray-900">{booking.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Cards - Right Column */}
        <div className="space-y-8">
          {/* Room Occupancy */}
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-8">Room Occupancy</h2>
              <div className="flex gap-6 justify-center items-end h-40">
                {occupancyData.map((room, idx) => (
                  <div key={idx} className="flex flex-col items-center flex-1">
                    <div className="w-full bg-emerald-50 rounded-lg relative overflow-hidden flex items-end h-32">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${room.value}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="bg-gradient-to-t from-emerald-500 to-teal-400 w-full rounded-lg"
                      />
                    </div>
                    <p className="mt-3 text-xs font-bold text-gray-500 uppercase tracking-tighter">{room.category}</p>
                    <p className="text-sm font-bold text-gray-900">{room.value}%</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Revenue Trends */}
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Revenue Trends</h2>
              <p className="text-gray-400 text-sm mb-6">Last 7 days revenue analysis</p>
              <div className="h-32 flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-400 text-xs italic font-medium">Chart visualization loading...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

