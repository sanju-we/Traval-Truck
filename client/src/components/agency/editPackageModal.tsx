'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ImagePlus, X } from 'lucide-react';
import { AGENCY_API_METHODS } from '@/services/APIs/agency.api.service';
import toast from 'react-hot-toast';
import { ImageCropperModal } from '../hotel/ImageCropperModal';
import ConfirmModal from '@/components/common/ConfirmModal';

interface ItineraryItem {
  day: number;
  title: string;
  activities: string[];
}

interface EditPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  pkg: any;
}

export default function EditPackageModal({
  isOpen,
  onClose,
  onUpdate,
  pkg,
}: EditPackageModalProps) {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [croppingImage, setCroppingImage] = useState<string | null>(null);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    duration: '',
    price: '',
    description: '',
    discoveries: [] as string[],
    availableFoods: [] as string[],
    itinerary: [{ day: 1, title: '', activities: [''] }],
  });

  useEffect(() => {
    if (pkg) {
      setFormData({
        id: pkg.id || '',
        title: pkg.title || '',
        duration: pkg.duration || '',
        price: String(pkg.price || ''),
        description: pkg.description || '',
        discoveries: pkg.discoveries || [],
        availableFoods: pkg.availableFoods || [],
        itinerary:
          pkg.itinerary && pkg.itinerary.length
            ? pkg.itinerary
            : [{ day: 1, title: '', activities: [''] }],
      });
      setImages(pkg.images || []);
    }
  }, [pkg]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!files.length) return;

    if (images.length + files.length > 5) {
      toast.error('You can upload up to 5 images only.');
      return;
    }

    setPendingFiles(files);
    const fileURL = URL.createObjectURL(files[0]);
    setCroppingImage(fileURL);
  };

  const handleCropSave = (croppedImage: string) => {
    setImages((prev) => [...prev, croppedImage]);
    setCroppingImage(null);

    if (pendingFiles.length > 1) {
      const nextFiles = [...pendingFiles];
      nextFiles.shift();
      setPendingFiles(nextFiles);
      const nextFileURL = URL.createObjectURL(nextFiles[0]);
      setCroppingImage(nextFileURL);
    } else {
      setPendingFiles([]);
    }
  };

  const removeImage = async (index: number) => {
    try {
      if (!formData.id) {
        console.error("❌ No package ID found");
        toast.error("Package Is missing!");
        return;
      }

      const { data } = await AGENCY_API_METHODS.deletePackageImage(formData.id, { index });

      console.log("🟢 Response:", data);

      if (data.success) {
        toast.success("Image deleted successfully!");
        setImages((prev) => prev.filter((_, i) => i !== index));
      } else {
        toast.error(data.message || "Failed to delete image");
      }
    } catch (error: any) {
      console.error("🔥 Delete image error:", error.response || error);
      toast.error("Something went wrong while deleting image");
    }
  };


  // ✅ Add / Edit Discoveries
  const handleAddDiscovery = () => {
    setFormData((prev) => ({
      ...prev,
      discoveries: [...prev.discoveries, ''],
    }));
  };

  const handleDiscoveryChange = (index: number, value: string) => {
    const updated = [...formData.discoveries];
    updated[index] = value;
    setFormData({ ...formData, discoveries: updated });
  };

  // ✅ Add / Edit Foods
  const handleAddFood = () => {
    setFormData((prev) => ({
      ...prev,
      availableFoods: [...prev.availableFoods, ''],
    }));
  };

  const handleFoodChange = (index: number, value: string) => {
    const updated = [...formData.availableFoods];
    updated[index] = value;
    setFormData({ ...formData, availableFoods: updated });
  };

  // ✅ Add / Edit Itinerary
  const handleAddDay = () => {
    setFormData((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        { day: prev.itinerary.length + 1, title: '', activities: [''] },
      ],
    }));
  };

  const handleAddActivity = (dayIndex: number) => {
    const updated = [...formData.itinerary];
    updated[dayIndex].activities.push('');
    setFormData({ ...formData, itinerary: updated });
  };

  const handleActivityChange = (dayIndex: number, actIndex: number, value: string) => {
    const updated = [...formData.itinerary];
    updated[dayIndex].activities[actIndex] = value;
    setFormData({ ...formData, itinerary: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('duration', formData.duration);
      form.append('price', formData.price);
      form.append('description', formData.description);
      form.append('discoveries', JSON.stringify(formData.discoveries));
      form.append('availableFoods', JSON.stringify(formData.availableFoods));
      form.append('itinerary', JSON.stringify(formData.itinerary));

      for (const img of images) {
        if (img.startsWith('http')) {
          form.append('images', img);
        } else {
          const res = await fetch(img);
          const blob = await res.blob();
          form.append('newImages', blob, 'package.jpg');
        }
      }
      for (let i of form) {
        console.log(i)
      }
      const res = await AGENCY_API_METHODS.editPackage(pkg.id, form);

      if (res.data.success) {
        toast.success('Package updated successfully!');
        onUpdate();
        onClose();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error('Error updating package:', error);
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white rounded-2xl shadow-xl w-[90%] max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>

            <h2 className="text-xl font-semibold text-center mb-4">Edit Package</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic Info */}
              <Input name="title" placeholder="Package Title" value={formData.title} onChange={handleChange} />
              <Input name="duration" placeholder="Duration (e.g. 3 Days)" value={formData.duration} onChange={handleChange} />
              <Input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} />
              <Textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />

              {/* Discoveries */}
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

              {/* Available Foods */}
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

              {/* Itinerary */}
              <div>
                <label className="text-sm font-medium text-gray-700">Itinerary</label>
                {formData.itinerary.map((day, i) => (
                  <div key={i} className="border p-3 rounded-md bg-gray-50 mt-2">
                    <p className="font-semibold mb-2">Day {day.day}</p>
                    <Input
                      value={day.title}
                      onChange={(e) => {
                        const updated = [...formData.itinerary];
                        updated[i].title = e.target.value;
                        setFormData({ ...formData, itinerary: updated });
                      }}
                      placeholder="Title"
                    />
                    {day.activities.map((act, j) => (
                      <Input
                        key={j}
                        value={act}
                        placeholder={`Activity ${j + 1}`}
                        onChange={(e) => handleActivityChange(i, j, e.target.value)}
                        className="mt-2"
                      />
                    ))}
                    <Button variant="outline" onClick={() => handleAddActivity(i)} className="mt-2">
                      + Add Activity
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={handleAddDay} className="mt-2">
                  + Add Day
                </Button>
              </div>

              {/* Images */}
              <div>
                <label className="text-sm font-medium text-gray-700">Images (Max 5)</label>
                <div className="flex flex-wrap gap-3 mt-2">
                  {images.map((img, index) => (
                    <div key={index} className="relative w-24 h-24">
                      <img src={img} className="w-full h-full object-cover rounded-md border" />
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteIndex(index);
                          setShowConfirm(true);
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <label className="border rounded-md w-24 h-24 flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:bg-gray-50">
                      <ImagePlus size={22} />
                      <span className="text-xs">Upload</span>
                      <input type="file" hidden accept="image/*" multiple onChange={handleFileChange} />
                    </label>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="bg-emerald-500 text-white hover:bg-emerald-600">
                  {loading ? <Loader2 className="animate-spin" size={18} /> : 'Save Changes'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Cropper */}
      {croppingImage && (
        <ImageCropperModal
          imagePreview={croppingImage}
          onClose={() => setCroppingImage(null)}
          onSave={handleCropSave}
        />
      )}
      {showConfirm && deleteIndex !== null && (
        <ConfirmModal
          show={showConfirm}
          title="Delete Image?"
          description="Are you sure you want to permanently delete this image from the package?"
          onConfirm={async () => {
            await removeImage(deleteIndex);
            setShowConfirm(false);
            setDeleteIndex(null);
          }}
          onCancel={() => {
            setShowConfirm(false);
            setDeleteIndex(null);
          }}
        />
      )}
    </AnimatePresence>
  );
}
