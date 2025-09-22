"use client";

import { Home, Users, Utensils, DollarSign,   BarChart3,  Building2Icon } from "lucide-react";
import { SideNavbar } from "@/components/admin/SideNavbar";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SideNavbar />

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Topbar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search"
              className="border rounded-lg px-3 py-1"
            />
            <img
              src="/images/profile.png"
              alt="Profile"
              className="w-10 h-10 rounded-full border"
            />
          </div>
        </div>

        <p className="text-gray-600 mb-6">
          Overview of all activities, sales, and system metrics.
        </p>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500">Total Active Hotels</p>
            <h2 className="text-2xl font-bold">1,234</h2>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500">Total Active Agencies</p>
            <h2 className="text-2xl font-bold">567</h2>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500">Total Active Restaurants</p>
            <h2 className="text-2xl font-bold">890</h2>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500">Total Active Users</p>
            <h2 className="text-2xl font-bold">4,567</h2>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500">Total Sales this month</p>
            <h2 className="text-2xl font-bold">₹123,456</h2>
          </div>
        </div>

        {/* Earnings */}
        <div className="bg-gray-100 p-6 rounded-lg mb-6">
          <p className="text-gray-500">Admin Earnings</p>
          <h2 className="text-2xl font-bold">₹12,345</h2>
        </div>

        {/* Quick Access */}
        <h2 className="text-xl font-bold mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <button className="flex items-center justify-center gap-2 bg-white p-4 rounded-lg shadow hover:bg-gray-100">
            <Home className="w-5 h-5" /> Manage Hotels
          </button>
          <button className="flex items-center justify-center gap-2 bg-white p-4 rounded-lg shadow hover:bg-gray-100">
            <Building2Icon className="w-5 h-5" /> Manage Agencies
          </button>
          <button className="flex items-center justify-center gap-2 bg-white p-4 rounded-lg shadow hover:bg-gray-100">
            <Utensils className="w-5 h-5" /> Manage Restaurants
          </button>
          <button className="flex items-center justify-center gap-2 bg-white p-4 rounded-lg shadow hover:bg-gray-100">
            <DollarSign className="w-5 h-5" /> Manage Subscriptions
          </button>
          <button className="flex items-center justify-center gap-2 bg-white p-4 rounded-lg shadow hover:bg-gray-100">
            <BarChart3 className="w-5 h-5" /> Sales Reports
          </button>
          <button className="flex items-center justify-center gap-2 bg-white p-4 rounded-lg shadow hover:bg-gray-100">
            <Users className="w-5 h-5" /> Manage Users
          </button>
        </div>
      </main>
    </div>
  );
}
