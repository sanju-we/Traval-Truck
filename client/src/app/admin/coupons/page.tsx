"use client";

import { useEffect, useState } from "react";
import { ADMIN_API_METHODS } from "@/services/APIs/admin.api.service";
import { Button } from "@/components/shared/ui/button";
import { Pencil, Plus, Loader2, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import AddCouponModal from "@/components/admin/addCouponModal";
import EditCouponModal from "@/components/admin/editCouponModal";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { CouponDTO } from "@/types/coupon.type";
import ConfirmModal from "@/components/common/ConfirmModal";
import { ApiResponse } from "@/services/api.service";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<CouponDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editData, setEditData] = useState<CouponDTO | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toggleTarget, setToggleTarget] = useState<any>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCoupons = async (page = 1) => {
    try {
      setLoading(true);
      const res = (await ADMIN_API_METHODS.fetchAllCoupons({ page })) as any;
      if (res?.success) {
        setCoupons(res.data?.data || []);
        setTotalPages(res.data?.totalPages || 1);
        setCurrentPage(res.data?.page || page);
      }
    } catch {
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons(currentPage);
  }, [currentPage]);

  const handleToggleClick = (coupon: any) => {
    setToggleTarget(coupon);
    setShowConfirmModal(true);
  };

  const handleConfirmToggle = async () => {
    if (!toggleTarget) return;
    setLoadingId(toggleTarget.id);
    setShowConfirmModal(false);

    try {
      const res = (await ADMIN_API_METHODS.editStatus(toggleTarget.id)) as ApiResponse | null;
      if (res && res.success) {
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
        toast.error(res?.message || "Failed to update coupon status.");
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
    <div className="flex-1 p-8">
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

          {/* Pagination Controls */}
          {!loading && coupons.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
              <span className="text-sm text-gray-500 font-medium">
                Showing Page <span className="text-indigo-600 font-bold">{currentPage}</span> of {totalPages}
              </span>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || loading}
                  className="bg-white hover:bg-gray-100 text-gray-700 border-gray-300 font-medium transition-all"
                >
                  <ChevronLeft size={16} className="mr-1" /> Prev
                </Button>

                {/* Page Number Pills */}
                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show pages around current page
                    let pageNum = i + 1;
                    if (totalPages > 5 && currentPage > 3) {
                      pageNum = currentPage - 3 + i + (currentPage + 2 > totalPages ? totalPages - currentPage - 2 : 0);
                    }

                    if (pageNum > totalPages || pageNum < 1) return null;

                    const isActive = pageNum === currentPage;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        disabled={loading}
                        className={`w-8 h-8 rounded-md flex items-center justify-center text-sm font-medium transition-all ${isActive
                            ? "bg-indigo-600 text-white shadow-md transform scale-105"
                            : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || loading || totalPages === 0}
                  className="bg-white hover:bg-gray-100 text-gray-700 border-gray-300 font-medium transition-all"
                >
                  Next <ChevronRight size={16} className="ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        {addOpen && (
          <AddCouponModal
            onClose={() => setAddOpen(false)}
            onSaved={() => fetchCoupons(currentPage)}
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
            coupon={{
              id: editData.id,
              couponCode: editData.couponCode,
              discountType: editData.discountType,
              discountValue: editData.discountValue,
              minPurchase: editData.minPurchase,
              expiryDate: new Date(editData.expiryDate).toISOString()
            }}
            onClose={() => setEditData(null)}
            onSaved={() => fetchCoupons(currentPage)}
          />
        )}
      </div>
    </div>
  );
}
