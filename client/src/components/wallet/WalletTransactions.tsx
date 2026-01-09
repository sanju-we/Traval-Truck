'use client';

import { useEffect, useState } from 'react';

interface Transaction {
  _id: string;
  Amount: number;
  Type: 'credit' | 'debit';
  Description: string;
  Date: string;
}

interface WalletTransactionsProps {
  transactions: Transaction[];
  totlaPage: number;
  newPage: (currentPage: number) => Promise<{
    data: Transaction[];
    totalPages: number;
  }>;
  role: string;
}

export default function WalletTransactions({
  transactions,
  totlaPage,
  newPage,
}: WalletTransactionsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [txns, setTxns] = useState<Transaction[]>(transactions);
  const [totalPages, setTotalPages] = useState(totlaPage);
  const [loading, setLoading] = useState(false);

  /* Sync first-page data from parent */
  useEffect(() => {
    setTxns(transactions);
    setTotalPages(totlaPage);
  }, [transactions, totlaPage]);

  const handlePageChange = async (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;

    try {
      setLoading(true);
      const res = await newPage(page);

      setTxns(res.data);
      setTotalPages(res.totalPages);
      setCurrentPage(page);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!txns || txns.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10 bg-white rounded-xl shadow-sm">
        No transactions yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Transaction History
        </h3>
      </div>

      {/* Transactions */}
      <div className="divide-y">
        {txns.map((txn) => (
          <div key={txn._id} className="flex justify-between px-6 py-3 text-sm">
            <div>
              <p className="font-medium text-gray-800">{txn.Description}</p>
              <p className="text-gray-500 text-xs">
                {new Date(txn.Date).toLocaleString()}
              </p>
            </div>
            <p
              className={`font-semibold ${
                txn.Type === 'credit'
                  ? 'text-emerald-600'
                  : 'text-red-500'
              }`}
            >
              {txn.Type === 'credit' ? '+' : '-'}₹
              {txn.Amount.toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="px-4 py-2 rounded-lg border text-sm disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm text-gray-600">
          Page <strong>{currentPage}</strong> of {totalPages}
        </span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="px-4 py-2 rounded-lg border text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
