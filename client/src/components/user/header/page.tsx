'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, Menu, X, User, Wallet, LogOut, Plane, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/services/api';
import { useRouter } from 'next/navigation';

export function Header() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ profilePicture?: string; name?: string } | null>(null);
  const [notifications] = useState([
    { id: 1, icon: '✈️', message: 'Your Goa trip is confirmed!', time: '2h ago', unread: true },
    { id: 2, icon: '🏨', message: 'Hotel booking in Bali successful.', time: '5h ago', unread: true },
    { id: 3, icon: '🎉', message: 'New package offers available.', time: '1d ago', unread: false },
  ]);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifyRef = useRef<HTMLDivElement>(null);

  // Mock router - replace with actual useRouter from next/navigation
  const router = useRouter()

  // Mock API - replace with actual api import
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

  async function handleLogout() {
    try {
      const res = await api.post('/user/auth/logout');
      const data = res.data;
      if (!data.success) throw new Error('Logout failed');
      toast.success('Logged out successfully');
      console.log('logged out')
      router.push('/login');
    } catch (error) {
      console.error(error);
      toast.error('Failed to logout. Try again!');
    }
  }

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <div 
              onClick={() => router.push('/')} 
              className="flex items-center space-x-2 cursor-pointer group"
            >
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-md">
                <Plane className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Travel Truck
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {[
                { name: 'Home', path: '/' },
                { name: 'Packages', path: '/package' },
                { name: 'Hotels', path: '/hotels' },
                { name: 'Destinations', path: '/description' },
                { name: 'Mind-Map', path: '/mind-map' },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200"
                >
                  {item.name}
                </a>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Get Started Button */}
              <button
                onClick={() => router.push('/explore')}
                className="hidden sm:flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg font-medium text-sm"
              >
                <span>Get Started</span>
              </button>

              {/* Notifications */}
              <div className="relative" ref={notifyRef}>
                <button
                  onClick={() => setNotifyOpen(!notifyOpen)}
                  className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifyOpen && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold text-base">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="px-4 py-8 text-center text-gray-500 text-sm">No notifications</p>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => toast.success(notif.message)}
                            className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0 ${
                              notif.unread ? 'bg-emerald-50/30' : ''
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <span className="text-2xl">{notif.icon}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-800 font-medium">{notif.message}</p>
                                <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                              </div>
                              {notif.unread && (
                                <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="px-4 py-2 bg-gray-50 border-t">
                      <button className="text-emerald-600 text-sm font-medium hover:text-emerald-700 w-full text-center">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-2 hover:bg-gray-100 rounded-full p-1 pr-3 transition-colors"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 overflow-hidden border-2 border-white shadow-md">
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white font-bold">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500">
                      <p className="text-white font-semibold text-sm">{user?.name || 'User'}</p>
                      <p className="text-emerald-100 text-xs">Manage your account</p>
                    </div>
                    <div className="py-2">
                      <a
                        href="/profile"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User className="w-4 h-4 text-gray-500" />
                        <span>My Profile</span>
                      </a>
                      <a
                        href="/wallet"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Wallet className="w-4 h-4 text-gray-500" />
                        <span>Wallet</span>
                      </a>
                      <hr className="my-2" />
                      <button
                        onClick={() => setShowLogoutModal(true)}
                        className="flex items-center space-x-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white animate-in slide-in-from-top duration-200">
            <nav className="px-4 py-4 space-y-2">
              {[
                { name: 'Home', path: '/' },
                { name: 'Packages', path: '/package' },
                { name: 'Hotels', path: '/hotels' },
                { name: 'Destinations', path: '/description' },
                { name: 'Tips', path: '/trips' },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <button
                onClick={() => {
                  router.push('/explore');
                  setMobileMenuOpen(false);
                }}
                className="w-full mt-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all font-medium text-sm"
              >
                Get Started
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md relative animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-2 text-gray-900">
              Confirm Logout
            </h2>
            <p className="text-gray-600 text-center mb-6 sm:mb-8 text-sm sm:text-base">
              Are you sure you want to log out of your account?
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 hover:bg-gray-50 transition-all duration-200 font-semibold text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  handleLogout();
                }}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
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