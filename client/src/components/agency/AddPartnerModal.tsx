'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/components/utils/cropImage";
import MapComponent from "../Map";

export default function AddPartnerModal({ onClose, onAdd }: any) {
  const [formData, setFormData] = useState({
    PartnerType: "Hotel",
    PartnerName: "",
    Status: "Pending",
    ContactPerson: "",
    Phone: "",
    Email: "",
    Location: "",
    Coordinates: { lat: null as number | null, lng: null as number | null },
    Details: [{ AvgPriceRange: 0, Category: "", Description: "", Facilities: [] }],
    Media: { Gallery: [] as string[], Logo: "" },
  });

  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [currentFileName, setCurrentFileName] = useState<string>("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 🧭 Map location select handler
  const handleLocationSelect = (locationData: { lat: number; lng: number; address: string }) => {
    setFormData((prev) => ({
      ...prev,
      Location: locationData.address,
      Coordinates: { lat: locationData.lat, lng: locationData.lng },
    }));
  };

  // 📸 File input change → open cropper modal
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      const fileURL = URL.createObjectURL(file);
      setCropSrc(fileURL);
      setCurrentFileName(name); // 'logo' or 'gallery'
    }
  };

  // ✂️ Crop complete callback
  const onCropComplete = (_: any, croppedArea: any) => {
    setCroppedAreaPixels(croppedArea);
  };

  // ✅ Save cropped image
  const handleCropSave = async () => {
    if (!cropSrc || !croppedAreaPixels) return;

    const croppedBlob = await getCroppedImg(cropSrc, croppedAreaPixels);
    if (!croppedBlob) return;

    // Convert Blob → Base64 string
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(croppedBlob);
    });

    setFormData((prev) => {
      if (currentFileName === "logo") {
        return {
          ...prev,
          Media: { ...prev.Media, Logo: base64 },
        };
      } else if (currentFileName === "gallery") {
        return {
          ...prev,
          Media: { ...prev.Media, Gallery: [...prev.Media.Gallery, base64] },
        };
      }
      return prev;
    });

    setCropSrc(null); // close crop modal
    setCurrentFileName("");
  };

  // 🚀 Submit handler
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = new FormData();
      data.append("PartnerType", formData.PartnerType);
      data.append("PartnerName", formData.PartnerName);
      data.append("Status", formData.Status);
      data.append("ContactPerson", formData.ContactPerson);
      data.append("Phone", formData.Phone);
      data.append("Email", formData.Email);
      data.append("Location", formData.Location);
      data.append("Coordinates", JSON.stringify(formData.Coordinates));
      data.append("Details", JSON.stringify(formData.Details));
      data.append("Media", JSON.stringify(formData.Media)); // base64 cropped images

      await axios.post("/api/partners", data);
      onAdd();
      onClose();
    } catch (error) {
      console.error("❌ Failed to add partner:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4">Add Partner</h2>

        <div className="space-y-3">
          <select
            name="PartnerType"
            value={formData.PartnerType}
            onChange={(e) => setFormData({ ...formData, PartnerType: e.target.value })}
            className="border rounded-md p-2 w-full"
          >
            <option value="Hotel">Hotel</option>
            <option value="Restaurant">Restaurant</option>
          </select>

          <Input name="PartnerName" placeholder="Partner Name" onChange={(e) => setFormData({ ...formData, PartnerName: e.target.value })} />
          <Input name="ContactPerson" placeholder="Contact Person" onChange={(e) => setFormData({ ...formData, ContactPerson: e.target.value })} />
          <Input name="Email" placeholder="Email" onChange={(e) => setFormData({ ...formData, Email: e.target.value })} />
          <Input name="Phone" placeholder="Phone" onChange={(e) => setFormData({ ...formData, Phone: e.target.value })} />

          {/* 🌍 Google Map Integration */}
          <label className="text-sm text-gray-600">Select Location</label>
          <MapComponent onLocationSelect={handleLocationSelect} />
          <div className="text-sm text-gray-500 mt-2">
            Selected: {formData.Location || "No location selected"}
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">Logo</label>
            <Input type="file" name="logo" accept="image/*" onChange={handleFileChange} />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">Gallery</label>
            <Input type="file" name="gallery" multiple accept="image/*" onChange={handleFileChange} />
          </div>

          {/* Preview cropped images */}
          {formData.Media.Logo && (
            <img src={formData.Media.Logo} alt="Logo Preview" className="w-24 h-24 object-cover rounded mt-2" />
          )}
          {formData.Media.Gallery.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.Media.Gallery.map((img, idx) => (
                <img key={idx} src={img} alt={`Gallery ${idx}`} className="w-20 h-20 object-cover rounded" />
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-blue-600 text-white hover:bg-blue-700" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Add Partner"}
          </Button>
        </div>
      </div>

      {/* 🖼️ Cropper Modal */}
      {cropSrc && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-[90%] max-w-md relative">
            <div className="relative w-full h-80">
              <Cropper
                image={cropSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <Button variant="outline" onClick={() => setCropSrc(null)}>Cancel</Button>
              <Button onClick={handleCropSave}>Save Crop</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
