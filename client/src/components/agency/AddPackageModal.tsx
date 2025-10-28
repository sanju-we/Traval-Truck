'use client';
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Loader2 } from "lucide-react";
import api from "@/services/api";
import toast from "react-hot-toast";

export default function AddPackageModal({ onClose, onAdd }: any) {
  const [loading, setLoading] = useState(false);
  const [partners, setPartners] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    duration: "",
    price: "",
    description: "",
    hotels: [] as string[], // store ObjectIds
    dining: [] as string[], // store ObjectIds
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

  // ✅ Fetch all partners
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await api.get("/agency/partner/getAllPartners");
        if (res.data.success) setPartners(res.data.partners);
      } catch (error) {
        console.error("Failed to load partners:", error);
        toast.error("Failed to load partners");
      }
    };
    fetchPartners();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      const arr = prev[name as keyof typeof formData] as string[];
      return {
        ...prev,
        [name]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });
  };

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

  const handleAddItinerary = () => {
    setFormData((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        { day: prev.itinerary.length + 1, title: "", activities: [""] },
      ],
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await api.post("/agency/package/addPackage", formData);
      if (res.data.success) {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4">Add New Package</h2>

        <div className="space-y-3">
          <Input name="title" placeholder="Package Title" onChange={handleChange} />
          <Input name="duration" placeholder="Duration (e.g. 5 Days)" onChange={handleChange} />
          <Input name="price" placeholder="Price" type="number" onChange={handleChange} />
          <Textarea name="description" placeholder="Description" onChange={handleChange} />

          {/* ✅ Select Hotels */}
          <div>
            <label className="text-sm text-gray-600">Select Hotels (Partners)</label>
            <div className="border rounded-md p-2 max-h-32 overflow-y-auto">
              {partners
                .filter((p) => p.PartnerType === "Hotel")
                .map((partner) => (
                  <div key={partner._id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.hotels.includes(partner._id)}
                      onChange={() => handleSelectChange("hotels", partner._id)}
                    />
                    <span>{partner.PartnerName}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* ✅ Select Dining */}
          <div>
            <label className="text-sm text-gray-600">Select Dining (Partners)</label>
            <div className="border rounded-md p-2 max-h-32 overflow-y-auto">
              {partners
                .filter((p) => p.PartnerType === "Restaurant")
                .map((partner) => (
                  <div key={partner._id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.dining.includes(partner._id)}
                      onChange={() => handleSelectChange("dining", partner._id)}
                    />
                    <span>{partner.PartnerName}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* ✅ Discoveries */}
          <div>
            <label className="text-sm text-gray-600">Discoveries</label>
            {formData.discoveries.map((item, index) => (
              <Input
                key={index}
                value={item}
                onChange={(e) => handleDiscoveryChange(index, e.target.value)}
                placeholder={`Discovery ${index + 1}`}
                className="mb-2"
              />
            ))}
            <Button variant="outline" onClick={handleAddDiscovery}>
              Add Discovery
            </Button>
          </div>

          {/* ✅ Itinerary */}
          <div>
            <label className="text-sm text-gray-600">Itinerary</label>
            {formData.itinerary.map((dayItem, i) => (
              <div key={i} className="border p-2 rounded mb-2">
                <p className="font-semibold">Day {dayItem.day}</p>
                <Input
                  placeholder="Title"
                  value={dayItem.title}
                  onChange={(e) => {
                    const updated = [...formData.itinerary];
                    updated[i].title = e.target.value;
                    setFormData({ ...formData, itinerary: updated });
                  }}
                />
              </div>
            ))}
            <Button variant="outline" onClick={handleAddItinerary}>
              Add Day
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-blue-600 text-white hover:bg-blue-700" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Add Package"}
          </Button>
        </div>
      </div>
    </div>
  );
}
