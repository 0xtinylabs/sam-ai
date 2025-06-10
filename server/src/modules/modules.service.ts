import { Injectable } from '@nestjs/common';
import moralisService from './moralis.service';
import neynarService from './neynar.service';
import birdeyeService from './birdeye.service';

@Injectable()
export class ModulesService {
  public async resolveENSName(ens: string) {
    console.log('ens', ens);
    const response = await moralisService.getWalletAddressForENS(ens);
    return response;
  }
  public async resolveFname(fname: string) {
    const response = await neynarService.getAddressForFarcasterUser(fname);
    return response;
  }

  public async getWalletData(wallet_address: string) {
    const token_balances =
      await moralisService.getWalletTokenBalances(wallet_address);
    const net_worth = await moralisService.getWalletNetWorth(wallet_address);
    return { token_balances, net_worth };
  }
  public async getTokenOverview(token_address: string) {
    const token_overview = await birdeyeService.getTokenOverview(token_address);
    return token_overview;
  }
}
