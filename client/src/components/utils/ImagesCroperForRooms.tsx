import React, { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import getCroppedImg from "@/components/utils/UserCropImage";

interface ImageCropperProps {
  image: string;
  onCancel: () => void;
  onSave: (croppedUrl: string) => void;
}

export default function ImageCropper({ image, onCancel, onSave }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    if (!croppedAreaPixels) return;
    const croppedImageUrl = await getCroppedImg(image, croppedAreaPixels);
    onSave(croppedImageUrl);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[420px] sm:w-[500px]">
        <div className="relative w-full h-72 bg-gray-900 rounded-lg overflow-hidden">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3}
            cropShape="rect"
            showGrid={true}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            style={{
              containerStyle: { background: "#000" },
              cropAreaStyle: {
                border: "2px solid white",
                borderRadius: "12px",
              },
            }}
          />
        </div>

        <div className="flex flex-col items-center mt-4 space-y-3">
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-3/4 accent-blue-600"
          />
          <div className="flex gap-3 mt-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border border-gray-400 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleCrop}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Crop & Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
