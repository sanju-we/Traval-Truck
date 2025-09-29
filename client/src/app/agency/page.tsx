'use client';

import React from 'react';
import SideNavbar from '@/components/agency/SideNavbar';
import { useEffect } from 'react';
import api from '@/services/api';

const Dashboard = () => {
  useEffect(() => {
    async function fetchData() {
      const res = await api.get('/agency/profile/dashboard');
    }
    fetchData();
  }, []);
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SideNavbar />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Welcome, Travel Agency 👋</h2>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600">Notifications</button>
            <button className="text-gray-600">Profile</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800">Ongoing Trips</h3>
            <p className="text-gray-600">12</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800">Upcoming Trips</h3>
            <p className="text-gray-600">8</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800">Past Trips</h3>
            <p className="text-gray-600">154</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800">Active Chats</h3>
            <p className="text-gray-600">3</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800">Trip Overview</h3>

          <div className="overflow-x-auto mt-4">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 px-4 text-sm font-semibold text-gray-700">Trip ID</th>
                  <th className="py-2 px-4 text-sm font-semibold text-gray-700">Destination</th>
                  <th className="py-2 px-4 text-sm font-semibold text-gray-700">Guest Name</th>
                  <th className="py-2 px-4 text-sm font-semibold text-gray-700">Partner Hotel</th>
                  <th className="py-2 px-4 text-sm font-semibold text-gray-700">Start Date</th>
                  <th className="py-2 px-4 text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-4">TRP123</td>
                  <td className="py-2 px-4">Paris</td>
                  <td className="py-2 px-4">Sophia Clark</td>
                  <td className="py-2 px-4">Hotel Royale</td>
                  <td className="py-2 px-4">2024-07-15</td>
                  <td className="py-2 px-4">In Transit</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">TRP124</td>
                  <td className="py-2 px-4">London</td>
                  <td className="py-2 px-4">Ethan Bennett</td>
                  <td className="py-2 px-4">The Grand Hotel</td>
                  <td className="py-2 px-4">2024-07-16</td>
                  <td className="py-2 px-4">Arrived</td>
                </tr>
                <tr>
                  <td className="py-2 px-4">TRP125</td>
                  <td className="py-2 px-4">Rome</td>
                  <td className="py-2 px-4">Olivia Carter</td>
                  <td className="py-2 px-4">Roma Palace</td>
                  <td className="py-2 px-4">2024-07-17</td>
                  <td className="py-2 px-4">In Transit</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Conversations */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800">Recent Conversations</h3>

          <div className="mt-4 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex-shrink-0">
                <img
                  className="h-10 w-10 rounded-full"
                  src="/images/profile.jpg"
                  alt="Liam Harper"
                />
              </div>
              <div>
                <p className="text-gray-800 font-semibold">Liam Harper</p>
                <p className="text-gray-600">Hi, just checking in on my flight details.</p>
                <p className="text-gray-400 text-xs">2h ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex-shrink-0">
                <img
                  className="h-10 w-10 rounded-full"
                  src="https://i.pravatar.cc/100?img=2"
                  alt="Ava Turner"
                />
              </div>
              <div>
                <p className="text-gray-800 font-semibold">Ava Turner</p>
                <p className="text-gray-600">Everything is confirmed for your stay.</p>
                <p className="text-gray-400 text-xs">4h ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex-shrink-0">
                <img
                  className="h-10 w-10 rounded-full"
                  src="https://i.pravatar.cc/100?img=3"
                  alt="Noah Foster"
                />
              </div>
              <div>
                <p className="text-gray-800 font-semibold">Noah Foster</p>
                <p className="text-gray-600">Can we reschedule our dinner reservation?</p>
                <p className="text-gray-400 text-xs">6h ago</p>
              </div>
            </div>
          </div>

          <button className="mt-4 text-blue-600">Go to Chat</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
