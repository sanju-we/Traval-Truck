'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import toast from 'react-hot-toast';
import SideNavbar from '@/components/hotel/SideNavbar';

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

const revenueData = [
  { day: 'Aug 12', revenue: 6000 },
  { day: 'Aug 13', revenue: 8200 },
  { day: 'Aug 14', revenue: 7200 },
  { day: 'Aug 15', revenue: 5000 },
  { day: 'Aug 16', revenue: 6100 },
  { day: 'Aug 17', revenue: 7900 },
  { day: 'Aug 18', revenue: 6500 },
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md sticky top-0 h-screen p-6">
        <SideNavbar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">
          Namaskaram, Kumarakom Lakeview Hotel{' '}
          <span role="img" aria-label="waving hand">
            👋
          </span>
        </h1>
        <p className="text-gray-600 mb-8">
          Here&apos;s a summary of today&apos;s bookings and operations.
        </p>

        {/* Booking Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {bookingStats.map((stat, idx) => (
            <Card key={idx} className="p-5 hover:shadow-lg transition-shadow rounded-lg">
              <CardContent>
                <h2 className="text-sm text-gray-500">{stat.label}</h2>
                <p className="text-2xl font-semibold mt-2 text-gray-900">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Bookings */}
        <Card className="mb-10 rounded-lg shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Recent Bookings</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3">Guest Name</th>
                    <th className="p-3">Room Type</th>
                    <th className="p-3">Check-in</th>
                    <th className="p-3">Check-out</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3">{booking.guest}</td>
                      <td className="p-3">{booking.type}</td>
                      <td className="p-3">{booking.in}</td>
                      <td className="p-3">{booking.out}</td>
                      <td className="p-3">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'Checked-In'
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'Upcoming'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-300 text-gray-700'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-3 font-semibold">{booking.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Room Occupancy */}
        <Card className="mb-10 rounded-lg shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">Room Occupancy</h2>
            <div className="flex gap-8 justify-center">
              {occupancyData.map((room, idx) => (
                <div key={idx} className="text-center">
                  <div className="h-28 w-14 bg-blue-200 rounded-md mx-auto flex items-end">
                    <div
                      className="bg-blue-600 w-full rounded-md transition-all duration-500"
                      style={{ height: `${room.value}%` }}
                    />
                  </div>
                  <p className="mt-3 text-sm font-medium text-gray-700">{room.category}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Trends */}
        <Card className="rounded-lg shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-900">Revenue Trends</h2>
            {/* You can add a chart here later */}
            <p className="text-gray-600 italic">Revenue chart coming soon...</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
