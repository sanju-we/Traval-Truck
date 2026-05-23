'use client'
import {
  LogOut,
  Home,
  FlagTriangleRightIcon,
  Hotel,
  IndianRupee,
  Inbox,
  User,
  Plane,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import api from '@/services/api';
import { useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const navItems = [
  { name: 'Dashboard', path: '/hotel', icon: Home },
  { name: 'Rooms', path: '/hotel/rooms', icon: Hotel },
  { name: 'Bookings / Trips', path: '/hotel/bookings', icon: FlagTriangleRightIcon },
  { name: 'Subscriptions', path: '/hotel/subscriptions', icon: IndianRupee },
  { name: 'Chat', path: '/hotel/chat', icon: Inbox, isChat: true },
  { name: 'Wallet', path: '/hotel/wallet', icon: IndianRupee },
  { name: 'Profile', path: '/hotel/profile', icon: User },
];

interface SideNavbarProps {
  onClose?: () => void;
}

function SideNavbar({ onClose }: SideNavbarProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const vendor = useSelector((state: RootState) => (state.auth as any).user);

  const handleLogout = async () => {
    try {
      const res = await api.post('/hotel/auth/logout');
      if (res.data.success) {
        toast.success('Logged out successfully');
        router.push('/hotel/login');
      }
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handleNavClick = (path: string) => {
    router.push(path);
    if (onClose) onClose();
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100 shadow-sm">
      {/* Logo Section */}
      <div className="p-6">
        <div
          onClick={() => handleNavClick('/hotel/profile')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-2.5 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-emerald-200">
            <Plane className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent tracking-tight">
            Travel Truck
          </span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className={`${isActive ? 'text-emerald-600' : 'text-gray-400 group-hover:text-emerald-500'} transition-colors`}>
                <Icon size={20} />
              </div>
              <span className="text-sm font-medium">{item.name}</span>
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout Footer */}
      <div className="p-4 mt-auto border-t border-gray-50">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Logout Admin</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative"
            >
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 flex items-center justify-center bg-red-100 text-red-600 rounded-full shadow-inner">
                  <LogOut size={32} />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Confirm Logout</h2>
              <p className="text-gray-500 text-center mb-8">
                Are you sure you want to log out from your hotel dashboard?
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 transition-all font-medium"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SideNavbar;
