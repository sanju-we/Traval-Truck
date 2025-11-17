import WalletSummary from '@/components/wallet/WalletSummary';
import WalletTransactions from '@/components/wallet/WalletTransactions';
import { getWalletData } from '@/lib/server/wallet';

export const dynamic = 'force-dynamic'; 

interface WalletPageProps {
  searchParams: { role?: string };
}

export default async function WalletPage({ searchParams }: WalletPageProps) {
  const role = searchParams?.role || 'user';
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
          balance={safeWallet.balance}
          totalTransactions={safeWallet.transactions.length}
          lastUpdated={safeWallet.lastUpdated || 'Not Created'}
          role={role}
        />

        {safeWallet.notCreated && (
          <div className="bg-white border border-gray-200 rounded-xl shadow p-6 text-center">
            <p className="text-gray-600 mb-4">
              Your wallet is not created yet. Add money to create your wallet.
            </p>

            <button
              className="px-5 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition"
            >
              Add Money
            </button>
          </div>
        )}

        {safeWallet.transactions.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl shadow p-6 text-center text-gray-500">
            No transactions yet.
          </div>
        ) : (
          <WalletTransactions transactions={safeWallet.transactions} role={role} />
        )}
      </div>
    </div>
  );
}
