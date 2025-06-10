import { Injectable } from '@nestjs/common';
import moralisService from './moralis.service';

@Injectable()
export class ModulesService {
  public async resolveENSName(ens: string) {
    const response = await moralisService.getWalletAddressForENS(ens);
    return response;
  }
}
