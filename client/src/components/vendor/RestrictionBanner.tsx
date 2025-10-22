'use client';

import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface RestrictionBannerProps {
  reason: string;
}

export default function RestrictionBanner({
  reason,
}: RestrictionBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 mb-4 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
          <div>
            <p className="font-semibold text-red-700">Your request was rejected by the admin.</p>
            <p className="text-sm mt-1 text-gray-700">
              <span className="font-medium">Reason:</span> {reason || 'No specific reason provided.'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
