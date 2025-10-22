"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { SideNavbar } from "@/components/admin/SideNavbar";
import api from "@/services/api";
import { toast } from "react-hot-toast";
import { subscriptionData } from "@/types/subscription.type";

export default function SubscriptionPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState<subscriptionData[]>([]);
  const [selectedSubscription, setSelectedSubscription] = useState<subscriptionData | null>(null);
  const [addErrors, setAddErrors] = useState<Record<string, string>>({});
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toggleTarget, setToggleTarget] = useState<subscriptionData | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);


  const [addFormData, setAddFormData] = useState({
    Name: "",
    Category: "normal",
    Duration: {
      startingDate: "",
      endingDate: "",
    },
    Valid: "",
    Description: "",
    Amount: "",
    Features: "",
    IsActive: true,
  });

  const [editFormData, setEditFormData] = useState({
    Name: "",
    Category: "normal",
    Duration: {
      startingDate: "",
      endingDate: "",
    },
    Valid: "",
    Description: "",
    Amount: "",
    Features: "",
    IsActive: true,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await api.get("/admin/subscription/getAll");
        if (data.success) {
          console.log(data.data)
          setSubscriptions(data.data);
        } else {
          toast.error("Failed to fetch subscriptions.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error fetching subscription data.");
      }
    }

    fetchData();
  }, []);

  const validateSubscriptionForm = (formData: any) => {
    const errors: Record<string, string> = {};
    const today = new Date();
    const start = new Date(formData.Duration.startingDate);
    const end = new Date(formData.Duration.endingDate);

    if (!formData.Name.trim()) errors.Name = "Plan name is required. Atleast 3 letters";
    if (!formData.Category) errors.Category = "Category is required.";

    if (!formData.Duration.startingDate) {
      errors.startingDate = "Start date is required.";
    } else if (start < new Date(today.setHours(0, 0, 0, 0))) {
      errors.startingDate = "Start date must be today or a future date.";
    }

    if (!formData.Duration.endingDate) {
      errors.endingDate = "End date is required.";
    } else if (end <= start) {
      errors.endingDate = "End date must be after start date.";
    }

    if (!formData.Valid || Number(formData.Valid) <= 0) {
      errors.Valid = "Validity must be a positive number.";
    }

    if (!formData.Amount || Number(formData.Amount) <= 100) {
      errors.Amount = "Amount must be greater than 100.";
    }

    if (!formData.Description || formData.Description.trim().length < 10) {
      errors.Description = "Description must be at least 10 characters long.";
    }

    if (!formData.Features || formData.Features.trim().length === 0) {
      errors.Features = "Please provide at least one feature.";
    }

    return errors;
  };


  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "startingDate" || name === "endingDate") {
      setAddFormData((prev) => ({
        ...prev,
        Duration: {
          ...prev.Duration,
          [name]: value,
        },
      }));
    } else {
      setAddFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "startingDate" || name === "endingDate") {
      setEditFormData((prev) => ({
        ...prev,
        Duration: {
          ...prev.Duration,
          [name]: value,
        },
      }));
    } else {
      setEditFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateSubscriptionForm(addFormData);
    if (Object.keys(errors).length > 0) {
      setAddErrors(errors);
      toast.error("Please fix the validation errors.");
      return;
    }
    setAddErrors({});
    setLoading(true);

    const payload = {
      Name: addFormData.Name,
      Category: addFormData.Category,
      Duration: {
        startingDate: new Date(addFormData.Duration.startingDate),
        endingDate: new Date(addFormData.Duration.endingDate),
      },
      Valid: Number(addFormData.Valid),
      Description: addFormData.Description,
      Amount: Number(addFormData.Amount),
      Features: addFormData.Features.split(",").map((f) => f.trim()),
      IsActive: addFormData.IsActive,
    };

    try {
      const res = await api.post("/admin/subscription/add", payload);

      if (res.data.success) {
        toast.success("Subscription added successfully!");
        setShowAddModal(false);
        setAddFormData({
          Name: "",
          Category: "normal",
          Duration: { startingDate: "", endingDate: "" },
          Valid: "",
          Description: "",
          Amount: "",
          Features: "",
          IsActive: true,
        });
        // Refresh subscriptions
        const { data } = await api.get("/admin/subscription/getAll");
        setSubscriptions(data.data);
      } else {
        toast.error(res.data.message || "Failed to add subscription.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    const errors = validateSubscriptionForm(addFormData);
    if (Object.keys(errors).length > 0) {
      setAddErrors(errors);
      toast.error("Please fix the validation errors.");
      return;
    }
    setAddErrors({});
    setLoading(true);
    if (!selectedSubscription?.id) return;

    const payload = {
      Name: editFormData.Name,
      Category: editFormData.Category,
      Duration: {
        startingDate: new Date(editFormData.Duration.startingDate),
        endingDate: new Date(editFormData.Duration.endingDate),
      },
      Valid: Number(editFormData.Valid),
      Description: editFormData.Description,
      Amount: Number(editFormData.Amount),
      Features: editFormData.Features.split(",").map((f) => f.trim()),
      IsActive: editFormData.IsActive,
    };

    try {
      const res = await api.put(`/admin/subscription/update/${selectedSubscription.id}`, payload);

      if (res.data.success) {
        toast.success("Subscription updated successfully!");
        setShowEditModal(false);
        setSelectedSubscription(null);
        setEditFormData({
          Name: "",
          Category: "normal",
          Duration: { startingDate: "", endingDate: "" },
          Valid: "",
          Description: "",
          Amount: "",
          Features: "",
          IsActive: true,
        });
        const { data } = await api.get("/admin/subscription/getAll");
        setSubscriptions(data.data);
      } else {
        toast.error(res.data.message || "Failed to update subscription.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleClick = (subscription: subscriptionData) => {
    setToggleTarget(subscription);
    setShowConfirmModal(true);
  };

  const handleConfirmToggle = async () => {
    if (!toggleTarget) return;
    setLoadingId(toggleTarget.id);
    setShowConfirmModal(false);

    try {
      const res = await api.put(`/admin/subscription/toggle/${toggleTarget.id}`);
      if (res.data.success) {
        toast.success("Subscription status updated!");
        setSubscriptions((prev) =>
          prev.map((s) =>
            s.id === toggleTarget.id ? { ...s, isActive: !s.isActive } : s
          )
        );
      } else {
        toast.error(res.data.message || "Failed to update status.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error toggling subscription status.");
    } finally {
      setLoadingId(null);
      setToggleTarget(null);
    }
  };


  // Open edit modal and set form data
  const openEditModal = (subscription: subscriptionData) => {
    setSelectedSubscription(subscription);
    setEditFormData({
      Name: subscription.name,
      Category: subscription.category,
      Duration: {
        startingDate: subscription.duration?.startingDate
          ? new Date(subscription.duration.startingDate).toISOString().split("T")[0]
          : "",
        endingDate: subscription.duration?.endingDate
          ? new Date(subscription.duration.endingDate).toISOString().split("T")[0]
          : "",
      },
      Valid: subscription.valid != null ? subscription.valid.toString() : "98",
      Description: subscription.description,
      Amount: subscription.amount != null ? subscription.amount.toString() : "",
      Features: subscription.features?.join(", ") || "",
      IsActive: subscription.isActive,
    });
    console.log('funcking girl... ', subscription)
    setShowEditModal(true);
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-10">
        <SideNavbar active="Subscriptions" />
      </div>

      <div className="p-6 min-h-screen bg-gray-50 flex-1 md:ml-64 overflow-y-auto space-y-4">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold mb-6">Current Subscription Details</h1>
          <Button
            onClick={() => setShowAddModal(true)}
            variant="outline"
            className="rounded-md px-4"
          >
            Add Subscription
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.length > 0 ? (
            subscriptions.map((subscription, index) => (
              <Card key={index} className="shadow-md rounded-2xl border border-gray-200 space-y-4">
                <CardHeader>
                  <CardTitle>Plan Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-gray-700">
                    <div className="flex justify-between border-b pb-2">
                      <span>Plan Name:</span>
                      <span className="font-medium">{subscription.name}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span>Amount:</span>
                      <span className="font-medium"><b>₹</b>{subscription.amount}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span>Start Date:</span>
                      <span className="font-medium">
                        {subscription.duration?.startingDate
                          ? new Date(subscription.duration.startingDate).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span>End Date:</span>
                      <span className="font-medium">
                        {subscription.duration?.endingDate
                          ? new Date(subscription.duration.endingDate).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                      <span>Active Status:</span>
                      <button
                        onClick={() => handleToggleClick(subscription)}
                        className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${subscription.isActive ? "bg-green-500" : "bg-gray-400"
                          }`}
                      >
                        <motion.div
                          layout
                          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${subscription.isActive ? "translate-x-7" : "translate-x-0"
                            }`}
                        >
                          {loadingId === subscription.id && (
                            <motion.span
                              className="absolute inset-0 flex items-center justify-center"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              <svg
                                className="animate-spin h-3 w-3 text-orange-600"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8v8H4z"
                                ></path>
                              </svg>
                            </motion.span>
                          )}
                        </motion.div>
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Button
                      onClick={() => openEditModal(subscription)}
                      className="bg-orange-600 hover:bg-orange-700 text-white rounded-md px-4"
                    >
                      Upgrade/Downgrade Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            "No data found. Create new Subscription plans"
          )}
        </div>

        {/* Add Subscription Modal */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-xl shadow-lg w-[90%] max-w-md max-h-[90vh] flex flex-col relative"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
              >
                <div className="flex justify-between items-center p-4 border-b ">
                  <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowAddModal(false)}
                  >
                    <X size={20} />
                  </button>
                  <h2 className="text-lg font-semibold">Add Subscription Plan</h2>
                </div>

                <div className="overflow-y-auto p-6 flex-1 space-y-4">
                  <form onSubmit={handleAddSubmit} className="space-y-4">
                    {/* Form fields same as before but using addFormData and handleAddChange */}
                    <div>
                      <label className="block text-sm font-medium mb-1">Plan Name</label>
                      <input
                        type="text"
                        name="Name"
                        value={addFormData.Name}
                        onChange={handleAddChange}
                        className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        placeholder="Enter plan name"

                      />
                      {addErrors.Name && <p className="text-red-500 text-sm mt-1">{addErrors.Name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <select
                        name="Category"
                        value={addFormData.Category}
                        onChange={handleAddChange}
                        className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      >
                        <option value="normal">Normal</option>
                        <option value="premium">Premium</option>
                        <option value="platinum">Platinum</option>
                      </select>
                      {addErrors.Category && <p className="text-red-500 text-sm mt-1">{addErrors.Category}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Start Date</label>
                      <input
                        type="date"
                        name="startingDate"
                        value={addFormData.Duration.startingDate}
                        onChange={handleAddChange}
                        className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-orange-500"

                      />
                      {addErrors.startingDate && <p className="text-red-500 text-sm mt-1">{addErrors.startingDate}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">End Date</label>
                      <input
                        type="date"
                        name="endingDate"
                        value={addFormData.Duration.endingDate}
                        onChange={handleAddChange}
                        className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-orange-500"

                      />
                      {addErrors.endingDate && <p className="text-red-500 text-sm mt-1">{addErrors.endingDate}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Valid (Year)</label>
                      <input
                        type="number"
                        name="Valid"
                        value={addFormData.Valid}
                        onChange={handleAddChange}
                        className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        placeholder="Enter validity (in days)"

                      />
                      {addErrors.Valid && <p className="text-red-500 text-sm mt-1">{addErrors.Valid}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        name="Description"
                        value={addFormData.Description}
                        onChange={handleAddChange}
                        className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        placeholder="Describe this plan"
                        rows={3}
                      />
                      {addErrors.Description && <p className="text-red-500 text-sm mt-1">{addErrors.Description}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Price (₹)</label>
                      <input
                        type="number"
                        name="Amount"
                        value={addFormData.Amount}
                        onChange={handleAddChange}
                        className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        placeholder="Enter price"
                      />
                      {addErrors.Amount && <p className="text-red-500 text-sm mt-1">{addErrors.Amount}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Features (comma separated)</label>
                      <input
                        type="text"
                        name="Features"
                        value={addFormData.Features}
                        onChange={handleAddChange}
                        className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        placeholder="e.g. Priority Support, Extra Storage"
                      />
                      {addErrors.Features && <p className="text-red-500 text-sm mt-1">{addErrors.Features}</p>}
                    </div>

                    <div className="flex justify-center gap-3 mt-6">
                      <Button type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Add Plan"}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        variant="secondary"
                        className="rounded-md"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showEditModal && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-xl shadow-lg w-[90%] max-w-md max-h-[90vh] flex flex-col relative"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
              >
                <div className="flex justify-between items-center p-4 border-b ">
                  <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowEditModal(false)}
                  >
                    <X size={20} />
                  </button>
                  <h2 className="text-lg font-semibold">Update Subscription Plan</h2>
                </div>

                <div className="overflow-y-auto p-6 flex-1 space-y-4">
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    {/* Form fields same as before but using editFormData and handleEditChange */}
                    <div>
                      <label className="block text-sm font-medium mb-1">Plan Name</label>
                      <input
                        type="text"
                        name="Name"
                        value={editFormData.Name}
                        onChange={handleEditChange}
                        className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        placeholder="Enter plan name"
                      />
                      {addErrors.Name && <p className="text-red-500 text-sm mt-1">{addErrors.Name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <select
                        name="Category"
                        value={editFormData.Category}
                        onChange={handleEditChange}
                        className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      >
                        <option value="normal">Normal</option>
                        <option value="premium">Premium</option>
                        <option value="platinum">Platinum</option>
                      </select>
                      {addErrors.Category && <p className="text-red-500 text-sm mt-1">{addErrors.Category}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Start Date</label>
                      <input
                        type="date"
                        name="startingDate"
                        value={editFormData.Duration.startingDate}
                        onChange={handleEditChange}
                        className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                      {addErrors.startingDate && <p className="text-red-500 text-sm mt-1">{addErrors.startingDate}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">End Date</label>
                      <input
                        type="date"
                        name="endingDate"
                        value={editFormData.Duration.endingDate}
                        onChange={handleEditChange}
                        className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                      {addErrors.endingDate && <p className="text-red-500 text-sm mt-1">{addErrors.endingDate}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Valid (Year)</label>
                      <input
                        type="number"
                        name="Valid"
                        value={editFormData.Valid}
                        onChange={handleEditChange}
                        className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        placeholder="Enter validity (in days)"
                      />
                      {addErrors.Valid && <p className="text-red-500 text-sm mt-1">{addErrors.Valid}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        name="Description"
                        value={editFormData.Description}
                        onChange={handleEditChange}
                        className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        placeholder="Describe this plan"
                        rows={3}
                      />
                      {addErrors.Description && <p className="text-red-500 text-sm mt-1">{addErrors.Description}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Price (₹)</label>
                      <input
                        type="number"
                        name="Amount"
                        value={editFormData.Amount}
                        onChange={handleEditChange}
                        className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        placeholder="Enter price"
                      />
                      {addErrors.Amount && <p className="text-red-500 text-sm mt-1">{addErrors.Amount}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Features (comma separated)</label>
                      <input
                        type="text"
                        name="Features"
                        value={editFormData.Features}
                        onChange={handleEditChange}
                        className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        placeholder="e.g. Priority Support, Extra Storage"
                      />
                      {addErrors.Features && <p className="text-red-500 text-sm mt-1">{addErrors.Features}</p>}
                    </div>

                    <div className="flex justify-center gap-3 mt-6">
                      <Button type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Update Plan"}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setShowEditModal(false)}
                        variant="secondary"
                        className="rounded-md"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {showConfirmModal && toggleTarget && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 w-[90%] max-w-sm shadow-lg text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-lg font-semibold mb-3">
                {toggleTarget.isActive
                  ? "Deactivate this plan?"
                  : "Activate this plan?"}
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to{" "}
                <b>{toggleTarget.isActive ? "deactivate" : "activate"}</b> this
                subscription plan?
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={handleConfirmToggle}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  Confirm
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
