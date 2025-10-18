import { motion } from "framer-motion";
import { useState } from "react";
import getCroppedImg from "./UserCropImage";
import toast from "react-hot-toast";
import { Camera, Check, X } from "lucide-react";
import Cropper from "react-easy-crop";

export default function DocumentUploadModal({
  label,
  existingUrl,
  onChange,
  required = false,
}: {
  label: string;
  existingUrl?: string;
  onChange: (fileOrBlob: Blob | string) => void;
  required?: boolean;
}) {
  const [imagePreview, setImagePreview] = useState<string | null>(existingUrl || null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewFile, setHasNewFile] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHasNewFile(true);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setIsCropping(true);
    }
  };

  const handleCropComplete = async () => {
    try {
      setIsLoading(true);
      const croppedImage = await getCroppedImg(imagePreview!, croppedAreaPixels);
      const ress = await fetch(croppedImage);
      const blob = await ress.blob();
      const file = new File([blob], `${label.toLowerCase().replace(/\s/g, '-')}.jpg`, { type: 'image/jpeg' });
      onChange(file);
      setImagePreview(croppedImage);
      setIsCropping(false);
      setHasNewFile(false);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to crop ${label}`);
    } finally {
      setIsLoading(false);
    }
  };

  const isUploaded = existingUrl && !hasNewFile;

  return (
    <div className="group">
      <label className="block text-sm font-semibold text-gray-700 mb-3 capitalize">
        {label} <span className="text-red-500">*</span>
      </label>
      
      <div className={`relative p-4 border-2 rounded-xl transition-all duration-200 ${
        isUploaded 
          ? 'border-emerald-200 bg-emerald-50' 
          : hasNewFile 
          ? 'border-blue-200 bg-blue-50' 
          : 'border-red-200 bg-red-50 hover:border-red-300'
      }`}>
        {/* Preview Image */}
        {imagePreview ? (
          <div className="relative w-full h-40">
            <img
              src={imagePreview}
              alt={`${label} Preview`}
              className="w-full h-full object-contain rounded-lg"
            />
            {hasNewFile && (
              <div className="absolute -top-2 -right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                New
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-40 flex items-center justify-center rounded-lg bg-gradient-to-br from-red-50 to-red-100">
            <div className="text-center">
              <Camera className="w-12 h-12 text-red-400 mx-auto mb-2" />
              <p className="text-red-600 text-sm font-medium">Required - Tap to upload</p>
            </div>
          </div>
        )}

        {/* Upload Overlay */}
        <label
          htmlFor={`${label}-upload`}
          className={`absolute inset-0 flex flex-col items-center justify-center rounded-xl transition-all duration-200 ${
            isUploaded 
              ? 'bg-emerald-500/10 hover:bg-emerald-500/20' 
              : 'bg-black/40 hover:bg-black/60 opacity-0 group-hover:opacity-100'
          }`}
        >
          {isUploaded ? (
            <Check className="w-6 h-6 text-emerald-500" />
          ) : (
            <>
              <Camera className="w-6 h-6 text-white mb-1" />
              <span className="text-white text-xs font-medium">Upload</span>
            </>
          )}
          <input
            id={`${label}-upload`}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>

        {/* Status Badge */}
        {existingUrl && !hasNewFile && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/80 px-2 py-1 rounded-full text-xs font-medium text-emerald-700">
            <Check size={12} />
            Uploaded
          </div>
        )}
      </div>

      {/* Crop Modal */}
      {isCropping && (
        <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-[60] p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          >
            <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Crop {label}</h3>
              <button onClick={() => setIsCropping(false)} className="p-2 hover:bg-gray-200 rounded-xl">
                <X size={20} />
              </button>
            </div>
            
            <div className="relative flex-1 min-h-[400px]">
              <Cropper
                image={imagePreview || ''}
                crop={crop}
                zoom={zoom}
                aspect={16 / 9}
                cropShape="rect"
                showGrid={true}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
              />
            </div>

            <div className="p-6 bg-gray-50 space-y-4">
              <div className="flex justify-center">
                <input
                  type="range"
                  min={1}
                  max={4}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-64 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setIsCropping(false)}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropComplete}
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-50 font-semibold flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Cropping...
                    </>
                  ) : (
                    'Save Crop'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

