"use client"
import {
  LogOut,
  Home,
  FlagTriangleRightIcon,
  Rss,
  PersonStanding,
  List,
  IndianRupee,
  Inbox,
  BarChart,
  Plane,
  User,
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
// import ChatWindow from '../shared/ChatWindow';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

function SideNavbar({ onClose }: { onClose?: () => void }) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const vendor = useSelector((state: RootState) => (state.auth as any).user); // Adjust based on your redux structure

  const navigate = (path: string) => {
    router.push(path);
    if (onClose) onClose();
  };

  const handleLogout = async () => {
    const res = await api.post('/agency/auth/logout');
    if (res.data.success) {
      toast.success('Log-out successfully');
      router.push('/agency/login');
    }
  };

  return (
    <>
      <div className="w-full h-full bg-white shadow-lg p-6 flex flex-col justify-between">
        <div className="flex flex-col space-y-4">
          <div
            onClick={() => navigate('/agency/profile')}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-md">
              <Plane className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Travel Truck
            </span>
          </div>
          <div className="space-y-2">
            <div className={`${pathname === '/agency' ? 'bg-emerald-100' : 'hover:bg-gray-200'} rounded`} onClick={() => navigate('/agency')}>
              <button
                className={`flex items-center space-x-2 p-2 ${pathname === '/agency' ? 'text-emerald-700 font-semibold' : 'text-gray-600'} rounded`}
              >
                <Home className="material-icons">home</Home>
                <span>Dashboard</span>
              </button>
            </div>
            <div className={`${pathname === '/agency/packages' ? 'bg-emerald-100' : 'hover:bg-gray-200'} rounded`}
              onClick={() => navigate('/agency/packages')}>
              <button className={`flex items-center space-x-2 p-2 ${pathname === '/agency/packages' ? 'text-emerald-700 font-semibold' : 'text-gray-600'} rounded`}>
                <FlagTriangleRightIcon />
                <span>Packages</span>
              </button>
            </div>
            <div className={`${pathname === '/agency/subscriptions' ? 'bg-emerald-100' : 'hover:bg-gray-200'} rounded`} onClick={() => navigate('/agency/subscriptions')}>
              <button className={`flex items-center space-x-2 p-2 ${pathname === '/agency/subscriptions' ? 'text-emerald-700 font-semibold' : 'text-gray-600'} rounded`}>
                <Rss className="material-icons">person</Rss>
                <span>Subscriptions</span>
              </button>
            </div>
            <div className={`${pathname === '/agency/orders' ? 'bg-emerald-100' : 'hover:bg-gray-200'} rounded`} onClick={() => navigate('/agency/orders')}>
              <button className={`flex items-center space-x-2 p-2 ${pathname === '/agency/orders' ? 'text-emerald-700 font-semibold' : 'text-gray-600'} rounded`}>
                <List className="material-icons">Order</List >
                <span>Orders</span>
              </button>
            </div>
            <div className={`${pathname === '/agency/reviews' ? 'bg-emerald-100' : 'hover:bg-gray-200'} rounded`} onClick={() => navigate('/agency/reviews')}>
              <button className={`flex items-center space-x-2 p-2 ${pathname === '/agency/reviews' ? 'text-emerald-700 font-semibold' : 'text-gray-600'} rounded`}>
                <List className="material-icons">Review</List >
                <span>Reviews</span>
              </button>
            </div>
            <div className={`${pathname === '/agency/wallet' ? 'bg-emerald-100' : 'hover:bg-gray-200'} rounded`} onClick={() => navigate('/agency/wallet')}>
              <button className={`flex items-center space-x-2 p-2 ${pathname === '/agency/wallet' ? 'text-emerald-700 font-semibold' : 'text-gray-600'} rounded`} >
                <IndianRupee className="material-icons">payment</IndianRupee>
                <span>Wallet</span>
              </button>
            </div>
            <div className='hover:bg-gray-200 rounded' onClick={() => setIsChatOpen(true)}>
              <button className="flex items-center space-x-2 p-2 text-gray-600 rounded">
                <Inbox className="material-icons">chat</Inbox>
                <span>Chat</span>
              </button>
            </div>
            <div className='hover:bg-gray-200 rounded'>
              <button className="flex items-center space-x-2 p-2 text-gray-600 rounded">
                <BarChart className="material-icons">bar_chart</BarChart>
                <span>Reports</span>
              </button>
            </div>
            <div className={`${pathname === '/agency/profile' ? 'bg-emerald-100' : 'hover:bg-gray-200'} rounded`}>
              <button className={`flex items-center space-x-2 p-2 ${pathname === '/agency/profile' ? 'text-emerald-700 font-semibold' : 'text-gray-600'} rounded`}
                onClick={() => navigate('/agency/profile')}>
                <User className="material-icons">person</User>
                <span>Profile</span>
              </button>
            </div>
            <div className='hover:bg-gray-200 rounded'>
              <button
                className="flex items-center space-x-2 p-2 text-gray-600 rounded"
                onClick={() => setShowModal(!showModal)}
              >
                <LogOut className="material-icons">LogOut</LogOut>
                <span>Logout</span>
              </button>
            </div>
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
      {/* {vendor && (
        <ChatWindow
          userId={vendor._id}
          receiverId="some-admin-or-user-id" // This needs to be dynamic based on who they chat with
          receiverName="Customer Support"
          receiverModel="User"
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      )} */}
    </>
  );
}

export default SideNavbar;
