"use client";
import React, { useState, useRef, useEffect } from "react";

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  children: React.ReactNode;
  className?: string;
}

export function Select({ value, onValueChange, placeholder, children, className }: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleSelect = (val: string) => {
    console.log(val)
    onValueChange(val);   // ✅ CALL IT HERE
    setOpen(false);       // ✅ close dropdown
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center w-full border rounded-lg px-3 py-2 text-sm bg-white hover:border-gray-400 focus:outline-none"
      >
        {value || placeholder || "Select"}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute z-10 bg-white border rounded-lg mt-1 w-full shadow-md">
          {React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return child;

            return React.cloneElement(child as React.ReactElement<any>, {
              onSelect: handleSelect,
            });
          })}
        </div>
      )}
    </div>
  );
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  return <div className="py-1">{children}</div>;
}

export function SelectItem({
  value,
  children,
  onSelect,
}: {
  value: string;
  children: React.ReactNode;
  onSelect?: (value: string) => void;
}) {
  return (
    <div
      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
      onClick={() => onSelect?.(value)}
    >
      {children}
    </div>
  );
}

export function SelectTrigger({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  return <span className="text-gray-500">{placeholder}</span>;
}
