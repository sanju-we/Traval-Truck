import { useState } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/components/utils/UserCropImage';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

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

  async function handleCropComplete() {
    try {
      setIsSaving(true);
      const croppedImage = await getCroppedImg(imagePreview!, croppedAreaPixels);
      onSave(croppedImage);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to crop image.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-[9999]">
      <div className="relative bg-white rounded-2xl w-[90%] max-w-lg h-[500px] overflow-hidden">
        <Cropper
          image={imagePreview || ''}
          crop={crop}
          zoom={zoom}
          aspect={4 / 3}
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
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCropComplete} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Crop'}
          </Button>
        </div>
      </div>
    </div>
  );
}
