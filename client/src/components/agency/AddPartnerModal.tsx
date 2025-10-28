'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, X } from "lucide-react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/components/utils/cropImage";
import MapComponent from "../Map";
import api from "@/services/api";
import toast from "react-hot-toast";

export default function AddPartnerModal({ onClose, onAdd }: any) {
  const [formData, setFormData] = useState({
    PartnerType: "Hotel",
    PartnerName: "",
    Status: "Pending",
    ContactPerson: "",
    Phone: "",
    Email: "",
    Location: "",
    Coordinates: { lat: 0, lng: 0 },
    Details: [{ AvgPriceRange: 0, Category: "", Description: "", Facilities: [] }],
    Media: {
      LogoPreview: "",
      LogoFile: null as File | null,
      GalleryPreviews: [] as string[],
      GalleryFiles: [] as File[],
    },
  });

  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [currentFileName, setCurrentFileName] = useState<string>("");
  const [pendingGallery, setPendingGallery] = useState<File[]>([]);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState<number>(0);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleLocationSelect = (loc: { lat: number; lng: number; address: string | null }) => {
  setFormData((prev) => ({
    ...prev,
    Location: loc.address || "",
    Coordinates: { lat: loc.lat, lng: loc.lng },
  }));
};


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;

    if (name === "logo") {
      const fileURL = URL.createObjectURL(files[0]);
      setCropSrc(fileURL);
      setCurrentFileName("logo");
    } else if (name === "gallery") {
      const fileArray = Array.from(files);
      setPendingGallery(fileArray);
      setCurrentGalleryIndex(0);
      const firstImage = URL.createObjectURL(fileArray[0]);
      setCropSrc(firstImage);
      setCurrentFileName("gallery");
    }
  };

  const onCropComplete = (_: any, area: any) => setCroppedAreaPixels(area);

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  };

  const handleCropSave = async () => {
    if (!cropSrc || !croppedAreaPixels) return;

    const croppedBlob = await getCroppedImg(cropSrc, croppedAreaPixels);
    if (!croppedBlob) return;

    const croppedFile = new File([croppedBlob], `${currentFileName}-${Date.now()}.jpg`, { type: "image/jpeg" });
    const base64 = await blobToBase64(croppedBlob);

    if (currentFileName === "logo") {
      setFormData((prev) => ({
        ...prev,
        Media: { ...prev.Media, LogoPreview: base64, LogoFile: croppedFile },
      }));
      setCropSrc(null);
    } else if (currentFileName === "gallery") {
      setFormData((prev) => ({
        ...prev,
        Media: {
          ...prev.Media,
          GalleryPreviews: [...prev.Media.GalleryPreviews, base64],
          GalleryFiles: [...prev.Media.GalleryFiles, croppedFile],
        },
      }));

      const nextIndex = currentGalleryIndex + 1;
      if (nextIndex < pendingGallery.length) {
        const nextURL = URL.createObjectURL(pendingGallery[nextIndex]);
        setCurrentGalleryIndex(nextIndex);
        setCropSrc(nextURL);
      } else {
        setCropSrc(null);
        setPendingGallery([]);
        setCurrentGalleryIndex(0);
      }
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      Media: {
        ...prev.Media,
        GalleryPreviews: prev.Media.GalleryPreviews?.filter((_, i) => i !== index),
        GalleryFiles: prev.Media.GalleryFiles?.filter((_, i) => i !== index),
      },
    }));
  };

  const handleSubmit = async () => {
    if (formData.Media.GalleryFiles.length < 2) {
      toast.error("Please upload at least 2 gallery images.");
      return;
    }

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

      if (formData.Media.LogoFile) {
        data.append("Logo", formData.Media.LogoFile);
      }

      formData.Media.GalleryFiles.forEach((file, i) => {
        data.append(`Gallery`, file);
      });

      const res = await api.post("/agency/partner/addPartner", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if(res.data.success){
        toast.success("Partner added successfully!");
      }else{
        toast.error(res.data.message)
      }
      onAdd?.();
      onClose();
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to add partner.");
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

          <label className="text-sm text-gray-600">Select Location</label>
          <MapComponent onLocationSelect={handleLocationSelect} />
          <div className="text-sm text-gray-500 mt-2">
            Selected: {formData.Location || "No location selected"}
          </div>

          {/* Logo Upload */}
          <div>
            <label className="text-sm text-gray-600 block mb-1">Logo</label>
            <Input type="file" name="logo" accept="image/*" onChange={handleFileChange} />
            {formData.Media.LogoPreview && (
              <div className="mt-2">
                <img src={formData.Media.LogoPreview} alt="Logo Preview" className="w-24 h-24 object-cover rounded" />
              </div>
            )}
          </div>

          {/* Gallery Upload */}
          <div>
            <label className="text-sm text-gray-600 block mb-1">Gallery (min 2)</label>
            <Input type="file" name="gallery" multiple accept="image/*" onChange={handleFileChange} />
            {formData.Media.GalleryPreviews.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.Media.GalleryPreviews.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img src={img} alt={`Gallery ${idx}`} className="w-20 h-20 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(idx)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-[2px]"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-blue-600 text-white hover:bg-blue-700" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Add Partner"}
          </Button>
        </div>
      </div>

      {/* Cropper Modal */}
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
              <Button onClick={handleCropSave}>
                {currentFileName === "gallery" && pendingGallery.length > 0
                  ? currentGalleryIndex + 1 < pendingGallery.length
                    ? "Next Image"
                    : "Finish"
                  : "Save Crop"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
