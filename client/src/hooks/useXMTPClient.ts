"use client";

import { Client } from "@xmtp/xmtp-js";
import { useEffect, useState, useCallback } from "react";
import { useAccount, useWalletClient } from "wagmi";
interface UseXmtpClientOptions {
  env?: "dev" | "production" | "local";
}

import { useLocalStorage } from "usehooks-ts";
import { ethers, Wallet } from "ethers";

export function useXmtpClient({ env = "dev" }: UseXmtpClientOptions) {
  // const signer = useEthersSigner();
  const { data: walletClient } = useWalletClient();
  // const { coinbaseSigner } = useCoinBaseSigner();
  const [account_key, setAccountKey] = useLocalStorage("XMTP_ACCOUNT_KEY", "");
  const [xmtpClient, setXmtpClient] = useState<Client<any> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { isConnected } = useAccount();

  useEffect(() => {
    if (isConnected) {
      createWallet();
    }
  }, [isConnected]);

  const createWallet = () => {
    let address = account_key;
    if (!address) {
      const wallet = Wallet.createRandom();
      address = wallet.address;
      setAccountKey(wallet.address);
    }
  };

  const connectClient = useCallback(async () => {
    let address = account_key;
    if (!address) {
      const wallet = Wallet.createRandom();
      address = wallet.address;
      setAccountKey(wallet.address);
    }

    // console.log(signer);
    if (!walletClient) {
      return;
    }

    setIsLoading(true);

    setError(null);

    const provider = new ethers.providers.Web3Provider(walletClient.transport);
    const signer = provider.getSigner();

    try {
      const client = await Client.create(signer, {
        env,

        // codecs: [
        //   new ReactionCodec(),
        //   new ReplyCodec(),
        //   new RemoteAttachmentCodec(),
        //   new TransactionReferenceCodec(),
        //   new WalletSendCallsCodec(),
        // ],
      });

      console.log("Client created", client);

      setXmtpClient(client);
    } catch (err: any) {
      console.error("Failed to connect to XMTP:", err);
      setError(err);
      setXmtpClient(null);
    } finally {
      setIsLoading(false);
    }
  }, [env, isConnected, walletClient]);

  return { createWallet, xmtpClient, isLoading, error, connectClient };
}
