"use client";

import React from "react";

interface SliderProps {
  value: number[]; // mimic Radix
  min?: number;
  max?: number;
  step?: number;
  onValueChange: (value: number[]) => void;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  className = "",
}) => {
  const current = value[0];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Number(e.target.value);
    onValueChange([newVal]);
  };

  return (
    <div className={`w-full flex items-center gap-3 ${className}`}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={handleChange}
        className="
          w-full cursor-pointer appearance-none bg-transparent
          [&::-webkit-slider-runnable-track]:rounded-full
          [&::-webkit-slider-runnable-track]:bg-gray-200
          [&::-webkit-slider-runnable-track]:h-2
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-blue-500
          [&::-webkit-slider-thumb]:mt-[-4px]
          [&::-moz-range-track]:h-2
          [&::-moz-range-track]:rounded-full
          [&::-moz-range-track]:bg-gray-200
          [&::-moz-range-thumb]:h-4
          [&::-moz-range-thumb]:w-4
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-blue-500
          focus:outline-none
        "
      />
      <span className="text-sm text-gray-700 w-10 text-right">
        {current.toFixed(1)}
      </span>
    </div>
  );
};
