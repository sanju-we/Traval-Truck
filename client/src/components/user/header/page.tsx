'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/services/api';
import { useRouter } from 'next/navigation';

export function Header() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); 
  const [user, setUser] = useState<{ profilePicture?: string } | null>(null);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifyRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Handle logout
  async function handleLogout() {
    try {
      const res = await api.post('/user/auth/logout');
      const data = res.data;
      if (!data.success) throw new Error('Logout failed');
      toast.success('Logout successfully');
      router.push('/login');
    } catch (error) {
      console.error(error);
      toast.error('❌ Failed to logout. Try again!');
    }
  }

  // Detect outside clicks and fetch user
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (notifyRef.current && !notifyRef.current.contains(event.target as Node)) {
        setNotifyOpen(false);
      }
    };

    const fetchUser = async () => {
      try {
        const { data } = await api.get('/user/profile/profile');
        if (data.success) {
          setUser(data.data);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    fetchUser();
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="flex justify-between items-center px-8 py-4 shadow-sm bg-white">
        <h1 className="text-xl font-bold text-emerald-600" onClick={() => router.push('/')}>
          Travel Truck
        </h1>

        {/* Navigation */}
        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-700">
          <a href="/user/home" className="hover:text-emerald-600">
            Home
          </a>
          <a href="/user/package" className="hover:text-emerald-600">
            Packages
          </a>
          <a href="/user/hotel" className="hover:text-emerald-600">
            Hotels
          </a>
          <a href="/user/description" className="hover:text-emerald-600">
            Destinations
          </a>
          <a href="/user/trips" className="hover:text-emerald-600">
            Tips
          </a>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition">
            Get Started
          </button>

          {/* Notification Bell */}
          <div className="relative" ref={notifyRef}>
            <button
              onClick={() => setNotifyOpen(!notifyOpen)}
              className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              <Bell className="w-6 h-6 text-gray-700" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {notifyOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg py-2 z-50">
                <p className="px-4 py-2 text-sm font-semibold text-gray-700">Notifications</p>
                <hr />
                <div className="max-h-60 overflow-y-auto">
                  <p
                    onClick={() => toast.success('✈️ Goa trip confirmed!')}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
                  >
                    ✈️ Your Goa trip is confirmed!
                  </p>
                  <p
                    onClick={() => toast.success('🏨 Bali hotel booked!')}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
                  >
                    🏨 Hotel booking in Bali successful.
                  </p>
                  <p
                    onClick={() => toast('🎉 New offers available')}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
                  >
                    🎉 New package offers available.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden border-2 border-emerald-500"
            >
              <img
                src={user?.profilePicture || '/images/profile.jpg'}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 z-50">
                <a
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </a>
                <a
                  href="/user/details"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Personal Details
                </a>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  onClick={() => setShowLogoutModal(true)} // open modal instead of logout directly
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-96 relative">
            <h2 className="text-xl font-semibold text-center mb-2">Confirm Logout</h2>
            <p className="text-gray-600 text-center mb-6">Are you sure you want to log out?</p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-500 transition-transform duration-200 hover:scale-105 text-black"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  handleLogout();
                }}
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-transform duration-200 hover:scale-105"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
