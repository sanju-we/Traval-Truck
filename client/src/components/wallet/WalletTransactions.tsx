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
}

export default function WalletTransactions({ transactions }: WalletTransactionsProps) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10 bg-white rounded-xl shadow-sm">
        No transactions yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100">
      <div className="border-b px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-800">Transaction History</h3>
      </div>
      <div className="divide-y">
        {transactions.map((txn) => (
          <div key={txn._id} className="flex justify-between px-6 py-3 text-sm">
            <div>
              <p className="font-medium text-gray-800">{txn.Description}</p>
              <p className="text-gray-500 text-xs">
                {new Date(txn.Date).toLocaleString()}
              </p>
            </div>
            <p
              className={`font-semibold ${
                txn.Type === 'credit' ? 'text-emerald-600' : 'text-red-500'
              }`}
            >
              {txn.Type === 'credit' ? '+' : '-'}₹{txn.Amount.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
