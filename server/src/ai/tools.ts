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
          enum: ['WALLET_DATA', 'TOKEN_ALERT', 'BASIC'],
          description:
            'Mode of AI. WALLET_DATA: If user is asking about wallet balance, address, or wallet-related data. TOKEN_ALERT: If user asks for alerts or alarms about tokens or price changes. BASIC: Any other question.',
        },
      },
      required: ['mode'],
    },
  },
};

export const schemaTools = {
  ai_mode: z.object({
    mode: z.enum(['WALLET_DATA', 'TOKEN_ALERT', 'BASIC'], {
      description:
        'Mode of AI. WALLET_DATA: If user is asking about wallet balance, address, or wallet-related data. TOKEN_ALERT: If user asks for alerts or alarms about tokens or price changes. BASIC: Any other question.',
    }),
  }),
  wallet_provider: z.object({
    provider_type: z.enum(['ens', 'wallet', 'fname'], {
      description:
        "wallet provider for user. If the user gives a wallet address, it will be 'wallet'. If the user gives an ENS name ending with '.eth', it will be 'ens'. If the user gives a username, it will be 'fname'. If 'fname' and the username has spaces or is more than one word, the type should be 'ask', not 'fname', prompting the user to save the correct form. Value will be wallet address if found, otherwise null.",
    }),
    value: z.string().nullable().describe(
      // `.nullable()` ile null olabileceğini belirtiyoruz
      "The value of the wallet address. If the type is 'wallet', it will be the found wallet address. Otherwise, it will be the value of the ENS name or username. It can be given even when analyze wanted.",
    ),
  }),
};

export default tools;
