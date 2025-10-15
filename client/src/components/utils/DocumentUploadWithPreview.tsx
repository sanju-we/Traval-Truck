'use client';

import React, { useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from './cropImage';

interface DocumentUploadWithPreviewProps {
  label: string;
  existingUrl?: string; // if already existing preview
  onChange: (file: Blob | File) => void;
}

export default function DocumentUploadWithPreview({
  label,
  existingUrl,
  onChange,
}: DocumentUploadWithPreviewProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(existingUrl || null);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    width: number;
    height: number;
    x: number;
    y: number;
  } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback(
    (_: any, croppedPixels: any) => {
      setCroppedAreaPixels(croppedPixels);
    },
    []
  );

  const showCroppedImage = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const blob = await getCroppedImg(imageSrc, croppedAreaPixels, 0);
    if (blob) {
      onChange(blob);
      const blobUrl = URL.createObjectURL(blob);
      setImageSrc(blobUrl);
    }
  }, [imageSrc, croppedAreaPixels, onChange]);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="border border-gray-300 rounded-md overflow-hidden relative">
        {imageSrc ? (
          <div className="relative w-full h-64 bg-black">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
        ) : (
          <div
            className="w-full h-32 flex items-center justify-center bg-gray-100 cursor-pointer"
            onClick={() => inputRef.current?.click()}
          >
            <span className="text-gray-400">Click to upload image</span>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={inputRef}
          onChange={onSelectFile}
        />
      </div>

      {imageSrc && (
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={showCroppedImage}
            className="px-3 py-1 bg-emerald-500 text-white rounded-md"
          >
            Crop & Use
          </button>
          <button
            type="button"
            onClick={() => {
              setImageSrc(null);
              onChange(new File([], '')); // clear
            }}
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
