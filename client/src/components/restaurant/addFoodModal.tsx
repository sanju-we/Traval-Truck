'use client';

import { useState, useEffect } from 'react';
import { X, Crop } from 'lucide-react';
import { Button } from '@/components/shared/ui/button';
import { Input } from '@/components/shared/ui/input';
import { Label } from '@/components/shared/ui/label';
import { ImageCropperModal } from './ImagesCroperModalForRestaurant';
import { RESTAURANT_API_METHODS } from '@/services/APIs/restaurant.api.service';
import toast from 'react-hot-toast';

export interface FoodData {
  id: string;
  Restaurant: string;
  name: string;
  price: number | string;
  availableQuantity: number | string;
  category: string;
  description: string;
  images: string[];
  status: string;
}

interface FoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (food: FoodData) => void;
  editingFood?: FoodData | null;
}

export default function FoodModal({ isOpen, onClose, onSave, editingFood }: FoodModalProps) {
  const [formData, setFormData] = useState<FoodData>({
    id: editingFood?.id || '',
    Restaurant: '',
    name: editingFood?.name || '',
    price: editingFood?.price || '',
    availableQuantity: editingFood?.availableQuantity || '',
    category: editingFood?.category || '',
    description: editingFood?.description || '',
    images: editingFood?.images || [],
    status: editingFood?.status || ''
  });
  console.log('editingFood:', editingFood)

  const [images, setImages] = useState<string[]>(formData.images || []);
  const [croppingImage, setCroppingImage] = useState<string | null>(null);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, images }));
  }, [images]);

  useEffect(() => {
    if (editingFood) {
      setFormData(editingFood);
      setImages(editingFood.images || []);
    } else {
      setFormData({
        id: '',
        Restaurant: '',
        name: '',
        price: '',
        availableQuantity: '',
        category: '',
        description: '',
        images: [],
        status: ''
      });
      setImages([]);
    }
  }, [editingFood]);


  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    if (images.length + files.length > 10) {
      toast.error('You can upload up to 10 images only.');
      return;
    }

    setPendingFiles(files);
    const fileURL = URL.createObjectURL(files[0]);
    setCroppingImage(fileURL);
  };

  const handleCropSave = async (croppedImage: string) => {
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
  }

  const handleDeleteImage = async (index: number) => {
    if(!editingFood) return 
    const data = await RESTAURANT_API_METHODS.DeleteImage(index,editingFood?.id);
    if(data.success){
      setImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price) {
      toast.error('Please fill all required fields.');
      return;
    }

    try {
      setLoading(true);

      const form = new FormData();

      form.append('id', editingFood ? editingFood.id : '')
      form.append('Name', formData.name);
      form.append('Price', String(formData.price));
      form.append('AvailableQuantity', String(formData.availableQuantity));
      form.append('Category', formData.category);
      form.append('Description', formData.description);
      form.append('Status', formData.status);

      for (const img of images) {
        if (img.startsWith('data:image')) {
          const res = await fetch(img);
          const blob = await res.blob();
          form.append('Image', blob, 'food.jpg');
        } else {
          form.append('ExistingImages[]', img);
        }
      }

      let data;
      if (!editingFood) {
        console.log(form)
        data = await RESTAURANT_API_METHODS.create(form)
      } else {
        data = await RESTAURANT_API_METHODS.editFood(form)
      }

      if (data.success) {
        toast.success(editingFood ? 'Food item updated!' : 'Food item added!');
        onSave(data.data);
        onClose();
      } else {
        toast.error(data.message || 'Failed to save food item.');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh]">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          >
            <X size={18} />
          </button>

          <h2 className="text-xl font-semibold mb-4">
            {editingFood ? 'Edit Food Item' : 'Add New Food'}
          </h2>

          {/* Form */}
          <div className="space-y-3">
            <div>
              <Label>Name</Label>
              <Input name="name" value={formData.name} onChange={handleChange} />
            </div>

            <div>
              <Label>Description</Label>
              <Input name="description" value={formData.description} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Price</Label>
                <Input name="price" type="number" value={formData.price} onChange={handleChange} />
              </div>
              <div>
                <Label>Available Quantity</Label>
                <Input
                  name="availableQuantity"
                  type="number"
                  value={formData.availableQuantity}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label>Category</Label>
              <Input name="category" value={formData.category} onChange={handleChange} />
            </div>
            <div>
              <Label>Status</Label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="border rounded-md w-full p-2"
              >
                <option value="">Select Status</option>
                <option value="Available">Available</option>
                <option value="Finish">Finish</option>
              </select>
            </div>


            <div>
              <Label>Images (Max 10)</Label>
              <div className="flex flex-wrap gap-3 mt-2">
                {images.map((img, index) => (
                  <div key={index} className="relative w-28 h-28">
                    <img src={img} className="w-full h-full object-cover rounded-md" />
                    <button
                      onClick={() => handleDeleteImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={12} />
                    </button>
                    <button
                      onClick={() => setCroppingImage(img)}
                      className="absolute bottom-1 right-1 bg-black/50 text-white rounded-full p-1"
                    >
                      <Crop size={12} />
                    </button>
                  </div>
                ))}
                {images.length < 10 && (
                  <label className="border rounded-md px-4 py-2 cursor-pointer text-sm">
                    + Add Image
                    <input type="file" hidden accept="image/*" multiple onChange={handleFileChange} />
                  </label>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Saving...' : editingFood ? 'Update Food' : 'Add Food'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Cropper */}
      {croppingImage && (
        <ImageCropperModal
          imagePreview={croppingImage}
          onClose={() => setCroppingImage(null)}
          onSave={handleCropSave}
        />
      )}
    </>
  );
}
