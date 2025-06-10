import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { DBService } from 'src/db/db.service';

@Injectable()
export class UserService {
  constructor(public db: DBService) {}

  // user_id or social platform_ids
  async existUser(id: string) {
    const res = await this.db.user.findMany({
      where: {
        OR: [{ xmtp_id: id }],
      },
    });
    return res.length > 0;
  }

  async createXMTPUser(xmtp_id: string) {
    const wallet = ethers.Wallet.createRandom();

    const user = await this.db.xMTPUser.create({
      data: {
        user: {
          connect: {
            xmtp_id: xmtp_id,
          },
          create: {
            username: '',
            wallet_address: wallet.address,
            wallet_private_key: wallet.privateKey,
            xmtp_id: xmtp_id,
          },
        },
      },
    });
    return { user, wallet };
  }
}
