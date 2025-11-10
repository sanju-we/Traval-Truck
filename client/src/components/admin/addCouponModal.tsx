"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import api from "@/services/api";

export default function AddCouponModal({ onClose, onSaved }: any) {
  const [form, setForm] = useState({
    couponCode: "",
    discountType: "percentage",
    discountValue: "",
    minPurchase: "",
    expiryDate: "",
    maxUsage: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveCoupon = async () => {
    try {
      const { data } = await api.post("/admin/coupons/add", form);
      if (data.success) {
        toast.success("Coupon added");
        onSaved();
        onClose();
      }else{
        toast(data.message)
      }
    } catch {
      toast.error("Failed to add coupon");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
      <div className="bg-white p-6 rounded-lg w-96 relative">
        <button className="absolute right-3 top-3" onClick={onClose}>
          <X size={18} />
        </button>
        <h2 className="text-lg font-semibold mb-4">Add Coupon</h2>

        <div className="space-y-3">
          <input placeholder="Coupon Code" name="couponCode" onChange={handleChange} className="border p-2 w-full rounded" />

          <select name="discountType" onChange={handleChange} className="border p-2 w-full rounded">
            <option value="percentage">Percentage</option>
            <option value="flat">Flat Amount</option>
          </select>

          <input placeholder="Discount Value" name="discountValue" type="number" onChange={handleChange} className="border p-2 w-full rounded" />

          <input placeholder="Min Purchase (optional)" name="minPurchase" type="number" onChange={handleChange} className="border p-2 w-full rounded" />

          <input type="date" name="expiryDate" onChange={handleChange} className="border p-2 w-full rounded" />

          <input placeholder="Max Usage" name="maxUsage" type="number" onChange={handleChange} className="border p-2 w-full rounded" />
        </div>

        <Button className="w-full mt-4" onClick={saveCoupon}>Save</Button>
      </div>
    </div>
  );
}
