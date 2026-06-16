'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Button } from '@/components/shared/ui/button';
import { Card, CardContent } from '@/components/shared/ui/card';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, MapPin, Building2, UserCircle, Briefcase, Mail, Phone, Calendar, ArrowLeft, ShieldAlert } from 'lucide-react';
import { ADMIN_API_METHODS } from '@/services/APIs/admin.api.service';
import { ApiResponse } from '@/services/api.service';
import { useRouter } from 'next/navigation';

export default function UserDetailsPage() {
  const user = useSelector((state: RootState) => state.details.selectedUser);
  const [loading, setLoading] = useState(false);
  const [isBlocked, setIsBlocked] = useState(user?.isBlocked);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setIsBlocked(user.isBlocked);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
          <UserCircle className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">No Profile Data Found</h2>
        <p className="text-gray-500 mb-6">The requested profile information could not be loaded.</p>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  const handleToggleBlock = async () => {
    try {
      setLoading(true);
      const data = (await ADMIN_API_METHODS.blockUser(user.id, user.role)) as ApiResponse | null;

      if (data && data.success) {
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
  const isVendor = ['agency', 'hotel', 'restaurant'].includes(user.role);
  const profileImage = (user?.profilePicture || user?.logo || '/images/profile.jpg') as string;
  const primaryName = (isVendor ? user.companyName : (user.name || user.userName)) || 'Unknown';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 max-w-5xl mx-auto p-4 md:p-8 mt-6 relative"
    >
      <button 
        onClick={() => router.back()} 
        className="flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
        Back to list
      </button>

      {/* Header Profile Section */}
      <div className="relative rounded-3xl bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
        <div className="px-6 sm:px-10 pb-8 flex flex-col sm:flex-row items-start sm:items-end -mt-12 gap-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-2xl bg-white p-1.5 shadow-lg">
              <div className="w-full h-full relative rounded-xl overflow-hidden bg-gray-50">
                <Image
                  src={profileImage}
                  alt={primaryName}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-xs font-bold border-2 border-white shadow-sm ${isBlocked ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
              {isBlocked ? 'Blocked' : 'Active'}
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{primaryName}</h1>
                <p className="text-gray-500 flex items-center gap-2 mt-1 capitalize font-medium">
                  {isVendor ? <Building2 className="w-4 h-4" /> : <UserCircle className="w-4 h-4" />}
                  {user.role} Account
                </p>
              </div>
              
              <Button
                variant={isBlocked ? 'outline' : 'danger'}
                onClick={() => setShowConfirmModal(true)}
                disabled={loading}
                className={`rounded-xl px-6 transition-all ${isBlocked ? 'border-gray-300 text-gray-700 hover:bg-gray-50' : 'shadow-md shadow-red-500/20'}`}
              >
                {loading ? (
                  <span className="flex items-center gap-2"><span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin"></span> Processing</span>
                ) : isBlocked ? (
                  <span className="flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Unblock {isVendor ? 'Vendor' : 'User'}</span>
                ) : (
                  <span className="flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Block {isVendor ? 'Vendor' : 'User'}</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Quick Contact Info */}
        <div className="space-y-8 lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-500" />
              Contact Information
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Email Address</p>
                  <p className="text-sm font-medium text-gray-800 break-all">{user.email || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Phone Number</p>
                  <p className="text-sm font-medium text-gray-800">{user.phoneNumber || user.phone || 'Not provided'}</p>
                </div>
              </div>

              {(user.createdOn || user.createdAt) && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
                    <Calendar className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Joined On</p>
                    <p className="text-sm font-medium text-gray-800">
                      {new Date(user.createdOn || user.createdAt || Date.now()).toLocaleDateString('en-US', {
                        month: 'long', day: 'numeric', year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Specific bio/interests */}
          {!isVendor && (user.bio || (user.interest && user.interest.length > 0)) && (
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
              {user.bio && (
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{user.bio}</p>
              )}
              {user.interest && user.interest.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Interests</p>
                  <div className="flex flex-wrap gap-2">
                    {user.interest.map((int: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">
                        {int}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Detailed Sections */}
        <div className="space-y-8 lg:col-span-2">
          
          {/* Vendor Specific Details */}
          {isVendor && (
            <>
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-500" />
                  Business Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Company Name</p>
                    <p className="text-sm font-medium text-gray-900">{user.companyName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Owner Name</p>
                    <p className="text-sm font-medium text-gray-900">{user.ownerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Verification Status</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      {user.isApproved ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                          <CheckCircle className="w-3 h-3" /> Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                          <ShieldAlert className="w-3 h-3" /> Pending Approval
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {user.address && (
                    <div className="md:col-span-2 mt-2">
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Location</p>
                      <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl">
                        <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {user.address.address}<br />
                          {user.address.city}, {user.address.state} - {user.address.pin}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {user.bankDetails && (
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <h3 className="text-lg font-semibold text-gray-900 mb-5">Bank Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Bank Name</p>
                      <p className="text-sm font-medium text-gray-900">{user.bankDetails.bankName || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Account Holder</p>
                      <p className="text-sm font-medium text-gray-900">{user.bankDetails.accountHolder || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Account Number</p>
                      <p className="text-sm font-medium text-gray-900 font-mono">{user.bankDetails.accountNumber || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">IFSC Code</p>
                      <p className="text-sm font-medium text-gray-900 font-mono">{user.bankDetails.ifscCode || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* User specific additional data fallback */}
          {!isVendor && (
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h3 className="text-lg font-semibold text-gray-900 mb-5">Account Specifics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Username</p>
                  <p className="text-sm font-medium text-gray-900">{user.userName || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Gender</p>
                  <p className="text-sm font-medium text-gray-900 capitalize">{user.gender || 'Not specified'}</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm z-[100] px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center relative overflow-hidden"
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-5 ${isBlocked ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                <ShieldAlert className="w-8 h-8" />
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {actionText.charAt(0).toUpperCase() + actionText.slice(1)} {isVendor ? 'Vendor' : 'User'}?
              </h2>
              <p className="text-gray-500 mb-8 text-sm">
                Are you sure you want to {actionText} <strong>{primaryName}</strong>? This action can be
                reversed later if needed.
              </p>

              <div className="flex justify-center gap-3 w-full">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleToggleBlock}
                  variant={isBlocked ? 'default' : 'danger'}
                  className={`flex-1 rounded-xl ${isBlocked ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}`}
                >
                  Confirm {actionText}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
