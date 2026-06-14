"use client";

import { useEffect, useState } from "react";
import WalletSummary from "./WalletSummary";
import WalletTransactions from "./WalletTransactions";
import AddMoneySection from "./AddMoneySection";
import api from "@/services/api";
import TravelTruckLoading from "../shared/TravelTruckLoading";

interface Transaction {
  _id: string;
  Amount: number;
  Type: 'credit' | 'debit';
  Description: string;
  Date: string;
}

interface Wallet {
  Balance: number;
  Transaction: Transaction[];
  lastUpdated: string;
  notCreated?: boolean;
}

export default function WalletMain({ role }: { role: string }) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchWallet = async (currentPage = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/shared/wallet/${role}?page=${currentPage}&limit=${limit}`);
      if (res.data && res.data.success && res.data.data) {
        const walletData = res.data.data;
        setWallet(walletData);
        setTotalPages(walletData.totalPages || 1);
        setTotalItems(walletData.totalTransactions || 0);
        setPage(currentPage);
      }
    } catch (err) {
      console.error("Error fetching wallet data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet(1);
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchWallet(newPage);
    }
  };

  if (loading && !wallet) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <TravelTruckLoading />
      </div>
    );
  }

  const walletObj = wallet || {
    Balance: 0,
    Transaction: [],
    lastUpdated: null,
    notCreated: true,
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Wallet</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and track your transactions dynamically</p>
          </div>
          {loading && (
            <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>

        <WalletSummary
          Balance={walletObj.Balance}
          totalTransactions={totalItems}
          lastUpdated={walletObj.lastUpdated || new Date().toISOString()}
          role={role}
        />

        <AddMoneySection role={role} />

        <WalletTransactions
          transactions={walletObj.Transaction}
          role={role}
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          limit={limit}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
