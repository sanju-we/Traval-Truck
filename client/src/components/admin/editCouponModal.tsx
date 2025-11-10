"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import api from "@/services/api";

export default function EditCouponModal({ coupon, onClose, onSaved }: any) {
  const [form, setForm] = useState(coupon);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const updateCoupon = async () => {
    try {
      await api.patch(`/admin/coupons/edit/${coupon._id}`, form);
      toast.success("Coupon updated");
      onSaved();
      onClose();
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
      <div className="bg-white p-6 rounded-lg w-96 relative">
        <button className="absolute right-3 top-3" onClick={onClose}>
          <X size={18} />
        </button>
        <h2 className="text-lg font-semibold mb-4">Edit Coupon</h2>

        <div className="space-y-3">
          <span>couponCode</span>
          <input name="couponCode" value={form.couponCode} onChange={handleChange} className="border p-2 w-full rounded" />

          <span>discountType</span>
          <select name="discountType" value={form.discountType} onChange={handleChange} className="border p-2 w-full rounded">
            <option value="percentage">Percentage</option>
            <option value="flat">Flat</option>
          </select>

          <span>discountValue</span>
          <input name="discountValue" type="number" value={form.discountValue} onChange={handleChange} className="border p-2 w-full rounded" />

          <span>minPurchase</span>
          <input name="minPurchase" type="number" value={form.minPurchase} onChange={handleChange} className="border p-2 w-full rounded" />

          <span>expiryDate</span>
          <input name="expiryDate" type="date" value={form.expiryDate?.split("T")[0]} onChange={handleChange} className="border p-2 w-full rounded" />

        </div>

        <Button className="w-full mt-4" onClick={updateCoupon}>Update</Button>
      </div>
    </div>
  );
}
