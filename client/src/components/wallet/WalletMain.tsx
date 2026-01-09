import WalletSummary from "./WalletSummary";
import WalletTransactions from "./WalletTransactions";
import AddMoneySection from "./AddMoneySection";
import { getWalletData } from "@/lib/server/wallet";

interface Transaction {
  _id: string;
  Amount: number;
  Type: 'credit' | 'debit';
  Description: string;
  Date: string;
}

export default async function WalletMain({ role }: { role: string }) {
  const data = await getWalletData(role, 1);
  console.log(data)
  const walletData = data.data.data;

  const fetchData = async (currentPage: number): Promise<{ data: Transaction[]; totalPages: number; }> => {
    const wallet = await getWalletData(role, currentPage);
    return wallet
  }
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
          totalTransactions={wallet.Transaction.length}
          lastUpdated={wallet.lastUpdated || new Date().toISOString()}
          role={role}
        />

        <AddMoneySection role={role} />

        <WalletTransactions
          transactions={wallet.Transaction}
          totlaPage={data.data.totalPage}
          newPage={fetchData}
          role={role}
        />
      </div>
    </div>
  );
}
