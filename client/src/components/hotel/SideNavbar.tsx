import {
  LogOut,
  Home,
  FlagTriangleRightIcon,
  Hotel,
  PersonStanding,
  Paperclip,
  IndianRupee,
  Inbox,
  BarChart,
} from 'lucide-react';
import { useState } from 'react';
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

function SideNavbar() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const res = await api.post('/hotel/auth/logout');
    if (res.data.success) {
      toast.success('Log-out successfully');
      router.push('/hotel/login');
    }
  };

  return (
    <>
      <div className="w-64 bg-white shadow-lg p-6">
        <div className="flex flex-col space-y-4">
          <h1 className="text-2xl font-semibold text-gray-800">Travel Agency</h1>
          <div className="space-y-2">
            <button
              className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-200 rounded"
              onClick={() => router.push('/hotel')}
            >
              <Home className="material-icons">home</Home>
              <span>Dashboard</span>
            </button>
            <button className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-200 rounded">
              <FlagTriangleRightIcon />
              Bookings / Trips
            </button>
            <button className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-200 rounded">
              <Hotel className="material-icons">hotel</Hotel>
              <span>Partners</span>
            </button>
            <button className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-200 rounded">
              <PersonStanding className="material-icons">person</PersonStanding>
              <span>Guests</span>
            </button>
            <button className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-200 rounded">
              <IndianRupee className="material-icons">payment</IndianRupee>
              <span>Payments</span>
            </button>
            <button className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-200 rounded">
              <Inbox className="material-icons">chat</Inbox>
              <span>Chat</span>
            </button>
            <button className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-200 rounded">
              <BarChart className="material-icons">bar_chart</BarChart>
              <span>Reports</span>
            </button>
            <button
              className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-200 rounded"
              onClick={() => setShowModal(!showModal)}
            >
              <LogOut className="material-icons">LogOut</LogOut>
              <span>Logout</span>
            </button>
          </div>
        </div>
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
                    className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-transform duration-200 hover:scale-105"
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
      </div>
    </>
  );
}

export default SideNavbar;
