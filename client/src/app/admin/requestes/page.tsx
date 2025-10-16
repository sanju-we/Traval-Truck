'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { SideNavbar } from '@/components/admin/SideNavbar';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import ViewVendorDocumentsModal from '@/components/admin/viewDocumentModal';

interface VendorDocuments {
  registrationCertificate?: string | Blob;
  panCard?: string | Blob;
  bankProof?: string | Blob;
  ownerIdProof?: string | Blob;
}
interface VendorRequest {
  id: string;
  ownerName: string;
  email: string;
  companyName: string;
  role: string;
  isApproved: boolean;
  documents: VendorDocuments;
}

export default function VendorRequestsPage() {
  const [requests, setRequests] = useState<VendorRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<VendorRequest | null>(null);
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [selectedVendorRole, setSelectedVendorRole] = useState<string | null>(null);
  const [checkedDocs, setCheckedDocs] = useState({
    license: false,
    gst: false,
    pan: false,
    fssai: false,
  });
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState({});

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
    setSelectedDocs(vendorDocs);
    setSelectedVendorId(vendorId);
    setSelectedVendorRole(role);
    setIsModalOpen(true);
  }

  const handleAction = async (id: string, action: 'approve' | 'reject', role: string) => {
    try {
      const res = await api.patch(`/admin/vendor/${id}/${action}/${role}`);
      if (res.data.success) {
        toast.success('Vendor updated successfully');
        const updated = await api.get('/admin/vendor/allRequests');
        setRequests(updated.data.data);
        setShowDocsModal(false);
        setIsModalOpen(false)
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(`Failed to ${action} vendor:`, err);
      toast.error('Something went wrong!');
    }
  };

  const allChecked = Object.values(checkedDocs).every(Boolean);

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
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Vendor Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Company</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Role</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Actions</th>
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
                        {req.isApproved === false ? (
                          <button
                            onClick={() => handleViewDocuments({
                              panCard: `${req.documents.panCard}`,
                              ownerIdProof: `${req.documents.ownerIdProof}`,
                              bankProof: `${req.documents.bankProof}`,
                              registrationCertificate: `${req.documents.registrationCertificate}`,
                            }, req.id, req.role)}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                          >
                            <Eye size={14} /> View Documents
                          </button>
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

      <ViewVendorDocumentsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        documents={selectedDocs}
        onApprove={() =>
          selectedVendorId && selectedVendorRole
            ? handleAction(selectedVendorId, 'approve', selectedVendorRole)
            : null
        }
        onReject={() =>
          selectedVendorId && selectedVendorRole
            ? handleAction(selectedVendorId, 'reject', selectedVendorRole)
            : null
        }
      />
    </div>
  );
}
