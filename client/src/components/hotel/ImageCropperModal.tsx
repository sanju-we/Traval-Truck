import { useState } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/components/utils/UserCropImage';
import toast from 'react-hot-toast';

interface ImageCropperModalProps {
  imagePreview: string | null;
  onClose: () => void;
  onSave: (croppedImage: string) => void;
}

export function ImageCropperModal({ imagePreview, onClose, onSave }: ImageCropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleCropComplete = async () => {
    if (!imagePreview || !croppedAreaPixels) return;
    setIsSaving(true);
    try {
      const croppedImage = await getCroppedImg(imagePreview, croppedAreaPixels);
      onSave(croppedImage);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to crop image.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-lg w-[90%] max-w-lg overflow-hidden flex flex-col">
        {/* 🖼️ Crop Area */}
        <div className="relative bg-black h-[400px] w-full">
          {imagePreview && (
            <Cropper
              image={imagePreview}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, croppedPixels) => setCroppedAreaPixels(croppedPixels)}
              showGrid={true}
              restrictPosition={true}
            />
          )}
        </div>

        {/* 🎚️ Controls */}
        <div className="bg-gray-50 border-t px-4 py-3 flex flex-col gap-3">
          <div className="flex items-center justify-center">
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-2/3 accent-emerald-500"
            />
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleCropComplete}
              disabled={isSaving}
              className="px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition disabled:opacity-70"
            >
              {isSaving ? 'Cropping...' : 'Save Crop'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
