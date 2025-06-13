export const shortenWalletAddress = (wallet_address: any) => {
  return (
    wallet_address.slice(0, 4) +
    "..." +
    wallet_address.slice(wallet_address.length - 4, wallet_address.length)
  );
};
