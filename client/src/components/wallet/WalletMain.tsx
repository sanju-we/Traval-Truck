import WalletSummary from "./WalletSummary";
import WalletTransactions from "./WalletTransactions";
import AddMoneySection from "./AddMoneySection";
import { getWalletData } from "@/lib/server/wallet";

export default async function WalletMain({ role }: { role: string }) {
  const walletData = await getWalletData(role);

  const wallet = walletData || {
    Balance: 0,
    Transaction: [],
    lastUpdated: null,
    notCreated: true,
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-gray-800">Wallet</h1>

        <WalletSummary
          Balance={wallet.Balance}
          totalTransactions={wallet.Transaction?.length}
          lastUpdated={wallet.lastUpdated || new Date().toISOString()}
          role={role}
        />

        <AddMoneySection role={role}/>

        <WalletTransactions
          transactions={wallet.Transaction}
          role={role}
        />
      </div>
    </div>
  );
}
