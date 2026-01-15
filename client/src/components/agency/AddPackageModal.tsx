'use client';
import { useEffect, useState } from "react";
import { Button } from "@/components/shared/ui/button";
import { Input } from "@/components/shared/ui/input";
import { Textarea } from "@/components/shared/ui/textarea";
import { Loader2, X, ImagePlus } from "lucide-react";
import { AGENCY_API_METHODS } from '@/services/APIs/agency.api.service';
import toast from "react-hot-toast";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/components/utils/UserCropImage";

export default function AddPackageModal({ onClose, onAdd, setPackages }: any) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [images, setImages] = useState<string[]>([]);
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

  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [profileLoad, setProfileLoad] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    if (images.length + files.length > 5) {
      toast.error("You can upload up to 5 images only.");
      return;
    }

    const file = files[0];
    const imageUrl = URL.createObjectURL(file);
    setCurrentImage(imageUrl);
    setIsCropping(true);
  };

  const handleCropComplete = async () => {
    try {
      setProfileLoad(true);
      const croppedImage = await getCroppedImg(currentImage!, croppedAreaPixels);
      setImages((prev) => [...prev, croppedImage]);
      toast.success("Image cropped successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to crop image.");
    } finally {
      setProfileLoad(false);
      setIsCropping(false);
      setCurrentImage(null);
    }
  };

  const handleDeleteImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddDiscovery = () =>
    setFormData((prev) => ({ ...prev, discoveries: [...prev.discoveries, ""] }));

  const handleDiscoveryChange = (index: number, value: string) => {
    const updated = [...formData.discoveries];
    updated[index] = value;
    setFormData({ ...formData, discoveries: updated });
  };

  const handleAddFood = () =>
    setFormData((prev) => ({ ...prev, availableFoods: [...prev.availableFoods, ""] }));

  const handleFoodChange = (index: number, value: string) => {
    const updated = [...formData.availableFoods];
    updated[index] = value;
    setFormData({ ...formData, availableFoods: updated });
  };

  const handleAddItinerary = () =>
    setFormData((prev) => ({
      ...prev,
      itinerary: [...prev.itinerary, { day: prev.itinerary.length + 1, title: "", activities: [""] }],
    }));

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Package title is required";
    if (!formData.duration.trim()) newErrors.duration = "Duration is required";
    if (!formData.price.trim()) newErrors.price = "Price is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (images.length === 0) newErrors.images = "At least one image is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill all required fields");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("duration", formData.duration);
      form.append("price", formData.price);
      form.append("description", formData.description);
      form.append("discoveries", JSON.stringify(formData.discoveries));
      form.append("availableFoods", JSON.stringify(formData.availableFoods));
      form.append("itinerary", JSON.stringify(formData.itinerary));

      for (const img of images) {
        const res = await fetch(img);
        const blob = await res.blob();
        form.append("images", blob, "package.jpg");
      }

      for (let i of form) {
        console.log(i)
      }
      const res = await AGENCY_API_METHODS.create(form);

      if (res.data.success) {
        toast.success("Package added successfully!");
        setPackages(res.data.data);
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
          <Input name="title" placeholder="Package Title" onChange={handleChange} value={formData.title} />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

          <Input name="duration" placeholder="Duration (e.g. 5 Days)" onChange={handleChange} value={formData.duration} />
          {errors.duration && <p className="text-red-500 text-sm">{errors.duration}</p>}

          <Input name="price" placeholder="Price" type="number" onChange={handleChange} value={formData.price} />
          {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}

          <Textarea name="description" placeholder="Description" onChange={handleChange} value={formData.description} />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

          {/* ✅ Image Upload */}
          <div>
            <label className="text-sm font-medium text-gray-700">Images (Max 5)</label>
            <div className="flex flex-wrap gap-3 mt-2">
              {images.map((img, index) => (
                <div key={index} className="relative w-24 h-24">
                  <img src={img} alt="preview" className="w-full h-full object-cover rounded-md border" />
                  <button
                    onClick={() => handleDeleteImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <label className="border rounded-md w-24 h-24 flex flex-col items-center justify-center cursor-pointer text-gray-500">
                  <ImagePlus size={20} />
                  <span className="text-xs">Add</span>
                  <input type="file" hidden accept="image/*" multiple={false} onChange={handleFileChange} />
                </label>
              )}
            </div>
            {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
          </div>

          {/* ✅ Discoveries */}
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

      {/* 🖼️ Cropper Modal */}
      {isCropping && (
        <div className="fixed inset-0 bg-black/60 flex flex-col items-center justify-center z-50">
          <div className="relative bg-white rounded-2xl w-[90%] max-w-lg h-[500px] overflow-hidden">
            <Cropper
              image={currentImage || ""}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              cropShape="rect"
              showGrid={true}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
            />

            <div className="absolute bottom-20 left-0 right-0 flex justify-center">
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-2/3"
              />
            </div>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
              <button
                onClick={() => setIsCropping(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCropComplete}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
              >
                {profileLoad ? (
                  <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Save Crop"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
