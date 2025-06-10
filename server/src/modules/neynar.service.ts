import axios from 'axios';

class NeynarService {
  public url = 'https://api.neynar.com/v2/farcaster';
  public service = axios.create({
    baseURL: this.url,
    headers: {
      'x-api-key': process.env.NEYNAR_API_KEY,
    },
  });

  constructor() {}

  async getAddressForFarcasterUser(fname: string) {
    const response = await this.service.get('/user/by_username', {
      params: {
        username: fname,
      },
    });
    return response.data?.user?.verified_addresses?.eth_addresses?.[0];
  }
}

const neynarService = new NeynarService();

export default neynarService;
