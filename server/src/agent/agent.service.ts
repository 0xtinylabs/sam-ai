import { AgentKit, CdpWalletProvider } from '@coinbase/agentkit';
import { Injectable } from '@nestjs/common';
import { getVercelAITools } from '@coinbase/agentkit-vercel-ai-sdk';

@Injectable()
export class AgentService {
  public AGENTKIT_API_KEY = process.env.AGENTKIT_API_KEY as string;
  public AGENTKIT_API_SECRET = process.env.AGENTKIT_API_SECRET as string;
  public OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  async createAITools() {
    const wallet_provider = await this.createWalletProvider();
    const agentKit = await AgentKit.from({
      cdpApiKeyId: this.AGENTKIT_API_KEY,
      cdpApiKeySecret: this.AGENTKIT_API_SECRET,
      walletProvider: wallet_provider,
    });
    const tools = getVercelAITools(agentKit);
    return tools;
  }

  async createWalletProvider() {
    const walletProvider = await CdpWalletProvider.configureWithWallet({
      apiKeyId: this.AGENTKIT_API_KEY,
      apiKeySecret: this.AGENTKIT_API_SECRET,
      networkId: 'base-mainnet',
    });
    return walletProvider;
  }

  async craeteAgentKit() {
    const walletProvider = await this.createWalletProvider();
    const agentKit = await AgentKit.from({
      walletProvider,
    });
    return agentKit;
  }
}
