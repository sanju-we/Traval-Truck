// 'use client';

// import React, { useRef, useState, useCallback } from 'react';
// import Cropper from 'react-easy-crop';
// import { getCroppedImg } from '../utils/cropImage';
// import { motion, AnimatePresence } from 'framer-motion';
// import { X } from 'lucide-react';

// interface DocumentUploadWithPreviewProps {
//   label: string;
//   existingUrl?: string;
//   onChange: (file: File | Blob | null) => void;
// }

// export default function DocumentUploadWithPreview({
//   label,
//   existingUrl,
//   onChange,
// }: DocumentUploadWithPreviewProps) {
//   const [imageSrc, setImageSrc] = useState<string | null>(existingUrl || null);
//   const [cropModalOpen, setCropModalOpen] = useState(false);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   // Select file
//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = () => {
//       setImageSrc(reader.result as string);
//       setCropModalOpen(true);
//     };
//     reader.readAsDataURL(file);
//   };

//   // Crop complete
//   const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
//     setCroppedAreaPixels(croppedAreaPixels);
//   }, []);

//   // Save cropped image
//   const handleCropSave = useCallback(async () => {
//     if (!imageSrc || !croppedAreaPixels) return;
//     try {
//       const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
//       if (blob) {
//         const blobUrl = URL.createObjectURL(blob);
//         setImageSrc(blobUrl);
//         onChange(blob);
//       }
//     } catch (err) {
//       console.error('Crop failed:', err);
//     } finally {
//       setCropModalOpen(false);
//     }
//   }, [imageSrc, croppedAreaPixels, onChange]);

//   // Remove image
//   const handleRemove = () => {
//     setImageSrc(null);
//     onChange(null);
//   };

//   return (
//     <div className="space-y-2">
//       <label className="block text-sm font-medium text-gray-700">{label}</label>

//       {imageSrc ? (
//         <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-gray-300 bg-gray-100">
//           <img
//             src={imageSrc}
//             alt="Document Preview"
//             className="w-full h-full object-cover"
//           />
//           <button
//             type="button"
//             onClick={handleRemove}
//             className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black"
//           >
//             <X size={14} />
//           </button>
//         </div>
//       ) : (
//         <div
//           onClick={() => inputRef.current?.click()}
//           className="flex items-center justify-center w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
//         >
//           <p className="text-gray-400 text-sm text-center px-2">Click to upload</p>
//         </div>
//       )}

//       <input
//         type="file"
//         accept="image/*"
//         className="hidden"
//         ref={inputRef}
//         onChange={handleFileSelect}
//       />

//       {/* Cropping Modal */}
//       <AnimatePresence>
//         {cropModalOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
//           >
//             <div className="bg-white p-4 rounded-lg shadow-lg w-[90vw] max-w-md">
//               <h2 className="text-lg font-semibold mb-2">Crop your image</h2>
//               <div className="relative w-full h-64 bg-black">
//                 <Cropper
//                   image={imageSrc!}
//                   crop={crop}
//                   zoom={zoom}
//                   aspect={4 / 3}
//                   cropShape="rect"
//                   showGrid={false}
//                   onCropChange={setCrop}
//                   onZoomChange={setZoom}
//                   onCropComplete={onCropComplete}
//                 />
//               </div>
//               <div className="flex justify-between mt-4">
//                 <button
//                   onClick={() => setCropModalOpen(false)}
//                   className="px-4 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleCropSave}
//                   className="px-4 py-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
//                 >
//                   Save Crop
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
