interface WalletSummaryProps {
  balance: number;
  totalTransactions: number;
  lastUpdated: string;
  role: string;
}

export default function WalletSummary({
  balance,
  totalTransactions,
  lastUpdated,
  role,
}: WalletSummaryProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 grid sm:grid-cols-3 gap-6 border border-gray-100">
      <div>
        <p className="text-sm text-gray-500">Available Balance</p>
        <h2 className="text-2xl font-semibold text-emerald-600">₹{balance.toFixed(2)}</h2>
      </div>

      <div>
        <p className="text-sm text-gray-500">Total Transactions</p>
        <h2 className="text-xl font-semibold text-gray-700">{totalTransactions}</h2>
      </div>

      <div>
        <p className="text-sm text-gray-500">Last Updated</p>
        <h2 className="text-sm text-gray-700">{new Date(lastUpdated).toLocaleString()}</h2>
      </div>
    </div>
  );
}
