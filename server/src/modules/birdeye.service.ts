import axios from 'axios';

class BirdeyeService {
  public url = 'https://public-api.birdeye.so/';
  public service = axios.create({
    baseURL: this.url,
    headers: {
      'x-chain': 'base',
      'x-api-key': process.env.BIRDEYE_API_KEY,
    },
  });

  async getTokenOverview(token_address) {
    const response = await this.service.get('defi/token_overview', {
      params: {
        address: token_address,
      },
    });
    return response.data;
  }
}

const birdeyeService = new BirdeyeService();

export default birdeyeService;
