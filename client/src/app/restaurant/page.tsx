'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Utensils, Users, IndianRupee, ShoppingCart } from 'lucide-react';
import { useEffect } from 'react';
import api from '@/services/api';

export default function RestaurantDashboard() {
  useEffect(() => {
    async function fetchData() {
      const res = await api.get('/restaurant/profile/dashboard');
    }
    fetchData();
  }, []);
  const data = [
    { name: 'Mon', orders: 45 },
    { name: 'Tue', orders: 60 },
    { name: 'Wed', orders: 72 },
    { name: 'Thu', orders: 52 },
    { name: 'Fri', orders: 95 },
    { name: 'Sat', orders: 120 },
    { name: 'Sun', orders: 88 },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Restaurant Dashboard</h1>
        <Button>+ Add New Dish</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">532</p>
            <p className="text-xs text-gray-500">+12% from last week</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <IndianRupee className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₹1,25,000</p>
            <p className="text-xs text-gray-500">+8% this month</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">248</p>
            <p className="text-xs text-gray-500">+5% from last month</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Dishes Available</CardTitle>
            <Utensils className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">68</p>
            <p className="text-xs text-gray-500">Updated daily</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Trend Chart */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Weekly Orders Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={3} />
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
