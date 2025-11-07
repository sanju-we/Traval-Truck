'use client';
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import api from "@/services/api";
import toast from "react-hot-toast";

export default function AddPackageModal({ onClose, onAdd, setPackages }: any) {
  const [loading, setLoading] = useState(false);
  const [partners, setPartners] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    title: "",
    duration: "",
    price: "",
    description: "",
    discoveries: [] as string[],
    availableFoods: [] as string[],
    itinerary: [
      {
        day: 1,
        title: "",
        activities: [""],
      },
    ],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error on change
  };


  // ✅ Add discovery
  const handleAddDiscovery = () => {
    setFormData((prev) => ({
      ...prev,
      discoveries: [...prev.discoveries, ""],
    }));
  };

  const handleDiscoveryChange = (index: number, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.discoveries];
      updated[index] = value;
      return { ...prev, discoveries: updated };
    });
  };

  // ✅ Add food
  const handleAddFood = () => {
    setFormData((prev) => ({
      ...prev,
      availableFoods: [...prev.availableFoods, ""],
    }));
  };

  const handleFoodChange = (index: number, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.availableFoods];
      updated[index] = value;
      return { ...prev, availableFoods: updated };
    });
  };

  // ✅ Add itinerary day
  const handleAddItinerary = () => {
    setFormData((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        { day: prev.itinerary.length + 1, title: "", activities: [""] },
      ],
    }));
  };

  // ✅ Validate inputs before submit
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Package title is required";
    if (!formData.duration.trim()) newErrors.duration = "Duration is required";
    if (!formData.price.trim()) newErrors.price = "Price is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill all required fields");
      return false;
    }
    return true;
  };

  // ✅ Submit form
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await api.post("/agency/package/addPackage", formData);
      if (res.data.success) {
        setPackages(res.data.data)
        toast.success("Package added successfully!");
        onAdd?.();
        onClose();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Failed to add package:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4">Add New Package</h2>

        <div className="space-y-3">
          <div>
            <Input
              name="title"
              placeholder="Package Title"
              onChange={handleChange}
              value={formData.title}
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          </div>

          <div>
            <Input
              name="duration"
              placeholder="Duration (e.g. 5 Days)"
              onChange={handleChange}
              value={formData.duration}
            />
            {errors.duration && <p className="text-red-500 text-sm">{errors.duration}</p>}
          </div>

          <div>
            <Input
              name="price"
              placeholder="Price"
              type="number"
              onChange={handleChange}
              value={formData.price}
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
          </div>

          <div>
            <Textarea
              name="description"
              placeholder="Description"
              onChange={handleChange}
              value={formData.description}
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Discoveries</label>
            {formData.discoveries.map((item, index) => (
              <Input
                key={index}
                value={item}
                onChange={(e) => handleDiscoveryChange(index, e.target.value)}
                placeholder={`Discovery ${index + 1}`}
                className="mt-2"
              />
            ))}
            <Button variant="outline" onClick={handleAddDiscovery} className="mt-2">
              + Add Discovery
            </Button>
          </div>

          {/* ✅ Available Foods */}
          <div>
            <label className="text-sm font-medium text-gray-700">Available Foods</label>
            {formData.availableFoods.map((item, index) => (
              <Input
                key={index}
                value={item}
                onChange={(e) => handleFoodChange(index, e.target.value)}
                placeholder={`Food Item ${index + 1}`}
                className="mt-2"
              />
            ))}
            <Button variant="outline" onClick={handleAddFood} className="mt-2">
              + Add Food
            </Button>
          </div>

          {/* ✅ Itinerary */}
          <div>
            <label className="text-sm font-medium text-gray-700">Itinerary</label>
            {formData.itinerary.map((dayItem, i) => (
              <div key={i} className="border p-3 rounded-md bg-gray-50 mt-2">
                <p className="font-semibold mb-1">Day {dayItem.day}</p>
                <Input
                  placeholder="Title"
                  value={dayItem.title}
                  onChange={(e) => {
                    const updated = [...formData.itinerary];
                    updated[i].title = e.target.value;
                    setFormData({ ...formData, itinerary: updated });
                  }}
                  className="mb-2"
                />
                <label className="text-sm text-gray-600">Activities</label>
                {dayItem.activities.map((activity, j) => (
                  <div key={j} className="flex gap-2 mb-2">
                    <Input
                      value={activity}
                      placeholder={`Activity ${j + 1}`}
                      onChange={(e) => {
                        const updated = [...formData.itinerary];
                        updated[i].activities[j] = e.target.value;
                        setFormData({ ...formData, itinerary: updated });
                      }}
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        const updated = [...formData.itinerary];
                        updated[i].activities.splice(j, 1);
                        setFormData({ ...formData, itinerary: updated });
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => {
                    const updated = [...formData.itinerary];
                    updated[i].activities.push("");
                    setFormData({ ...formData, itinerary: updated });
                  }}
                >
                  + Add Activity
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={handleAddItinerary} className="mt-3">
              + Add Day
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 text-white hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Add Package"}
          </Button>
        </div>
      </div>
    </div>
  );
}
