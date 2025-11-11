'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import getCroppedImg from '../utils/UserCropImage';
import { IRoom } from '@/app/hotel/rooms/[roomId]/page';
import { ImageCropperModal } from './ImageCropperModal';
import { X, Crop } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';
import ConfirmModal from '../common/ConfirmModal';

interface EditRoomModalProps {
  room: IRoom;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedRoom: any) => void;
}

export default function EditRoomModal({ room, isOpen, onClose, onSave }: EditRoomModalProps) {
  const [formData, setFormData] = useState({
    id: room.id || '',
    RoomNumber: room.RoomNumber || '',
    Description: room.Description || '',
    PricePerNight: room.PricePerNight || '',
    Capacity: room.Capacity || '',
    Facilities: room.Facilities || [],
    Images: room.Images || [],
    reviews: room.reviews || [],
    rating: room.rating || { Average: 0, Count: 0 },
    AvailableCount: room.AvailableCount || 0,
    Status: room.Status || 'Available',
    CreatedAt: room.CreatedAt || '',
    HotelId: room.HotelId || '',
    isBlocked: room.isBlocked || false,
  });

  const [images, setImages] = useState<string[]>(room.Images || []);
  const [croppingImage, setCroppingImage] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setCroppingImage(fileURL);
    }
  };

  const handleCropSave = async () => {
    if (croppingImage && croppedAreaPixels) {
      const cropped = await getCroppedImg(croppingImage, croppedAreaPixels);
      setImages((prev) => [...prev, cropped]);
      setCroppingImage(null);
    }
  };

  const removeImage = async (index: number) => {
    try {
      if (!formData.id) {
        console.error("❌ No room ID found");
        toast.error("Room Is missing!");
        return;
      }

      const { data } = await api.patch(
        `/hotel/rooms/deleteImage/${formData.id}`,
        { index },
        { headers: { "Content-Type": "application/json" } }
      );

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'Facilities'
          ? value.split(',').map((f) => f.trim())
          : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const form = new FormData();

      form.append('id', formData.id);
      form.append('RoomNumber', String(formData.RoomNumber));
      form.append('Description', formData.Description);
      form.append('PricePerNight', String(formData.PricePerNight));
      form.append('Capacity', String(formData.Capacity));
      form.append('Status', formData.Status);
      form.append('isBlocked', String(formData.isBlocked));
      form.append('AvailableCount', String(formData.AvailableCount));

      (formData.Facilities || []).forEach((item: string) => {
        form.append('Facilities[]', item);
      });

      if (formData.reviews) {
        form.append('reviews', JSON.stringify(formData.reviews));
      }

      const allImages = [
        ...(formData.Images || []),
        ...images.filter((img) => !formData.Images?.includes(img)),
      ];

      for (const img of allImages) {
        if (img.startsWith('http')) {
          // Existing URL images (you can still send as strings)
          form.append('Images', img);
        } else {
          // New cropped images as blobs
          const res = await fetch(img);
          const blob = await res.blob();
          form.append('Images', blob, 'room.jpg');
        }
      }

      const { data } = await api.patch(`/hotel/rooms/update/${room.id}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.success) {
        toast.success('Room updated successfully!');
        onClose();
        onSave(data.data);
      } else {
        toast.error('Error updating room!');
      }
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('Something went wrong!');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh]">
          <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
            <X size={18} />
          </button>

          <h2 className="text-xl font-semibold mb-4">Edit Room</h2>

          {/* Form */}
          <div className="grid gap-4">
            <div>
              <Label>Room Number</Label>
              <Input name="RoomNumber" value={formData.RoomNumber} onChange={handleChange} />
            </div>

            <div>
              <Label>Description</Label>
              <Input name="Description" value={formData.Description} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price Per Night</Label>
                <Input name="PricePerNight" value={formData.PricePerNight} onChange={handleChange} />
              </div>
              <div>
                <Label>Capacity</Label>
                <Input name="Capacity" value={formData.Capacity} onChange={handleChange} />
              </div>
            </div>

            <div>
              <Label>Facilities (comma separated)</Label>
              <Input
                name="Facilities"
                value={(formData.Facilities || []).join(', ')}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Status</Label>
              <Input name="Status" value={formData.Status} onChange={handleChange} />
            </div>

            {/* Image Section */}
            <div>
              <Label>Images</Label>
              <div className="flex flex-wrap gap-3 mt-2">
                {images.map((img, index) => (
                  <div key={index} className="relative w-32 h-32">
                    <img src={img} className="w-full h-full object-cover rounded" />
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
                    <button
                      onClick={() => setCroppingImage(img)}
                      className="absolute bottom-1 right-1 bg-black/50 text-white rounded-full p-1"
                    >
                      <Crop size={14} />
                    </button>
                  </div>
                ))}
                <label className="border rounded-md px-4 py-2 cursor-pointer text-sm">
                  + Add Image
                  <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSubmit}>Save Changes</Button>
            </div>
          </div>
        </div>
      </div>

      {croppingImage && (
        <ImageCropperModal
          imagePreview={croppingImage}
          onClose={() => setCroppingImage(null)}
          onSave={(cropped) => setImages((prev) => [...prev, cropped])}
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
    </>
  );
}
