'use client';

import { useEffect, useState } from 'react';
import { Camera, Edit, Mail, Phone, MapPin } from 'lucide-react';
import SideNavbar from '@/components/hotel/SideNavbar';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface VendorProfile {
  id: string;
  ownerName: string;
  email: string;
  profilePicture?: string;
  phone?: string;
  companyName?: string;
  role?: string;
  isApproved: boolean;
  isBlocked: boolean;
  createdAt: string;
}

export default function VendorViewPage() {
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const route = useRouter();

  useEffect(() => {
    async function fetchVendor() {
      try {
        const { data } = await api.get('/hotel/profile/profile');

        if (!data.success) {
          toast.error(data.message);
          if (data.message === 'This user is Restricted by the admin') {
            route.push('/hotel');
          }
        }

        const result: VendorProfile = data.data;
        console.log(result);
        setVendor(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchVendor();
  }, [route]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold text-gray-600">
        Loading profile...
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-2">Ooops, something went wrong...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        <SideNavbar />
        <div className="flex-1 px-6 py-10">
          <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row items-center gap-6">
            {/* Profile Picture with Camera Icon */}
            <div className="relative w-[120px] h-[120px] flex-shrink-0">
              <Image
                src={vendor.profilePicture || '/images/profile.jpg'}
                alt="Vendor Profile"
                fill
                className="rounded-full object-cover border-4 border-emerald-500"
              />
              <button
                className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1.5 rounded-full hover:bg-emerald-600 transition"
                aria-label="Change Profile Picture"
              >
                <Camera size={16} />
              </button>
            </div>

            {/* Vendor Info */}
            <div className="flex-1">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Owner Name :</p>
                <h2 className="text-xl font-bold text-emerald-700">{vendor.ownerName}</h2>

                <p className="text-sm text-gray-500">Company Name :</p>
                <p className="text-base font-medium text-gray-700">{vendor.companyName || 'N/A'}</p>

                <p className="text-sm text-gray-500">Role :</p>
                <p className="text-base text-gray-600 italic">{vendor.role || 'N/A'}</p>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex gap-3">
                <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 flex items-center gap-2 text-sm">
                  <Edit size={16} /> Edit Profile
                </button>
                <button className="px-4 py-2 border border-emerald-500 text-emerald-500 rounded-lg hover:bg-emerald-50 text-sm">
                  Settings
                </button>
              </div>
            </div>
          </div>

          {/* Profile Overview */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg shadow-sm">
              <Mail className="text-emerald-500" size={20} />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800">{vendor.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg shadow-sm">
              <Phone className="text-emerald-500" size={20} />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-800">{vendor.phone || 'Not provided'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg shadow-sm">
              <MapPin className="text-emerald-500" size={20} />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium text-gray-800">
                  {vendor.companyName || 'No location provided'}
                </p>
              </div>
            </div>
          </div>

          {/* Status Overview */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800">Approval Status</h3>
              <p
                className={`text-sm font-semibold ${vendor.isApproved ? 'text-green-600' : 'text-red-600'}`}
              >
                {vendor.isApproved ? 'Approved' : 'Pending Approval'}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800">Account Status</h3>
              <p
                className={`text-sm font-semibold ${vendor.isBlocked ? 'text-red-600' : 'text-green-600'}`}
              >
                {vendor.isBlocked ? 'Blocked' : 'Active'}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800">Joined</h3>
              <p className="text-sm text-gray-600">
                {new Date(vendor.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Recent Conversations */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800">Recent Conversations</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src="https://i.pravatar.cc/100?img=1"
                    alt="Liam Harper"
                  />
                </div>
                <div>
                  <p className="text-gray-800 font-semibold">Liam Harper</p>
                  <p className="text-gray-600">Hi, just checking in on my flight details.</p>
                  <p className="text-gray-400 text-xs">2h ago</p>
                </div>
              </div>
              {/* Repeat for other conversations */}
            </div>
            <button className="mt-4 text-blue-600">Go to Chat</button>
          </div>
        </div>
      </div>
    </>
  );
}
