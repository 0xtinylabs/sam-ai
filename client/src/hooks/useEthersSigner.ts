import { providers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import {
  createWalletClient,
  custom,
  toBytes,
  type Account,
  type Chain,
  type Client,
  type Transport,
} from "viem";

import { Config, useWalletClient } from "wagmi";
import { base } from "wagmi/chains";

export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
}

/** Hook to convert a Viem Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: client } = useWalletClient<Config>({ chainId });

  return useMemo(() => (client ? clientToSigner(client) : undefined), [client]);
}

export const useCoinBaseSigner = () => {
  const [coinbaseSigner, setCoinbaseSigner] = useState<any>(null);
  const signer = useEthersSigner();
  const createSignerForCoinBASE = async () => {
    const client = createWalletClient({
      chain: base,
      transport: custom(window.ethereum),
    });
    if (!signer) {
      return;
    }
    const address = await signer?.getAddress();
    const s = {
      type: "EOA",
      getIdentifier: () => ({
        identifier: address.toLowerCase(),
        identifierKind: "Ethereum",
      }),
      signMessage: async (message: string) => {
        const signature = await client.signMessage({
          account: address.toLowerCase() as any,
          message: message,
        });
        console.log(signature);
        return toBytes(signature);
      },
      getChainId: () => BigInt(8453),
    };
    setCoinbaseSigner(s);
  };
  useEffect(() => {
    createSignerForCoinBASE();
  }, [signer]);
  return { coinbaseSigner };
};
