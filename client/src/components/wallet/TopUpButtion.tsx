'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function TopUpButton({ userId, role }: { userId: string; role: string }) {
  const [loading, setLoading] = useState(false);

  const handleTopUp = async () => {
    try {
      setLoading(true);
      await api.post(`/wallet/topup`, { userId, role, amount: 100 });
      toast.success('Wallet topped up successfully!');
    } catch {
      toast.error('Top-up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleTopUp}
      disabled={loading}
      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center gap-2"
    >
      {loading && <Loader2 className="animate-spin w-4 h-4" />}
      Add ₹100
    </button>
  );
}
