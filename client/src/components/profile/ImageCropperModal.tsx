// components/profile/ImageCropperModal.tsx
import { useState } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/components/utils/UserCropImage';
import toast from 'react-hot-toast';

interface ImageCropperModalProps {
  imagePreview: string | null;
  onClose: () => void;
  onSave: (croppedImage: File) => void;
}

export function ImageCropperModal({ imagePreview, onClose, onSave }: ImageCropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleCropComplete() {
    setIsSaving(true);
    try {
      const croppedImage = await getCroppedImg(imagePreview!, croppedAreaPixels);
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
      onSave(file);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to crop image.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex flex-col items-center justify-center z-50">
      <div className="relative bg-white rounded-2xl w-[90%] max-w-lg h-[500px] overflow-hidden">
        <Cropper
          image={imagePreview || ''}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
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
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleCropComplete}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Crop'}
          </button>
        </div>
      </div>
    </div>
  );
}