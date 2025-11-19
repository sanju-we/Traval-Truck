export const toWalletDTO = (wallet) => ({
    id: wallet._id.toString(),
    Transaction: wallet.Transaction,
    Balance: wallet.Balance,
});
