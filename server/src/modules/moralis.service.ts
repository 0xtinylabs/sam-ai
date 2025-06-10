import Moralis from 'moralis/.';

class MoralisService {
  constructor() {
    Moralis.start({ apiKey: process.env.MORALIS_API_KEY }).catch(console.log);
  }
  async getWalletAddressForENS(ens: string) {
    const response = await Moralis.EvmApi.resolve.resolveENSDomain({
      domain: ens,
    });
    return response?.raw?.address;
  }
}

const moralisService = new MoralisService();
export default moralisService;
