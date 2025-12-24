'use client';

import { useState, useEffect } from 'react';
import { ADMIN_API_METHODS } from '@/services/APIs/admin.api.service';
import { Eye, Search, Loader2, Inbox } from 'lucide-react';
import { SideNavbar } from '@/components/admin/SideNavbar';
import toast from 'react-hot-toast';
import ViewVendorDocumentsModal from '@/components/admin/viewDocumentModal';
import VendorRequest from '@/types/vendor/profile';

export default function VendorRequestsPage() {
  const [requests, setRequests] = useState<VendorRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedDocs, setSelectedDocs] = useState<any>({});
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [selectedVendorRole, setSelectedVendorRole] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [showRejectDropdown, setShowRejectDropdown] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const REJECT_REASONS = [
    'Invalid or unclear documents',
    'Incomplete registration details',
    'Duplicate submission',
    'Fake or unverifiable information',
    'Other reasons',
  ];

  const fetchRequests = async (query?: string) => {
    try {
      setLoading(true);
      const res = await ADMIN_API_METHODS.fetchAllRequest(
        query ? { search: query } : {}
      );
      setRequests(res.data.data || []);
    } catch {
      toast.error('Failed to fetch vendor requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => fetchRequests(searchTerm), 700);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  function handleViewDocuments(docs: any, id: string, role: string) {
    setSelectedDocs(docs);
    setSelectedVendorId(id);
    setSelectedVendorRole(role);
    setIsModalOpen(true);
    setRejectReason('');
    setShowRejectDropdown(false);
  }

  async function handleAction(
    id: string,
    action: 'approve' | 'reject',
    role: string,
    reason?: string,
  ) {
    try {
      const res = await ADMIN_API_METHODS.updateStatus(id, action, role, reason);
      if (res.data.success) {
        toast.success(`Vendor ${action}ed successfully`);
        fetchRequests(searchTerm);
        setIsModalOpen(false);
      }
    } catch {
      toast.error('Action failed');
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 hidden md:block bg-white border-r">
        <SideNavbar active="Requests" />
      </div>

      {/* Main */}
      <div className="flex-1 p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Vendor Requests
              </h1>
              <p className="text-sm text-gray-500">
                Review and approve vendor onboarding requests
              </p>
            </div>

            {/* Search */}
            <div className="flex items-center bg-white border rounded-lg px-3 py-2 w-full sm:w-80 shadow-sm">
              <Search size={18} className="text-gray-400 mr-2" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search vendor..."
                className="w-full text-sm outline-none"
              />
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-emerald-600" size={32} />
            </div>
          ) : requests.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-xl border shadow-sm p-12 text-center">
              <Inbox className="mx-auto text-gray-300 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-700">
                No Vendor Requests
              </h3>
              <p className="text-gray-500 mt-2">
                All vendor onboarding requests have been processed.
              </p>
            </div>
          ) : (
            /* Table */
            <div className="bg-white rounded-xl shadow border overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-600">Vendor</th>
                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-600">Company</th>
                    <th className="px-5 py-3 text-center text-sm font-semibold text-gray-600">Role</th>
                    <th className="px-5 py-3 text-center text-sm font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4 font-medium text-gray-800">
                        {req.ownerName}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {req.email}
                      </td>
                      <td className="px-5 py-4 text-sm">
                        {req.companyName}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          {req.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        {req.isApproved === false && !req.isRestricted ? (
                          <button
                            onClick={() =>
                              handleViewDocuments(req.documents, req.id, req.role)
                            }
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                          >
                            <Eye size={16} />
                            View
                          </button>
                        ) : req.isRestricted ? (
                          <span className="text-red-500 text-sm font-medium">
                            Restricted
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            Processed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals (unchanged) */}
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

      {showRejectDropdown && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Reject Reason</h3>

            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border rounded-lg p-2 mb-4"
            >
              <option value="">Select reason</option>
              {REJECT_REASONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRejectDropdown(false)}
                className="px-4 py-2 text-gray-600"
              >
                Cancel
              </button>
              <button
                disabled={!rejectReason}
                onClick={() => {
                  if (selectedVendorId && selectedVendorRole) {
                    handleAction(
                      selectedVendorId,
                      'reject',
                      selectedVendorRole,
                      rejectReason,
                    );
                    setShowRejectDropdown(false);
                  }
                }}
                className={`px-4 py-2 rounded-lg text-white ${
                  rejectReason
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-red-300 cursor-not-allowed'
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
