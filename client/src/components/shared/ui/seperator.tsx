import React from "react";
import clsx from "clsx";

interface SeparatorProps {
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export const Separator: React.FC<SeparatorProps> = ({
  className,
  orientation = "horizontal",
}) => {
  return (
    <div
      className={clsx(
        "bg-gray-200",
        orientation === "horizontal" ? "h-px w-full my-4" : "w-px h-full mx-4",
        className
      )}
    />
  );
};
