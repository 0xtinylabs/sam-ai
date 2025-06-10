import * as Xmtp from '@xmtp/node-sdk';
import config from './config';
import { createSigner, logAgentDetails } from './helper';

type Client = Xmtp.Client;

class XMTPInitService {
  public xmtp: Client | null = null;
  async initializeClient(): Promise<Client> {
    console.log('x', this.xmtp);
    if (this.xmtp) {
      return this.xmtp;
    }

    const signer = createSigner(config.privateKey);

    this.xmtp = await Xmtp.Client.create(signer, {
      env: config.env,
    });

    logAgentDetails(this.xmtp);

    await this.xmtp.conversations.sync();
    return this.xmtp;
  }

  constructor() {}
}

const xmtpInitService = new XMTPInitService();

export default xmtpInitService;
