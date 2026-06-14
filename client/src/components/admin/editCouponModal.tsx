"use client";

import { useState } from "react";
import { X, Loader2, Tag } from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import toast from "react-hot-toast";
import api from "@/services/api";

interface Coupon {
  id: string;
  couponCode: string;
  discountType: string;
  discountValue: number;
  minPurchase: number;
  expiryDate: string;
}

interface EditCouponModalProps {
  coupon: Coupon;
  onClose: () => void;
  onSaved: () => void;
}

export default function EditCouponModal({ coupon, onClose, onSaved }: EditCouponModalProps) {
  const [form, setForm] = useState<Coupon>(coupon);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name == 'minPurchase' || name == 'discountValue') setForm((prev: Coupon) => ({ ...prev, [name]: Number(value) }))
    else setForm((prev: Coupon) => ({ ...prev, [name]: value }));
  };

  const updateCoupon = async () => {
    if (!form.couponCode || !form.discountValue || !form.expiryDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const dValue = Number(form.discountValue);
    const mPurchase = Number(form.minPurchase) || 0;

    if (dValue <= 0) {
      toast.error("Discount value must be greater than 0");
      return;
    }

    if (form.discountType === "flat") {
      if (mPurchase <= dValue) {
        toast.error("Minimum purchase must be greater than the discount price");
        return;
      }
    }

    if (form.discountType === "percentage") {
      if (mPurchase < 1000) {
        toast.error("Minimum purchase must be at least 1000 rupees for percentage discounts");
        return;
      }
      if (dValue > 100) {
        toast.error("Percentage discount cannot exceed 100%");
        return;
      }
    }

    try {
      setLoading(true);
      const { data } = await api.patch(`/admin/coupons/edit/${coupon.id}`, form);
      if (data.success) {
        toast.success("Coupon updated successfully");
        onSaved();
        onClose();
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error("Failed to update coupon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999] animate-fadeIn">
      <div className="bg-white shadow-xl rounded-lg w-full max-w-md p-6 relative">
        <button
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-5">
          <Tag className="text-indigo-500" size={22} />
          <h2 className="text-xl font-semibold text-gray-800">
            Edit Coupon
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coupon Code
            </label>
            <input
              name="couponCode"
              value={form.couponCode}
              onChange={handleChange}
              className="border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-2 rounded w-full outline-none"
              placeholder="e.g. SAVE20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Type
            </label>
            <select
              name="discountType"
              value={form.discountType}
              onChange={handleChange}
              className="border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-2 rounded w-full"
            >
              <option value="percentage">Percentage</option>
              <option value="flat">Flat</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Value
            </label>
            <input
              name="discountValue"
              type="number"
              value={form.discountValue}
              onChange={handleChange}
              className="border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-2 rounded w-full"
              placeholder="e.g. 20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Purchase (₹)
            </label>
            <input
              name="minPurchase"
              type="number"
              value={form.minPurchase}
              onChange={handleChange}
              className="border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-2 rounded w-full"
              placeholder="e.g. 500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date
            </label>
            <input
              name="expiryDate"
              type="date"
              value={form.expiryDate?.split("T")[0]}
              onChange={handleChange}
              className="border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-2 rounded w-full"
            />
          </div>
        </div>

        <Button
          onClick={updateCoupon}
          className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={18} />
              Updating...
            </>
          ) : (
            "Update Coupon"
          )}
        </Button>
      </div>
    </div>
  );
}
