import WalletSummary from '@/components/wallet/WalletSummary';
import WalletTransactions from '@/components/wallet/WalletTransactions';
import { getWalletData } from '@/lib/server/wallet';
import AddMoneyButton from "@/components/wallet/AddMoneyButton";
import AddMoneySection from '@/components/wallet/AddMoneySection';

export const dynamic = 'force-dynamic';

interface WalletPageProps {
  searchParams: Promise<{ role?: string }>;
}

export default async function WalletPage({ searchParams }: WalletPageProps) {
  const { role: rawRole } = await searchParams;
  const role = rawRole || 'user';
  const walletData = await getWalletData(role);

  const safeWallet = walletData || {
    balance: 0,
    transactions: [],
    lastUpdated: null,
    notCreated: true,
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-gray-800">Wallet</h1>

        <WalletSummary
          Balance={safeWallet.Balance}
          totalTransactions={safeWallet.Transaction ? safeWallet.Transaction.length : 0}
          lastUpdated={safeWallet.lastUpdated || 'Not Created'}
          role={role}
        />

        <AddMoneySection />

        {safeWallet.notCreated && (
          <div className="bg-white rounded-xl shadow p-6 border text-center">
            <p className="text-gray-600">Add money to create your wallet.</p>
          </div>
        )}

        {safeWallet.Transaction?.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6 border text-center text-gray-500">
            No transactions yet.
          </div>
        ) : (
          <WalletTransactions
            transactions={safeWallet.Transaction}
            role={role}
          />
        )}
      </div>
    </div>
  );
}
