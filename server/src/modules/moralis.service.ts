import Moralis from 'moralis';
import { CHAIN_ID } from 'src/types/enum';

class MoralisService {
  constructor() {
    Moralis.start({ apiKey: process.env.MORALIS_API_KEY }).catch(console.log);
  }

  // public async getWalletTokenData(
  //   wallet_address: string,
  //   token_address: string,
  // ) {
  //   console.log('d', wallet_address, token_address);
  //   const response = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
  //     address: wallet_address,
  //     tokenAddresses: [token_address],
  //     chain: CHAIN_ID.BASE_HASH as string,
  //   });
  //   return response.result;
  // }

  public getWalletNetWorth = async (address: string, chain?: CHAIN_ID) => {
    const response = await Moralis.EvmApi.wallets.getWalletNetWorth({
      address,
      chains: [(chain ?? CHAIN_ID.BASE_HASH) as never],
      excludeSpam: true,
    });
    return response.toJSON();
  };

  async getWalletTokenBalances(wallet_address: string, chain?: CHAIN_ID) {
    const response = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
      chain: chain ?? (CHAIN_ID.BASE_HASH as any),
      address: wallet_address,
    });
    return response.response.result;
  }

  async getWalletAddressForENS(ens: string) {
    const response = await Moralis.EvmApi.resolve.resolveENSDomain({
      domain: ens,
    });
    console.log('response', response);
    return response?.raw?.address;
  }
}

const moralisService = new MoralisService();
export default moralisService;
