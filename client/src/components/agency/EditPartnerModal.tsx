import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Loader2 } from "lucide-react";

export default function EditPartnerModal({ partner, onClose, onUpdate }: any) {
  const [formData, setFormData] = useState(partner);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.put(`/api/partners/${partner._id}`, formData);
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4">Edit Partner</h2>

        <div className="space-y-3">
          <Input
            name="PartnerName"
            placeholder="Partner Name"
            value={formData.PartnerName}
            onChange={handleChange}
          />
          <Input
            name="ContactPerson"
            placeholder="Contact Person"
            value={formData.ContactPerson}
            onChange={handleChange}
          />
          <Input
            name="Email"
            placeholder="Email"
            value={formData.Email}
            onChange={handleChange}
          />
          <Input
            name="Location"
            placeholder="Location"
            value={formData.Location}
            onChange={handleChange}
          />
          <Input
            name="Phone"
            placeholder="Phone Number"
            value={formData.Phone}
            onChange={handleChange}
          />
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
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
