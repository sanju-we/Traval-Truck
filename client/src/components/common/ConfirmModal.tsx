"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ConfirmModalProps {
  show: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmModal({
  show,
  title,
  description,
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl p-6 w-[90%] max-w-sm shadow-lg text-center"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
          >
            <h3 className="text-lg font-semibold mb-3">{title}</h3>
            <p className="text-gray-600 mb-6">{description}</p>

            <div className="flex justify-center gap-4">
              <Button
                onClick={onConfirm}
                className="bg-orange-600 hover:bg-orange-700 text-white"
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm"}
              </Button>

              <Button
                variant="secondary"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
