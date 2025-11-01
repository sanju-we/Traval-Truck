'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, X } from "lucide-react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/components/utils/cropImage";
import api from "@/services/api";
import toast from "react-hot-toast";

export default function AddRoomModal({ onClose, onAdd, rooms }: any) {
  const [formData, setFormData] = useState({
    roomNumber: "",
    roomType: "",
    price: "",
    capacity: "",
    description: "",
    amenities: [""],
    images: [] as File[],
    imagePreviews: [] as string[],
  });

  const [loading, setLoading] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [pendingImages, setPendingImages] = useState<File[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAmenity = () => {
    setFormData((prev) => ({ ...prev, amenities: [...prev.amenities, ""] }));
  };

  const handleAmenityChange = (index: number, value: string) => {
    const updated = [...formData.amenities];
    updated[index] = value;
    setFormData({ ...formData, amenities: updated });
  };

  const handleRemoveAmenity = (index: number) => {
    const updated = formData.amenities.filter((_, i) => i !== index);
    setFormData({ ...formData, amenities: updated });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    setPendingImages(fileArray);
    setCurrentImageIndex(0);
    const firstImage = URL.createObjectURL(fileArray[0]);
    setCropSrc(firstImage);
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

    const croppedFile = new File([croppedBlob], `room-${Date.now()}.jpg`, { type: "image/jpeg" });
    const base64 = await blobToBase64(croppedBlob);

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, croppedFile],
      imagePreviews: [...prev.imagePreviews, base64],
    }));

    const nextIndex = currentImageIndex + 1;
    if (nextIndex < pendingImages.length) {
      const nextURL = URL.createObjectURL(pendingImages[nextIndex]);
      setCurrentImageIndex(nextIndex);
      setCropSrc(nextURL);
    } else {
      setCropSrc(null);
      setPendingImages([]);
      setCurrentImageIndex(0);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.roomNumber || !formData.price || formData.images.length === 0) {
      toast.error("Please fill all required fields and upload at least one image.");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("RoomNumber", formData.roomNumber);
      data.append("roomType", formData.roomType);
      data.append("PricePerNight", formData.price);
      data.append("Capacity", formData.capacity);
      data.append("Description", formData.description);
      data.append("Facilities", JSON.stringify(formData.amenities));

      formData.images.forEach((img) => {
        data.append("images", img);
      });
      console.log(formData)
      const res = await api.post("/hotel/rooms/addRooms", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Room added successfully!");
        rooms((prev: any)=>[...prev,res.data.data])
        onAdd?.();
        onClose();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error("Failed to add room:", err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4">Add Room</h2>

        <div className="space-y-3">
          <Input name="roomNumber" placeholder="Room Number" value={formData.roomNumber} onChange={handleChange} />
          <Input name="roomType" placeholder="Room Type (e.g. Deluxe, Suite)" value={formData.roomType} onChange={handleChange} />
          <Input name="price" placeholder="Price per night" type="number" value={formData.price} onChange={handleChange} />
          <Input name="capacity" placeholder="Capacity (e.g. 2 Adults, 1 Kid)" value={formData.capacity} onChange={handleChange} />
          <Textarea name="description" placeholder="Room Description" value={formData.description} onChange={handleChange} />

          <div>
            <label className="text-sm text-gray-700 font-medium">Amenities</label>
            {formData.amenities.map((item, index) => (
              <div key={index} className="flex gap-2 mt-2">
                <Input
                  value={item}
                  placeholder={`Amenity ${index + 1}`}
                  onChange={(e) => handleAmenityChange(index, e.target.value)}
                />
                <Button variant="outline" onClick={() => handleRemoveAmenity(index)}>
                  Remove
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={handleAddAmenity} className="mt-2">
              + Add Amenity
            </Button>
          </div>

          {/* ✅ Image upload */}
          <div>
            <label className="text-sm text-gray-700 font-medium">Upload Images</label>
            <Input type="file" multiple accept="image/*" onChange={handleFileChange} />
            {formData.imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.imagePreviews.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img src={img} alt={`Room ${idx}`} className="w-20 h-20 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
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
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Add Room"}
          </Button>
        </div>
      </div>

      {/* ✅ Cropper modal */}
      {cropSrc && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-[90%] max-w-md relative">
            <div className="relative w-full h-80">
              <Cropper
                image={cropSrc}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <Button variant="outline" onClick={() => setCropSrc(null)}>Cancel</Button>
              <Button onClick={handleCropSave}>
                {pendingImages.length > 0 && currentImageIndex + 1 < pendingImages.length
                  ? "Next Image"
                  : "Finish"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
