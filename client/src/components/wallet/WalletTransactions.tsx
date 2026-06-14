"use client";

import { useState } from 'react';

interface Transaction {
  _id: string;
  Amount: number;
  Type: 'credit' | 'debit';
  Description: string;
  Date: string;
}

interface WalletTransactionsProps {
  transactions: Transaction[];
  role: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  onPageChange: (newPage: number) => void;
}

export default function WalletTransactions({
  transactions,
  currentPage,
  totalPages,
  totalItems,
  limit,
  onPageChange,
}: WalletTransactionsProps) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10 bg-white rounded-xl shadow-sm">
        No transactions yet.
      </div>
    );
  }

  // Transactions are already sorted and sliced on the backend, so we render them directly!
  const slicedTransactions = transactions;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100">
      <div className="border-b px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-800">Transaction History</h3>
      </div>
      <div className="divide-y">
        {slicedTransactions.map((txn) => (
          <div key={txn._id} className="flex justify-between px-6 py-4 text-sm hover:bg-gray-50 transition-colors">
            <div>
              <p className="font-medium text-gray-800">{txn.Description}</p>
              <p className="text-gray-500 text-xs mt-1">
                {new Date(txn.Date).toLocaleString()}
              </p>
            </div>
            <p
              className={`font-semibold text-base self-center ${
                txn.Type === 'credit' ? 'text-emerald-600' : 'text-red-500'
              }`}
            >
              {txn.Type === 'credit' ? '+' : '-'}₹{txn.Amount.toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* ✅ Premium Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 rounded-b-2xl p-4 border-t border-gray-100">
        <p className="text-sm text-gray-600 font-medium">
          Showing {totalItems > 0 ? (currentPage - 1) * limit + 1 : 0} to {Math.min(currentPage * limit, totalItems)} of {totalItems} transactions
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-sm transition-colors border text-gray-700 shadow-sm"
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg font-semibold text-sm border border-purple-100">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-4 py-2 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-sm transition-colors border text-gray-700 shadow-sm"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
