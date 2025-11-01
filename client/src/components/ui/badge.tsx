import React from "react";
import clsx from "clsx";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "destructive" | "outline" | "secondary";
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  className,
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition";

  const variants = {
    default: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    destructive: "bg-red-100 text-red-800",
    secondary: "bg-gray-100 text-gray-700",
    outline: "border border-gray-300 text-gray-600",
  };

  return (
    <span className={clsx(baseStyles, variants[variant], className)} {...props}>
      {children}
    </span>
  );
};
