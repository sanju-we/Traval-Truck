'use client';

import { X, AlertCircle } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Terms & Conditions
          </h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-4 text-sm text-gray-700 max-h-[60vh] overflow-y-auto">
          <div className="flex items-start gap-2 text-emerald-600">
            <AlertCircle className="w-5 h-5 mt-0.5" />
            <p className="font-semibold">
              The following terms apply only to <strong>Package Purchases</strong>
            </p>
          </div>

          <ul className="list-disc ml-6 space-y-3">
            <li>
              Cancellation of a package <strong>after 7 days from purchase</strong> will
              incur a <strong>platform fee of 3%</strong>. The remaining balance
              (excluding the platform fee) will be refunded.
            </li>

            <li>
              Once the <strong>package start date is confirmed</strong>, any
              cancellation will still include a <strong>platform fee deduction</strong>.
            </li>

            <li>
              The <strong>platform fee is non-refundable</strong> once the payment
              has been completed, regardless of the cancellation reason.
            </li>

            <li>
              These terms apply <strong>only to package purchases</strong>.
              Purchases related to <strong>food or room bookings</strong> may have
              different cancellation policies.
            </li>

            <li>
              By proceeding with the payment, you acknowledge and agree to all
              the above terms and conditions.
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
