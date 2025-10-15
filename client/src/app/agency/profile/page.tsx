'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import DocumentUploadWithPreview from '../../../components/utils/DocumentUploadWithPreview';
import { Camera, Edit, Mail, Phone, MapPin, Pencil } from 'lucide-react';
import SideNavbar from '@/components/agency/SideNavbar';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface BankDetails {
  accountHolder?: string;
  accountNumber?: string;
  ifscCode?: string;
  bankName?: string;
}
interface VendorDocuments {
  registrationCertificate?: string | Blob;
  panCard?: string | Blob;
  bankProof?: string | Blob;
  ownerIdProof?: string | Blob;
}
interface VendorProfile {
  id: string;
  ownerName: string;
  email: string;
  profilePicture?: string;
  phone?: number;
  companyName?: string;
  role?: string;
  bankDetails?: BankDetails;
  documents?: VendorDocuments;
  isApproved: boolean;
  isBlocked: boolean;
  createdAt: string;
}

export default function VendorViewPage() {
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isUpload, setIsUpload] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<Partial<VendorProfile>>({});
    const route = useRouter();

  useEffect(() => {
    async function fetchVendor() {
      try {
        const { data } = await api.get('/agency/profile/profile');

        if (!data.success) {
          toast.error(data.message);
          if (data.message === 'This user is Restricted by the admin') {
            route.push('/agency');
          }
          return;
        }

        const result: VendorProfile = data.data;
        setFormData(result);
        setVendor(result);
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch vendor profile');
      } finally {
        setLoading(false);
      }
    }

    fetchVendor();
  }, [route]);

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formPayload = new FormData();

      if (formData.ownerName) formPayload.append('ownerName', formData.ownerName);
      if (formData.phone) formPayload.append('phone', formData.phone.toString());
      if (formData.companyName) formPayload.append('companyName', formData.companyName);

      if (formData.bankDetails) {
        Object.entries(formData.bankDetails).forEach(([key, value]) => {
          if (value) formPayload.append(`bankDetails.${key}`, value);
        });
      }

      const { data } = await api.patch('/agency/profile/update', formPayload);

      if (!data.success) {
        toast.error(data.message || 'Update failed');
        return;
      }

      toast.success('Profile updated successfully');
      setVendor(data.data);
      setFormData(data.data);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDocumentSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formPayload = new FormData();

      if (formData.documents) {
        Object.entries(formData.documents).forEach(([key, value]) => {
          if (value && typeof value !== 'string') {
            formPayload.append(`${key}`, value as Blob);
          }
        });
      }

      for (const [key, value] of formPayload.entries()) {
        console.log('FormData:', key, value);
      }

      const {data} = await api.put('/agency/profile/update-documents', formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (!data.success) {
        toast.error(data.message || 'Upload failed');
        return;
      }
      console.log(`data = ${JSON.stringify(data)}`)
      toast.success('Documents uploaded successfully');
      setVendor(data.data);
      setFormData(data.data);
      setIsUpload(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload documents');
    } finally {
      setIsSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold text-gray-600">
        Loading profile...
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-2">Ooops, something went wrong...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideNavbar />

      <div className="flex-1 px-6 py-10">
        <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row items-center gap-6">
          <div className="relative w-[120px] h-[120px] flex-shrink-0">
            <Image
              src={vendor.profilePicture || '/images/profile.jpg'}
              alt="Vendor Profile"
              fill
              className="rounded-full object-cover border-4 border-emerald-500"
            />
            <button
              className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1.5 rounded-full hover:bg-emerald-600 transition"
              aria-label="Change Profile Picture"
            >
              <Camera size={16} />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-emerald-700">{vendor.ownerName}</h2>
            <p className="text-gray-500">{vendor.companyName || 'N/A'}</p>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 flex items-center gap-2 text-sm"
              >
                <Edit size={16} /> Edit Profile
              </button>
              <button
                onClick={() => setIsUpload(true)}
                className="px-4 py-2 border border-emerald-500 text-emerald-500 rounded-lg hover:bg-emerald-50 text-sm"
              >
                Attach Documents
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="mt-8">
          <TabsList className="grid grid-cols-3 w-full max-w-2xl mx-auto">
            <TabsTrigger value="profile">Profile Info</TabsTrigger>
            <TabsTrigger value="bank">Bank Details</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg shadow-sm">
                <Mail className="text-emerald-500" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{vendor.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg shadow-sm">
                <Phone className="text-emerald-500" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-800">{vendor.phone || 'N/A'}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bank">
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-800">Bank Details</h3>
              <div className="mt-4 space-y-3">
                <p><b>Account Holder:</b> {vendor.bankDetails?.accountHolder || 'N/A'}</p>
                <p><b>Account Number:</b> {vendor.bankDetails?.accountNumber || 'N/A'}</p>
                <p><b>Bank Name:</b> {vendor.bankDetails?.bankName || 'N/A'}</p>
                <p><b>IFSC Code:</b> {vendor.bankDetails?.ifscCode || 'N/A'}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-800">Documents</h3>
              {vendor.documents ? (
                <ul className="mt-4 space-y-2">
                  {Object.entries(vendor.documents).map(([key, value]) => (
                    <li key={key} className="flex justify-between border-b py-1">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      {typeof value === 'string' ? (
                        <a href={value} target="_blank" className="text-blue-600 underline">View</a>
                      ) : (
                        <span>Not Uploaded</span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 mt-2">No documents uploaded</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* EDIT PROFILE MODAL */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            key="edit-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 relative"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <button onClick={() => setIsEditing(false)} className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold">
                ×
              </button>
              <h2 className="text-lg font-semibold text-center mb-4">Edit Vendor Profile</h2>

              <form onSubmit={handleFormSubmit} className="grid grid-cols-1 gap-4">
                <input name="ownerName" value={formData.ownerName || ''} onChange={handleInputChange} placeholder="Owner Name" className="border rounded-md px-3 py-2" required />
                <input name="phone" value={formData.phone || ''} onChange={handleInputChange} placeholder="Phone" className="border rounded-md px-3 py-2" />
                <input name="companyName" value={formData.companyName || ''} onChange={handleInputChange} placeholder="Company Name" className="border rounded-md px-3 py-2" />
                <input name="bankDetails.accountHolder" value={formData.bankDetails?.accountHolder || ''} onChange={handleInputChange} placeholder="Account Holder" className="border rounded-md px-3 py-2" />
                <input name="bankDetails.accountNumber" value={formData.bankDetails?.accountNumber || ''} onChange={handleInputChange} placeholder="Account Number" className="border rounded-md px-3 py-2" />
                <input name="bankDetails.bankName" value={formData.bankDetails?.bankName || ''} onChange={handleInputChange} placeholder="Bank Name" className="border rounded-md px-3 py-2" />
                <input name="bankDetails.ifscCode" value={formData.bankDetails?.ifscCode || ''} onChange={handleInputChange} placeholder="IFSC Code" className="border rounded-md px-3 py-2" />

                <div className="flex justify-end gap-2 pt-3">
                  <button type="button" onClick={() => setIsEditing(false)} className="border px-4 py-2 rounded-md">Cancel</button>
                  <button type="submit" className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600">
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* ATTACH DOCUMENTS MODAL */}
        {isUpload && (
          <motion.div
            key="upload-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl w-[90%] max-w-lg max-h-[90vh] overflow-y-auto p-8 relative"
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              exit={{ y: 50 }}
            >
              <button onClick={() => setIsUpload(false)} className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold">
                ×
              </button>

              <h2 className="text-xl font-semibold text-center mb-4">Upload Vendor Documents</h2>

              <form onSubmit={handleDocumentSubmit} className="grid grid-cols-1 gap-4">
                <DocumentUploadWithPreview
                  label="PAN Card"
                  existingUrl={vendor.documents?.panCard as string}
                  onChange={(fileOrBlob) =>
                    setFormData((prev) => ({
                      ...prev,
                      documents: { ...(prev.documents || {}), panCard: fileOrBlob },
                    }))
                  }
                />
                <DocumentUploadWithPreview
                  label="Owner ID Proof"
                  existingUrl={vendor.documents?.ownerIdProof as string}
                  onChange={(fileOrBlob) =>
                    setFormData((prev) => ({
                      ...prev,
                      documents: { ...(prev.documents || {}), ownerIdProof: fileOrBlob },
                    }))
                  }
                />
                <DocumentUploadWithPreview
                  label="Bank Proof"
                  existingUrl={vendor.documents?.bankProof as string}
                  onChange={(fileOrBlob) =>
                    setFormData((prev) => ({
                      ...prev,
                      documents: { ...(prev.documents || {}), bankProof: fileOrBlob },
                    }))
                  }
                />
                <DocumentUploadWithPreview
                  label="Registration Certificate"
                  existingUrl={vendor.documents?.registrationCertificate as string}
                  onChange={(fileOrBlob) =>
                    setFormData((prev) => ({
                      ...prev,
                      documents: { ...(prev.documents || {}), registrationCertificate: fileOrBlob },
                    }))
                  }
                />

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsUpload(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition"
                  >
                    {isSaving ? 'Uploading...' : 'Submit'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
