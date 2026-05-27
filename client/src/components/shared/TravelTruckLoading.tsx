'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface TravelTruckLoadingProps {
  size?: 'sm' | 'md' | 'lg';
}

const TravelTruckLoading: React.FC<TravelTruckLoadingProps> = ({ size = 'lg' }) => {
  if (size === 'sm') {
    return (
      <span className="inline-flex items-center justify-center min-h-[1.5rem] w-full py-0.5">
        <motion.span
          className="relative flex items-center justify-center w-12 h-6"
          animate={{ y: [0, -1, 0] }}
          transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
        >
          {/* Micro Car Body (SUV Silhouette) */}
          <span className="relative w-8 h-3 bg-white rounded-t-[5px] rounded-b-[1px] shadow-sm border-b-[1.5px] border-gray-300">
            {/* Windows */}
            <span className="absolute top-[1px] left-1 right-1 h-1.5 bg-gray-900 rounded-t-[3px] flex space-x-[2px] p-[0.5px]">
              <span className="flex-1 bg-white/20 rounded-tl-[1.5px]" />
              <span className="flex-1 bg-white/20 rounded-tr-[0.5px]" />
            </span>
          </span>
          {/* Wheels */}
          <motion.span
            className="absolute bottom-1 left-3 w-2 h-2 bg-gray-900 rounded-full border-[0.5px] border-gray-400 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.4, ease: "linear" }}
          >
            <span className="w-1 h-[0.5px] bg-gray-400/50" />
          </motion.span>
          <motion.span
            className="absolute bottom-1 right-3.5 w-2 h-2 bg-gray-900 rounded-full border-[0.5px] border-gray-400 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.4, ease: "linear" }}
          >
            <span className="w-1 h-[0.5px] bg-gray-400/50" />
          </motion.span>
        </motion.span>
      </span>
    );
  }

  if (size === 'md') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] w-full py-6">
        <div className="relative w-full max-w-[280px] h-24 overflow-hidden rounded-xl bg-gradient-to-b from-blue-50 to-emerald-50 border border-blue-100 flex items-end justify-center pb-4 p-6 scale-90">
          {/* Background Road */}
          <div className="absolute bottom-4 left-0 right-0 h-0.5 bg-gray-200">
            <motion.div
              className="absolute top-0 left-0 right-0 h-full flex"
              animate={{ x: [-20, 0] }}
              transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
            >
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-2 h-full bg-white mx-1 flex-shrink-0" />
              ))}
            </motion.div>
          </div>

          <motion.div
            className="relative z-10 flex flex-col items-center scale-75 origin-bottom"
            animate={{ y: [0, -1.5, 0] }}
            transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
          >
            <div className="relative">
              <div className="relative w-24 h-9 bg-blue-600 rounded-t-[15px] rounded-b-sm border-b-2 border-blue-800 shadow-md">
                <div className="absolute top-[3px] left-3 right-3 h-4 bg-gray-900 rounded-t-[10px] flex space-x-0.5 p-0.5 px-1">
                  <div className="flex-1 bg-gradient-to-br from-blue-300/30 to-blue-500/10 rounded-tl-[6px]" />
                  <div className="flex-1 bg-gradient-to-br from-blue-300/30 to-blue-500/10 rounded-tr-[3px]" />
                </div>
              </div>
              <motion.div
                className="absolute -bottom-3 left-3 w-6 h-6 bg-gray-900 rounded-full border-2 border-gray-700 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.4, ease: "linear" }}
              >
                <div className="w-3.5 h-3.5 border border-gray-500 rounded-full border-dashed opacity-40 shrink-0" />
              </motion.div>
              <motion.div
                className="absolute -bottom-3 right-1 w-6 h-6 bg-gray-900 rounded-full border-2 border-gray-700 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.4, ease: "linear" }}
              >
                <div className="w-3.5 h-3.5 border border-gray-500 rounded-full border-dashed opacity-40 shrink-0" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
      {/* Container for the Scene */}
      <div className="relative w-full max-w-md h-40 overflow-hidden rounded-2xl bg-gradient-to-b from-blue-50 to-emerald-50 border border-blue-100 flex items-end justify-center pb-8 p-12">

        {/* Background Road / Movement Elements */}
        <div className="absolute bottom-6 left-0 right-0 h-1 bg-gray-200">
          <motion.div
            className="absolute top-0 left-0 right-0 h-full flex"
            animate={{ x: [-20, 0] }}
            transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
          >
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-4 h-full bg-white mx-2 flex-shrink-0" />
            ))}
          </motion.div>
        </div>

        {/* Passing Scenery (Trees/Mountains) */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="flex space-x-12 absolute bottom-8 left-0"
            animate={{ x: [0, -200] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          >
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex flex-col items-center flex-shrink-0">
                <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[25px] border-b-emerald-200" />
                <div className="w-1.5 h-3 bg-emerald-800/20" />
              </div>
            ))}
          </motion.div>
        </div>

        {/* The Premium Travel Car (SUV) */}
        <motion.div
          className="relative z-10 flex flex-col items-center"
          animate={{ y: [0, -2, 0] }} // Smooth car suspension bounce
          transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
        >
          {/* Main Car Scene */}
          <div className="relative">

            {/* Car Body (Sleek SUV Shape) */}
            <div className="relative w-32 h-12 bg-blue-600 rounded-t-[20px] rounded-b-md shadow-xl border-b-4 border-blue-800 overflow-hidden">
              {/* Windows / Greenhouse */}
              <div className="absolute top-1 left-4 right-4 h-6 bg-gray-900 rounded-t-[15px] overflow-hidden flex space-x-1 p-0.5 px-2">
                {/* Front Window */}
                <div className="flex-1 bg-gradient-to-br from-blue-300/30 to-blue-500/10 rounded-tl-[10px]" />
                {/* Back Window */}
                <div className="flex-1 bg-gradient-to-br from-blue-300/30 to-blue-500/10 rounded-tr-[5px]" />

                {/* Window Reflections */}
                <div className="absolute top-0 right-4 w-1 h-10 bg-white/10 rotate-12" />
              </div>

              {/* Door / Body Detail */}
              <div className="absolute bottom-1 left-2 right-2 h-1 bg-blue-500/50 rounded-full" />

              {/* Branding/Favicon on Car Door */}
              <div className="absolute bottom-2 left-12 w-6 h-6 bg-white/10 rounded-full p-1 flex items-center justify-center backdrop-blur-sm border border-white/20">
                <img src="/favicon.ico" alt="Logo" className="w-4 h-4 object-contain opacity-90" />
              </div>
            </div>

            {/* Front Hood & Grille */}
            <div className="absolute -right-4 bottom-0 w-12 h-8 bg-blue-600 rounded-r-lg border-l-2 border-blue-700 shadow-md">
              {/* Headlight */}
              <motion.div
                className="absolute top-2 right-0 w-1.5 h-3 bg-yellow-100 rounded-l-full blur-[1px]"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </div>

            {/* Tail Lights */}
            <div className="absolute -left-1 top-4 w-1.5 h-4 bg-red-600 rounded-r-full shadow-[0_0_8px_rgba(220,38,38,0.4)]" />

            {/* Wheels - Sleek Alloy Style */}
            {/* Rear Wheel */}
            <motion.div
              className="absolute -bottom-4 left-4 w-9 h-9 bg-gray-900 rounded-full border-[3px] border-gray-700 shadow-xl flex items-center justify-center overflow-hidden"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.4, ease: "linear" }}
            >
              {/* Rims */}
              <div className="w-5 h-5 border-2 border-gray-500 rounded-full border-dashed opacity-40 shrink-0" />
              <div className="absolute w-2 h-2 bg-gray-400 rounded-full" />
            </motion.div>

            {/* Front Wheel */}
            <motion.div
              className="absolute -bottom-4 right-0 w-9 h-9 bg-gray-900 rounded-full border-[3px] border-gray-700 shadow-xl flex items-center justify-center overflow-hidden"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.4, ease: "linear" }}
            >
              <div className="w-5 h-5 border-2 border-gray-500 rounded-full border-dashed opacity-40 shrink-0" />
              <div className="absolute w-2 h-2 bg-gray-400 rounded-full" />
            </motion.div>

            {/* Door Handles */}
            <div className="absolute top-7 left-14 w-3 h-0.5 bg-gray-950/30 rounded-full" />
            <div className="absolute top-7 left-24 w-3 h-0.5 bg-gray-950/30 rounded-full" />
          </div>

          {/* Speed Dust / Ground Trails */}
          <div className="absolute bottom-[-10px] -left-12 flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-6 h-0.5 bg-gray-400/20 rounded-full blur-[1px]"
                animate={{ x: [0, -40], opacity: [0, 0.6, 0] }}
                transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Loading Text */}
      <div className="mt-8 text-center">
        <h3 className="text-lg font-bold text-blue-900 tracking-tight">On the move...</h3>
        <p className="text-sm text-blue-600/70 font-medium">Preparing your destination</p>
      </div>
    </div>
  );
};

export default TravelTruckLoading;
