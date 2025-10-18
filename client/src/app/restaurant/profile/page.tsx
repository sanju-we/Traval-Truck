'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, Edit, Mail, Phone, X, Check } from 'lucide-react';
import SideNavbar from '@/components/restaurant/SideNavbar';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/components/utils/UserCropImage';
import VendorProfile from '@/types/vendor/profile';
import DocumentUploadWithPreview from '@/components/utils/DocumentUploadWithPreview';

export default function VendorProfilePage() {
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteLoad, setDeleteLoad] = useState<string | null>(null);
  const [isUpload, setIsUpload] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<VendorProfile>>({});
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [profileLoad, setProfileLoad] = useState(false);

  useEffect(() => {
    async function fetchVendor() {
      try {
        const { data } = await api.get('/restaurant/profile/profile');
        if (!data.success) {
          toast.error(data.message);
          if (data.message === 'This user is Restricted by the admin') {
            router.push('/restaurant');
          }
          return;
        }
        const result: VendorProfile = data.data;
        console.log(result)
        setVendor(result);
        setFormData(result);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    fetchVendor();
  }, [router]);

  function validateProfileForm(form: Partial<VendorProfile>): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!form.ownerName || form.ownerName.trim().length < 3) {
      errors.ownerName = 'Owner name must be at least 3 characters';
    }

    if (!form.phone || !/^\d{10}$/.test(form.phone.toString())) {
      errors.phone = 'Phone number must be a valid 10-digit number';
    }

    if (!form.companyName || form.companyName.trim().length < 2) {
      errors.companyName = 'Company name must be at least 2 characters';
    }

    const bank = form.bankDetails || {};

    if (!bank.accountHolder || bank.accountHolder.trim().length < 3) {
      errors.accountHolder = 'Account holder name must be at least 3 characters';
    }

    if (!bank.accountNumber || !/^\d{9,18}$/.test(bank.accountNumber)) {
      errors.accountNumber = 'Account number must be 9 to 18 digits';
    }

    if (!bank.bankName || bank.bankName.trim().length < 3) {
      errors.bankName = 'Bank name must be at least 3 characters';
    }

    if (!bank.ifscCode || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bank.ifscCode)) {
      errors.ifscCode = 'Invalid IFSC code (e.g. SBIN0001234)';
    }

    return errors;
  }

  async function handleRemoveDocument(key: string, documentUrl: string | undefined) {
    if (!documentUrl) {
      toast.error('No document to remove.');
      return;
    }
    setDeleteLoad(key);
    try {
      const response = await api.delete('/restaurant/profile/delete-image', {
        data: { documentUrl, key },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      if (data.success) {
        setFormData(data.data);
        setVendor(data.data);
        toast.success(`${key} removed successfully!`);
      } else {
        toast.error('Failed to remove document.');
      }
      setDeleteLoad(null);
    } catch (error) {
      console.error(error);
      setDeleteLoad(null);
      toast.error('Error removing document.');
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
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
    const bankErrors = validateProfileForm(formData);
    if (Object.keys(bankErrors).length > 0) {
      setErrors(bankErrors);
      setIsSaving(false);
      toast.error('Please fix validation errors');
      return;
    }
    setErrors({});

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

      const { data } = await api.patch('/restaurant/profile/update', formPayload);

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
        const hasNewFiles = Object.values(formData.documents).some((value) => value instanceof Blob);
        if (!hasNewFiles) {
          toast.error('Please upload all required documents');
          setIsSaving(false);
          return;
        }

        Object.entries(formData.documents).forEach(([key, value]) => {
          if (value && typeof value !== 'string') {
            formPayload.append(`${key}`, value as Blob);
          }
        });
      }

      console.log('FormData entries:');
      for (const [key, value] of formPayload.entries()) {
        console.log(key, value);
      }

      const { data } = await api.put('/restaurant/profile/update-documents', formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (!data.success) {
        toast.error(data.message || 'Upload failed');
        return;
      }
      toast.success('All documents uploaded successfully!');
      if (data.data !== null) {
        setVendor(data.data);
        setFormData(data.data);
      }
      setIsUpload(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload documents');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setIsCropping(true);
    }
  }

  async function handleCropComplete() {
    try {
      setProfileLoad(true);
      const croppedImage = await getCroppedImg(imagePreview!, croppedAreaPixels);
      const ress = await fetch(croppedImage);
      const blob = await ress.blob();

      const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });

      const formDataImg = new FormData();
      formDataImg.append('profile', file);
      const res = await api.post('/restaurant/profile/upload-profile', formDataImg, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        if (res.data.data != null) {
          setFormData(res.data.data);
        }
        toast.success('Profile picture updated successfully!');
      }
      setProfileLoad(false);
      setIsCropping(false);
      setImagePreview(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to crop image.');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold text-gray-600">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        Loading profile...
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">No vendor found.</p>
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
              src={vendor.logo || '/images/profile.jpg'}
              alt="Vendor Profile"
              fill
              className="rounded-full object-cover border-4 border-emerald-500"
            />
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
              {vendor.documents &&
                Object.entries(vendor.documents).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-2 px-4 border-b border-gray-200">
                    <span className="font-medium capitalize text-gray-800">{key.replace(/([A-Z])/g, ' $1')}</span>
                    {typeof value === 'string' ? (
                      <div className="flex items-center space-x-3">
                        <a href={value} target="_blank" className="text-blue-600 hover:underline">
                          View
                        </a>
                        <button
                          onClick={() => handleRemoveDocument(key, value)}
                          className={`text-red-600 hover:text-red-800 ${deleteLoad === key ? 'cursor-not-allowed' : ''}`}
                          disabled={deleteLoad === key}
                        >
                          {deleteLoad === key ? (
                            <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            'Remove'
                          )}
                        </button>
                      </div>
                    ) : (
                      <span className="text-red-500 font-medium">Required - Not Uploaded</span>
                    )}
                  </div>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

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
              <button
                onClick={() => setIsEditing(false)}
                className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
              <h2 className="text-lg font-semibold text-center mb-4">Edit Vendor Profile</h2>

              <form onSubmit={handleFormSubmit} className="grid grid-cols-1 gap-4">
                <div className="flex flex-col items-center mb-5">
                  <div className="relative group">
                    <img
                      src={formData.logo || '/images/profile.jpg'}
                      alt="Profile Preview"
                      className="w-28 h-28 rounded-full object-cover border-4 border-emerald-500 transition duration-300 group-hover:opacity-80"
                    />
                    <label
                      htmlFor="profile-upload"
                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition duration-300"
                    >
                      <Camera size={22} className="text-white drop-shadow-lg" />
                      <input
                        id="profile-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Click the camera to change photo</p>
                </div>
                <input
                  name="ownerName"
                  value={formData.ownerName || ''}
                  onChange={handleInputChange}
                  placeholder="Owner Name"
                  className="border rounded-md px-3 py-2"
                  required
                />
                {errors.ownerName && <p className="text-red-500 text-sm">{errors.ownerName}</p>}
                <input
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  placeholder="Phone"
                  className="border rounded-md px-3 py-2"
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                <input
                  name="companyName"
                  value={formData.companyName || ''}
                  onChange={handleInputChange}
                  placeholder="Company Name"
                  className="border rounded-md px-3 py-2"
                />
                {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName}</p>}
                <input
                  name="bankDetails.accountHolder"
                  value={formData.bankDetails?.accountHolder || ''}
                  onChange={handleInputChange}
                  placeholder="Account Holder"
                  className="border rounded-md px-3 py-2"
                />
                {errors.accountHolder && <p className="text-red-500 text-sm">{errors.accountHolder}</p>}
                <input
                  name="bankDetails.accountNumber"
                  value={formData.bankDetails?.accountNumber || ''}
                  onChange={handleInputChange}
                  placeholder="Account Number"
                  className="border rounded-md px-3 py-2"
                />
                {errors.accountNumber && <p className="text-red-500 text-sm">{errors.accountNumber}</p>}
                <input
                  name="bankDetails.bankName"
                  value={formData.bankDetails?.bankName || ''}
                  onChange={handleInputChange}
                  placeholder="Bank Name"
                  className="border rounded-md px-3 py-2"
                />
                {errors.bankName && <p className="text-red-500 text-sm">{errors.bankName}</p>}
                <input
                  name="bankDetails.ifscCode"
                  value={formData.bankDetails?.ifscCode || ''}
                  onChange={handleInputChange}
                  placeholder="IFSC Code"
                  className="border rounded-md px-3 py-2"
                />
                {errors.ifscCode && <p className="text-red-500 text-sm">{errors.ifscCode}</p>}

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="border px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600"
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {isUpload && (
          <form onSubmit={handleDocumentSubmit}>
            <motion.div
              key="upload-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col"
                initial={{ y: 50, scale: 0.95 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 50, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-6 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-white/20 rounded-full animate-pulse" />
                      <div>
                        <h2 className="text-2xl font-bold">Upload Required Documents</h2>
                        <p className="text-red-100 text-sm">All 4 documents are mandatory for verification</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsUpload(false)}
                      className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-4 flex items-center gap-8 text-sm">
                    {[
                      { label: "PAN Card", required: true },
                      { label: "Owner ID", required: true },
                      { label: "Bank Proof", required: true },
                      { label: "Registration", required: true },
                    ].map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-white" />
                        <span className="font-medium">{doc.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="px-8 py-4 bg-gray-50 border-b">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">4</span>
                    </div>
                    <span>Complete All Documents</span>
                    <div className="flex-1 h-1 bg-gray-200 rounded-full ml-4">
                      <div
                        className="h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((Object.values(formData.documents || {}).filter(v => v instanceof Blob).length / 4) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full" />
                        Required Documents (All 4)
                      </h3>
                      <div className="space-y-6">
                        <DocumentUploadWithPreview
                          label="PAN Card"
                          existingUrl={vendor.documents?.panCard as string}
                          onChange={(fileOrBlob) =>
                            setFormData((prev) => ({
                              ...prev,
                              documents: { ...(prev.documents || {}), panCard: fileOrBlob },
                            }))
                          }
                          required
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
                          required
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
                          required
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
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quick Tips */}
                  <div className="mt-8 p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Important: All Documents Required
                    </h4>
                    <div className="space-y-2 text-sm text-red-700">
                      <p>• <strong>All 4 documents are mandatory</strong> for account verification</p>
                      <p>• Use clear, high-quality images (JPG/PNG, max 5MB)</p>
                      <p>• Ensure all text is clearly readable</p>
                      <p>• PAN: Show complete card with name & number</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 bg-gray-50 border-t flex items-center justify-between">
                  <div className="text-sm text-red-600 font-medium">
                    {Object.values(formData.documents || {}).filter(v => v instanceof Blob).length}/4 documents ready
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsUpload(false)}
                      className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving || Object.values(formData.documents || {}).filter(v => v instanceof Blob).length === 0}
                      className="px-8 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold transition-colors flex items-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        'Submit All Documents'
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </form>
        )}
      </AnimatePresence>

      {/* Profile Crop Modal */}
      {isCropping && (
        <div className="fixed inset-0 bg-black/60 flex flex-col items-center justify-center z-50">
          <div className="relative bg-white rounded-2xl w-[90%] max-w-lg h-[500px] overflow-hidden">
            <Cropper
              image={imagePreview || ''}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
            />
            <div className="absolute bottom-20 left-0 right-0 flex justify-center">
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-2/3"
              />
            </div>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
              <button
                onClick={() => setIsCropping(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCropComplete}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
              >
                {profileLoad ? (
                  <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Save Crop'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}