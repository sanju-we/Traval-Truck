import {
  Home,
  Users,
  Utensils,
  IndianRupee,
  ShoppingBag,
  List,
  Ticket,
  BarChart3,
  Settings,
  LogOut,
  Plane,
  Building,
} from 'lucide-react';
import { ADMIN_API_METHODS } from '@/services/APIs/admin.api.service';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';

type SideNavbarProps = {
  active?: string;
};

export function SideNavbar({ active }: SideNavbarProps) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    const data = await ADMIN_API_METHODS.logout();
    if (data.success) {
      toast.success('Log-out successfully');
      router.push('/admin/login');
    }
  };

  const menuItems = [
    { label: 'Dashboard', icon: <Home className="w-5 h-5 mr-3" />, path: '/admin' },
    { label: 'Users', icon: <Users className="w-5 h-5 mr-3" />, path: '/admin/users' },
    { label: 'Agencies', icon: <Plane className="w-5 h-5 mr-3" />, path: '/admin/agencys' },
    { label: 'Hotels', icon: <Building className="w-5 h-5 mr-3" />, path: '/admin/hotels' },
    // { label: 'Restaurants', icon: <Utensils className="w-5 h-5 mr-3" />, path: '/admin/restaurants' },
    { label: 'Requests', icon: <List className="w-5 h-5 mr-3" />, path: '/admin/requestes' },
    { label: 'Subscriptions', icon: <IndianRupee className="w-5 h-5 mr-3" />, path: '/admin/subscription' },
    { label: 'Orders', icon: <ShoppingBag className="w-5 h-5 mr-3" />, path: '/admin/orders' },
    { label: 'Coupon', icon: <Ticket className="w-5 h-5 mr-3" />, path: '/admin/coupons' },
    { label: 'Wallet', icon: <BarChart3 className="w-5 h-5 mr-3" />, path: '/admin/wallet' },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white shadow-md min-h-screen">
      <div
        onClick={() => router.push('/admin')}
        className="flex items-center gap-3 px-5 py-4 border-b border-gray-800 cursor-pointer group"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-800 group-hover:bg-gray-700 transition">
          <Plane className="w-5 h-5 text-emerald-400" />
        </div>

        <div className="leading-tight">
          <h1 className="text-lg font-semibold text-white tracking-wide">
            Travel Truck
          </h1>
          <p className="text-xs text-gray-400">Admin Panel</p>
        </div>
      </div>
      <nav className="mt-6">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li
              key={item.label}
              className={`flex items-center p-3 rounded-md cursor-pointer transition-all duration-150 ${(item.path === '/admin' ? pathname === '/admin' : pathname?.startsWith(item.path))
                  ? 'bg-purple-600 text-white font-semibold shadow-md'
                  : 'hover:bg-gray-800 text-gray-300'
                }`}
              onClick={() => router.push(item.path)}
            >
              {item.icon}
              {item.label}
            </li>
          ))}

          {/* Logout button */}
          <li
            className="flex items-center p-3 hover:bg-red-800 hover:text-white text-gray-300 rounded-md cursor-pointer"
            onClick={() => setShowModal(!showModal)}
          >
            <LogOut className="w-5 h-5 mr-3" /> LogOut
          </li>

          {/* Logout confirmation modal */}
          <AnimatePresence>
            {showModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="bg-white rounded-2xl shadow-xl p-6 w-96 relative"
                >
                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-red-100 text-red-600 rounded-full">
                      <LogOut size={28} />
                    </div>
                  </div>

                  {/* Title + Message */}
                  <h2 className="text-xl font-semibold text-center mb-2">Confirm Logout</h2>
                  <p className="text-gray-600 text-center mb-6">
                    Are you sure you want to log out from your admin dashboard?
                  </p>

                  {/* Buttons */}
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-500 transition-transform duration-200 hover:scale-105 text-black"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-transform duration-200 hover:scale-105"
                    >
                      Yes, Logout
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </ul>
      </nav>
    </aside>
  );
}
