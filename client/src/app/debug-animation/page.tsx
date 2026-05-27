'use client';

import TravelTruckLoading from '@/components/shared/TravelTruckLoading';

export default function DebugAnimationPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-10">
      <h1 className="text-2xl font-bold mb-10 text-blue-900 uppercase tracking-widest">Animation Preview</h1>
      
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-12 border border-blue-100">
        <TravelTruckLoading />
      </div>

      <div className="mt-12 text-center max-w-md">
        <p className="text-gray-500 text-sm">
          This is the "Running Truck" animation designed for global loading states. 
          It features dynamic road movement, parallax scenery, and a bouncing vehicle suspension.
        </p>
      </div>
    </div>
  );
}
