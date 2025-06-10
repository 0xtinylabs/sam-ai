import { TOKENS } from 'src/mock';
import { z } from 'zod';

const tools = {
  ai_mode: {
    name: 'ai_mode',
    description: "Selects the AI mode based on user's intent.",
    parameters: {
      type: 'object',
      properties: {
        mode: {
          type: 'string',
          enum: [
            'WALLET_DATA',
            'TOKEN_ALERT',
            'BASIC',
            'ASKING_FOR_SELF_WALLET',
          ],
          description:
            'Mode of AI. ASKING_FOR_SELF_WALLET: If user asks for self wallet address or private key. WALLET_DATA: If user is asking about wallet balance, address, or wallet-related data. TOKEN_ALERT: If user asks for alerts or alarms about tokens or price changes. BASIC: Any other question.',
        },
      },
      required: ['mode'],
    },
  },
};

export const schemaTools = {
  basic_question: z.object({
    answer: z
      .string()
      .describe(
        'The answer of the prompt for the bot description: ' +
          "## About Sam\n\n### 1. What is Sam?\nSam is a chat-based super agent that helps you analyze wallet data, set up alerts for token price changes, and answer your general questions.\n\n### 2. Is Sam safe to use?\nSam is currently in alpha; it might crash or provide incorrect data. Always DYOR (Do Your Own Research) and proceed at your own risk.\n\n### 3. Which networks are supported?\nOnly the Base network is supported for now.\n\n### 4. What can I do with Sam?\n* I can analyze wallet data.\n* I can get alerts for token price changes.\n* I can answer your basic questions.\n\n### 5. How do I get started with Sam?\nSam is ready to help you in your chat. You can start by asking direct questions.\n\n### 6. Do I always need to use commands?\nNo. Sam is natural language-based. However, you can also use specific commands to access certain functions.\n\n### 7. What Questions Can I Ask About Wallet Data?\n* 'Does jessepollak.eth hold $TOKEN?'\n* 'Show sencrazy.eth’s top trades this week.'\n* 'What’s the portfolio value of 0x123...45?'\n\n### 8. What Questions Can I Ask About Token Alerts?\n* 'Set a price alert for $TOKEN for me.'\n* 'Notify me if $TOKEN price increases by 5%.'\n\n### 9. What General Questions Can I Ask?\nSam can also assist you with general topics. For example:\n* 'What is the Base network?'\n* 'Can you give me information about cryptocurrencies?'\n\n### 10. I encountered an error. What should I do?\nRetry later, and if you continue to experience the same issue, contact support.\n\n### 11. Can I use Sam in my group chat?\nYes! Sam works in group chats as well as DMs. In groups, it can respond to queries using the same command system.\n\n### 12. Can I add Sam to my group chat?\nAbsolutely. Add the bot like any other Telegram bot.\n\n### 13. Why is my query taking longer than expected?\nThis may occur due to Base network congestion or transaction volume. All queries go through validation, submission, and confirmation steps.\n\n### 14. Does Sam support other languages?\nCurrently, English is the default supported language. More language support will be introduced in future versions.\n\n### 15. How can I follow product updates?\nSam is built by TinyLabs. TinyLabs is a venture studio that builds on-chain AI products. You can follow updates through official social media accounts and community channels.",
      ),
  }),
  ai_mode: z.object({
    mode: z.enum(
      [
        'WALLET_DATA',
        'TOKEN_ALERT',
        'BASIC',
        'ASKING_FOR_SELF_WALLET',
        'ASKING_FOR_ALERTS',
      ],
      {
        description:
          'Mode of AI. ASKING_FOR_ALERTS: if user asking for self alerts to list. ASKING_FOR_SELF_WALLET: If user asks for self wallet address or private key. WALLET_DATA: If user is asking about wallet balance, address, or wallet-related data. Wallet can be given with user address like jessepollak, ens name like: sencrazy.eth or zizia.base.eth or directly wallet contract address. TOKEN_ALERT: If user asks for alerts or alarms about tokens or price changes. BASIC: Any other question.',
      },
    ),
  }),
  wallet_data_answer: z.object({
    answer: z
      .string()
      .describe(
        'The answer of the prompt or the question for given data in system prompt.',
      ),
  }),
  token_alert: (data: Record<string, any>) =>
    z.object({
      amount: z.number().describe('The number for the alarm will be set'),
      amount_percentage: z
        .number()
        .describe('The number percentage for alarm will be set to'),
      change_type: z
        .enum(['INCREASE', 'DECREASE'])
        .describe(
          'The type of change. If the user asks for positive change it is increase if asks for negative change it is decrease',
        ),
      key: z
        .string()
        .describe(
          `${JSON.stringify(data)}. The key for asked in question. Just return the key. Do not give the keys with word 'change' included. If the key has alternative of the same key with 'USD' give it, For example v24hUSD instead of v24H. For example: Ping me when SMOL mcap changes X. {key} is corresponding property to get mcap value. Always try to return a related key. This key is important to code work. Always return key.`,
        ),
    }),
  token_address: z
    .object({
      value: z
        .string()
        .describe(
          'Token ticker or symbol. An Example for ABC Token: $ABC, ABC, abc, $abc. Those all for ticker notation. Always try to find one and return it uppercase. Example: what is x for y token. Y is ticker here.',
        ),
      ca: z.string().describe(
        'contract address of ticker. find it from ' +
          JSON.stringify({
            ...TOKENS,
            eth: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          }) +
          ' if exists',
      ),
    })
    .describe(
      'Token ticker or symbol. An Example for ABC Token: $ABC, ABC, abc, $abc. Those all for ticker notation. Always try to find one and return it uppercase. Example: what is x for y token. Y is ticker here.',
    ),
  wallet_provider: z.object({
    provider_type: z.enum(['ens', 'wallet', 'fname', 'base'], {
      description:
        "wallet provider for user. If the user gives a wallet address, it will be 'wallet'. If the user gives an ENS name ending with '.eth', it will be 'ens'. if The user gives name ending with base.eth it will be base. If the user gives a username, it will be 'fname'. If 'fname' and the username has spaces or is more than one word, the type should be 'ask', not 'fname', prompting the user to save the correct form. Value will be wallet address if found, otherwise null.",
    }),
    value: z
      .string()
      .describe(
        "The value of the wallet address. If the type is 'wallet', it will be the found wallet address. Otherwise, it will be the value of the ENS name or username. It can be given even when analyze wanted.",
      ),
  }),
};

export default tools;
