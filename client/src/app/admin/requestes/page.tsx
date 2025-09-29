'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { CheckCircle, XCircle } from 'lucide-react';
import { SideNavbar } from '@/components/admin/SideNavbar';
import { vendorRequestDTO } from '../../../../../server/src/core/DTO/admin/vendor.response.dto/vendor.response.dto';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function VendorRequestsPage() {
  const [requests, setRequests] = useState<vendorRequestDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<vendorRequestDTO | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  // Fetch requests from API
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get('/admin/vendor/allRequests');
        setRequests(res.data.data);
      } catch (err) {
        console.error('Failed to fetch vendor requests:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject', role: string) => {
    try {
      const res = await api.patch(`/admin/vendor/${id}/${action}/${role}`);
      if (res.data.success) {
        toast.success('Updated successfully');
        const res = await api.get('/admin/vendor/allRequests');
        setRequests(res.data.data);
        return;
        // setRequests((prev) =>
        //   prev.map((r) =>
        //     r.id === id ? { ...r, isApproved: action === 'approve' ? true : false } : r,
        //   ),
        // );
      }
      toast.error(`${res.data.message}`);
      console.log(res.data);
    } catch (err) {
      console.error(`Failed to ${action} vendor:`, err);
    }
  };

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-64">
        <SideNavbar active="Requests" />
      </div>
      {loading ? (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-sm text-gray-600">Loading Requests...</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 p-4 md:p-8 bg-gray-50">
          <h1 className="text-2xl font-bold mb-6">Vendor Requests</h1>
          {requests.length === 0 ? (
            <p className="text-gray-500">No vendor requests found.</p>
          ) : (
            <div className="overflow-x-auto bg-white shadow rounded-lg">
              <table className="w-full border-collapse min-w-[600px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                      Vendor Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                      Company
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 whitespace-nowrap">
                      Role
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req.id} className="border-t">
                      <td className="px-4 py-3 text-sm">{req.ownerName}</td>
                      <td className="px-4 py-3 text-sm">{req.email}</td>
                      <td className="px-4 py-3 text-sm">{req.companyName}</td>
                      <td className="px-4 py-3 text-center text-sm">{req.role}</td>
                      <td className="px-4 py-3 flex justify-center gap-2 flex-wrap">
                        {req.isApproved === false ? (
                          <>
                            <button
                              onClick={() => {
                                setSelectedRequest(req);
                                setActionType('approve');
                                setShowModal(true);
                              }}
                              className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                            >
                              <CheckCircle size={14} /> Approve
                            </button>
                            <button
                              onClick={() => {
                                setSelectedRequest(req);
                                setActionType('reject');
                                setShowModal(true);
                              }}
                              className="flex items-center gap-1 px-2 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                            >
                              <XCircle size={14} /> Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-gray-500 text-sm">No action available</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      <AnimatePresence>
        {showModal && selectedRequest && actionType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="bg-white rounded-xl shadow-lg p-6 w-96 max-w-full"
            >
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      actionType === 'approve'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {actionType === 'approve' ? <CheckCircle size={28} /> : <XCircle size={28} />}
                  </div>
                </div>

                <h2 className="text-xl font-semibold mb-2">
                  {actionType === 'approve' ? 'Approve Vendor?' : 'Reject Vendor?'}
                </h2>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to {actionType} <strong>{selectedRequest.ownerName}</strong>{' '}
                  owner of <strong>{selectedRequest.companyName}</strong>?
                </p>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2 border rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      await handleAction(selectedRequest.id, actionType, selectedRequest.role);
                      setShowModal(false);
                      setSelectedRequest(null);
                      setActionType(null);
                    }}
                    className={`px-5 py-2 rounded-lg text-white ${
                      actionType === 'approve'
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    Yes, {actionType === 'approve' ? 'Approve' : 'Reject'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
