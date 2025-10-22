'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import api from '@/services/api';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { SideNavbar } from '@/components/admin/SideNavbar';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, CheckCircle } from 'lucide-react';

export default function UserDetailsPage() {
  const user = useSelector((state: RootState) => state.details.selectedUser);
  const [loading, setLoading] = useState(false);
  const [isBlocked, setIsBlocked] = useState(user?.isBlocked);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  if (!user) {
    return (
      <p className="p-6 text-center text-gray-500">
        No user data found. Please go back and try again.
      </p>
    );
  }

  const handleToggleBlock = async () => {
    try {
      setLoading(true);
      const { data } = await api.patch(`/admin/vendor/block-toggle/${user.id}/${user.role}`);

      if (data.success) {
        setIsBlocked(!isBlocked);
        toast.success(!isBlocked ? 'User blocked successfully' : 'User unblocked successfully');
      }
    } catch (error) {
      console.error('Error toggling block:', error);
      toast.error('Something went wrong. Try again!');
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
    }
  };

  const actionText = isBlocked ? 'unblock' : 'block';

  return (
    <div className="flex">
      {/* Sidebar */}
      <SideNavbar active="Users" />

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto mt-12 relative">
        <Card className="shadow-lg rounded-2xl border border-gray-200">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">
              {user.role === 'vendor' ? 'Vendor Details' : 'User Details'}
            </CardTitle>

            <div className="flex items-center gap-3">
              <Button
                variant={isBlocked ? 'default' : 'secondary'}
                onClick={() => setShowConfirmModal(true)}
                disabled={loading}
              >
                {loading ? 'Processing...' : isBlocked ? 'Unblock User' : 'Block User'}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
            {/* Profile */}
            <div className="flex flex-col items-center md:col-span-2 mb-4">
              <Image
                src={
                  user.profilePicture
                    ? user.profilePicture
                    : user.logo
                    ? user.logo
                    : '/images/profile.jpg'
                }
                alt="Profile Picture"
                width={120}
                height={120}
                className="rounded-full border shadow-md object-cover"
              />
              <p className="mt-2 text-sm font-medium">{user.userName || 'Unknown User'}</p>
            </div>

            <div>
              <p className="font-medium">Username</p>
              <p className="text-sm text-gray-500">{user.userName || 'Not provided'}</p>
            </div>

            {user.role === 'user' && (
              <div>
                <p className="font-medium">Name</p>
                <p className="text-sm text-gray-500">{user.name}</p>
              </div>
            )}

            {user.role === 'vendor' && (
              <>
                <div>
                  <p className="font-medium">Owner Name</p>
                  <p className="text-sm text-gray-500">{user.ownerName}</p>
                </div>
                <div>
                  <p className="font-medium">Company Name</p>
                  <p className="text-sm text-gray-500">{user.companyName}</p>
                </div>
                <div>
                  <p className="font-medium">Approved</p>
                  <p
                    className={`text-sm font-semibold ${
                      user.isApproved ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {user.isApproved ? '✅ Yes' : '❌ No'}
                  </p>
                </div>
              </>
            )}

            <div>
              <p className="font-medium">Email</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            <div>
              <p className="font-medium">Phone</p>
              <p className="text-sm text-gray-500">{user.phone || 'Not provided'}</p>
            </div>

            <div>
              <p className="font-medium">Role</p>
              <p className="text-sm capitalize">{user.role}</p>
            </div>

            <div>
              <p className="font-medium">Status</p>
              <p
                className={`text-sm font-semibold ${isBlocked ? 'text-red-600' : 'text-green-600'}`}
              >
                {isBlocked ? 'Blocked' : 'Active'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirmModal && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md text-center"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
              >
                <h2 className="text-lg font-semibold mb-2">
                  Confirm {actionText.charAt(0).toUpperCase() + actionText.slice(1)}
                </h2>
                <p className="text-gray-600 mb-6 text-sm">
                  Are you sure you want to {actionText} this {user.role}? This action can be
                  reversed later if needed.
                </p>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleToggleBlock}
                    className={`px-4 py-2 rounded-md text-white flex items-center gap-1 transition ${
                      isBlocked
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    <CheckCircle size={16} /> {actionText === 'block' ? 'Block' : 'Unblock'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
