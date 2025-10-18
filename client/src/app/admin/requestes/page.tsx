'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Eye } from 'lucide-react';
import { SideNavbar } from '@/components/admin/SideNavbar';
import toast from 'react-hot-toast';
import ViewVendorDocumentsModal from '@/components/admin/viewDocumentModal';
import VendorRequest from '@/types/vendor/profile';

export default function VendorRequestsPage() {
  const [requests, setRequests] = useState<VendorRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocs, setSelectedDocs] = useState<any>({});
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [selectedVendorRole, setSelectedVendorRole] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dropdown state
  const [showRejectDropdown, setShowRejectDropdown] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const REJECT_REASONS = [
    'Invalid or unclear documents',
    'Incomplete registration details',
    'Duplicate submission',
    'Fake or unverifiable information',
    'Other reasons',
  ];

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

  function handleViewDocuments(vendorDocs: any, vendorId: string, role: string) {
    console.log(vendorDocs)
    setSelectedDocs(vendorDocs);
    setSelectedVendorId(vendorId);
    setSelectedVendorRole(role);
    setIsModalOpen(true);
    setShowRejectDropdown(false);
    setRejectReason('');
  }

  const handleAction = async (
    id: string,
    action: 'approve' | 'reject',
    role: string,
    reason?: string,
  ) => {
    try {
      console.log(id,action,role,reason)
      const payload = reason ? { reason } : {reason:''};
      const res = await api.patch(`/admin/vendor/${id}/${action}/${role}`, payload);

      if (res.data.success) {
        toast.success(`Vendor ${action}ed successfully`);
        const updated = await api.get('/admin/vendor/allRequests');
        setRequests(updated.data.data);
        setIsModalOpen(false);
      } else {
        console.log(res.data.message)
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(`Failed to ${action} vendor:`, err);
      toast.error('Something went wrong!');
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-64">
        <SideNavbar active="Requests" />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 bg-gray-50">
        <h1 className="text-2xl font-bold mb-6">Vendor Requests</h1>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : requests.length === 0 ? (
          <p className="text-gray-500">No vendor requests found.</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="w-full border-collapse min-w-[600px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Vendor Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Company
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Role</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
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
                    <td className="px-4 py-3 flex justify-center gap-2">
                      {(req.isApproved === false && !req.isRestricted )? (
                        <button
                          onClick={() =>
                            handleViewDocuments(
                              req.documents ? {
                                panCard: `${req.documents?.panCard}`,
                                ownerIdProof: `${req.documents?.ownerIdProof}`,
                                bankProof: `${req.documents?.bankProof}`,
                                registrationCertificate: `${req.documents?.registrationCertificate}`,
                              } : {},
                              req.id,
                              req.role,
                            )
                          }
                          className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                        >
                          <Eye size={14} /> View Documents
                        </button>
                      ) : req.isRestricted ? (
                        <span className="text-red-500 text-sm">Vendor Restricted</span>
                      ) :
                      (
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

      {/* Document Modal */}
      <ViewVendorDocumentsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        documents={selectedDocs}
        onApprove={() =>
          selectedVendorId && selectedVendorRole
            ? handleAction(selectedVendorId, 'approve', selectedVendorRole)
            : null
        }
        onReject={() => setShowRejectDropdown(true)}
      />

      {/* Reject Reason Dropdown */}
      {showRejectDropdown && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Select Rejection Reason</h3>

            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">-- Select a reason --</option>
              {REJECT_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRejectDropdown(false)}
                className="px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                disabled={!rejectReason}
                onClick={() => {
                  if (selectedVendorId && selectedVendorRole) {
                    handleAction(selectedVendorId, 'reject', selectedVendorRole, rejectReason);
                    setShowRejectDropdown(false);
                  }
                }}
                className={`px-4 py-2 rounded-md text-white ${
                  rejectReason
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-red-400 cursor-not-allowed'
                }`}
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
