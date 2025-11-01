import React from "react";

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">{children}</table>
    </div>
  );
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return <thead className="bg-gray-50 border-b">{children}</thead>;
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-gray-100">{children}</tbody>;
}

export function TableRow({ children }: { children: React.ReactNode }) {
  return <tr className="hover:bg-gray-50 transition">{children}</tr>;
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
      {children}
    </th>
  );
}

export function TableCell({ children }: { children: React.ReactNode }) {
  return <td className="px-6 py-3 text-sm text-gray-700">{children}</td>;
}
