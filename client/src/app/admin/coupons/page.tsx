"use client";

import { useEffect, useState } from "react";
import { ADMIN_API_METHODS } from "@/services/APIs/admin.api.service";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Loader2, Tag } from "lucide-react";
import AddCouponModal from "@/components/admin/addCouponModal";
import EditCouponModal from "@/components/admin/editCouponModal";
import toast from "react-hot-toast";
import { SideNavbar } from "@/components/admin/SideNavbar";
import { motion } from "framer-motion";
import { CouponDTO } from "@/types/coupon.type";
import ConfirmModal from "@/components/common/ConfirmModal";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<CouponDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editData, setEditData] = useState<CouponDTO | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toggleTarget, setToggleTarget] = useState<any>(null);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const { data } = await ADMIN_API_METHODS.fetchAllCoupons();
      setCoupons(data?.data?.data || []);
    } catch {
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleToggleClick = (coupon: any) => {
    setToggleTarget(coupon);
    setShowConfirmModal(true);
  };

  const handleConfirmToggle = async () => {
    if (!toggleTarget) return;
    setLoadingId(toggleTarget.id);
    setShowConfirmModal(false);

    try {
      const res = await ADMIN_API_METHODS.editStatus(toggleTarget.id);
      if (res.data.success) {
        toast.success(
          `Coupon ${toggleTarget.isActive ? "deactivated" : "activated"} successfully!`
        );
        setCoupons((prev) =>
          prev.map((c) =>
            c.id === toggleTarget.id
              ? { ...c, isActive: !c.isActive }
              : c
          )
        );
      } else {
        toast.error(res.data.message || "Failed to update coupon status.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error toggling coupon status.");
    } finally {
      setLoadingId(null);
      setToggleTarget(null);
    }
  };

  return (
    <div className="flex">
      <SideNavbar active="Coupon" />
      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <Tag size={28} className="text-indigo-500" />
                Coupons
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Manage all your store discounts and promotional offers.
              </p>
            </div>
            <Button
              onClick={() => setAddOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Plus size={18} className="mr-2" /> Add Coupon
            </Button>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-indigo-500" size={28} />
                <span className="ml-2 text-gray-600">Loading coupons...</span>
              </div>
            ) : coupons.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <p className="text-lg font-medium">No coupons available</p>
                <p className="text-sm text-gray-400 mt-1">
                  Click “Add Coupon” to create your first one.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 border-b">
                    <tr className="text-left text-gray-700 font-semibold">
                      <th className="p-3">Code</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Value</th>
                      <th className="p-3">Expiry</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Update Status</th>
                      <th className="p-3 text-right">Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((c) => (
                      <tr
                        key={c.id}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-3 font-medium text-gray-800">
                          {c.couponCode}
                        </td>
                        <td className="p-3 capitalize">{c.discountType}</td>
                        <td className="p-3">
                          {c.discountType === "percentage"
                            ? `${c.discountValue}%`
                            : `₹${c.discountValue}`}
                        </td>
                        <td className="p-3 text-gray-600">
                          {new Date(c.expiryDate).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${c.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                              }`}
                          >
                            {c.isActive ? "Active" : "Expired"}
                          </span>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleToggleClick(c)}
                            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${c.isActive ? "bg-green-500" : "bg-gray-400"
                              }`}
                          >
                            <motion.div
                              layout
                              className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${c.isActive ? "translate-x-7" : "translate-x-0"
                                }`}
                            />
                          </button>
                        </td>
                        <td className="p-3 flex justify-end gap-3">
                          <button
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            onClick={() => setEditData(c)}
                          >
                            <Pencil size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Modals */}
          {addOpen && (
            <AddCouponModal
              onClose={() => setAddOpen(false)}
              onSaved={fetchCoupons}
            />
          )}
          <ConfirmModal
            show={showConfirmModal}
            title={
              toggleTarget?.isActive
                ? "Deactivate this coupon?"
                : "Activate this coupon?"
            }
            description={`Are you sure you want to ${toggleTarget?.isActive ? "deactivate" : "activate"
              } the coupon "${toggleTarget?.couponCode}"?`}
            onConfirm={handleConfirmToggle}
            onCancel={() => setShowConfirmModal(false)}
            loading={loadingId === toggleTarget?.id}
          />
          {editData && (
            <EditCouponModal
              coupon={editData}
              onClose={() => setEditData(null)}
              onSaved={fetchCoupons}
            />
          )}
        </div>
      </div>
    </div>
  );
}
