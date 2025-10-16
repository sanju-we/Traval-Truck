'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, FileText } from 'lucide-react';

interface VendorDocuments {
  registrationCertificate?: string;
  panCard?: string;
  bankProof?: string;
  ownerIdProof?: string;
}

interface ViewVendorDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: VendorDocuments;
  onApprove: (id: string, role: string) => void;
  onReject: (id: string, role: string) => void;
}

export default function ViewVendorDocumentsModal({
  isOpen,
  onClose,
  documents,
  onApprove,
  onReject,
}: ViewVendorDocumentsModalProps) {
  const [checkedDocs, setCheckedDocs] = useState<string[]>([]);
  const [vendorId, setVendorId] = useState<string>('');
  const [role, setRole] = useState<string>('vendor'); 
  const docEntries = Object.entries(documents || {});

  useEffect(() => {
    if (!isOpen) setCheckedDocs([]);
  }, [isOpen]);

  const allChecked = checkedDocs.length === 4;

  function toggleCheck(name: string) {
    setCheckedDocs((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-lg p-6 relative"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>

            <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">
              Vendor Documents
            </h2>

            {docEntries.length > 0 ? (
              <div className="space-y-4">
                {docEntries.map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="text-emerald-500" size={20} />
                      <span className="capitalize">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {value ? (
                        <a
                          href={value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-sm underline"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">Not Uploaded</span>
                      )}

                      <input
                        type="checkbox"
                        checked={checkedDocs.includes(key)}
                        onChange={() => toggleCheck(key)}
                        className="w-4 h-4 accent-emerald-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">No documents uploaded.</p>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={()=>onReject(vendorId, role)}
                disabled={!allChecked}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 border 
                  ${
                    allChecked
                      ? 'border-red-500 text-red-500 hover:bg-red-50'
                      : 'border-gray-300 text-gray-400 cursor-not-allowed'
                  }`}
              >
                <X size={16} /> Reject
              </button>

              <button
                onClick={()=>onApprove(vendorId,role)}
                disabled={!allChecked}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 
                  ${
                    allChecked
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                <CheckCircle size={16} /> Approve
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
