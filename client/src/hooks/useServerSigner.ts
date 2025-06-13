import { ethers } from "ethers";

const useServerSigner = () => {
  const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_INBOX_ID ?? "");
  return signer;
};
export default useServerSigner;
