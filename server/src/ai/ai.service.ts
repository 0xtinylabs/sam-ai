import * as openai from '@ai-sdk/openai';
import { Injectable } from '@nestjs/common';
import { generateText, ToolSet, generateObject } from 'ai';
import { AgentService } from 'src/agent/agent.service';
import { schemaTools } from './tools';
import { z } from 'zod';
import { ModulesService } from 'src/modules/modules.service';
import messages from './messages';
import { DBService } from 'src/db/db.service';
import textUtil from 'src/text.util';

@Injectable()
export class AiService {
  constructor(
    public agentService: AgentService,
    public modulesService: ModulesService,
    public dbService: DBService,
  ) {}

  async sendPrompt(params: {
    prompt: string;
    system?: string;
    tools?: ToolSet;
  }) {
    const aiTools = await this.agentService.createAITools();
    const response = await generateText({
      model: openai.openai('gpt-4o-mini'),
      tools: params.tools ? params.tools : { ...aiTools },
      prompt: params.prompt,
      system: params.system,
    });

    console.log(response.response.messages.map((m) => m.content));
    return response.text;
  }

  async processWalletProvider(
    wallet_provider: z.infer<typeof schemaTools.wallet_provider>,
  ) {
    if (!wallet_provider.value) {
      return null;
    }
    let address;

    if (wallet_provider.provider_type === 'wallet') {
      address = wallet_provider.value;
    }
    if (wallet_provider.provider_type === 'base') {
      const res = await this.modulesService.resolveENSName(
        wallet_provider.value,
      );
      address = res;
    }
    if (wallet_provider.provider_type === 'ens') {
      const res = await this.modulesService.resolveENSName(
        wallet_provider.value,
      );
      address = res;
    }
    if (wallet_provider.provider_type === 'fname') {
      const res = await this.modulesService.resolveFname(wallet_provider.value);
      address = res;
    }
    return address;
  }

  async getWalletProvider(prompt: string) {
    const response = await generateObject({
      model: openai.openai('gpt-4o-mini'),
      schema: schemaTools.wallet_provider,
      prompt,
    });
    const wallet_provider = response.object;
    return wallet_provider;
  }

  async getMode(prompt: string) {
    const response = await generateObject({
      model: openai.openai('gpt-4o-mini'),
      schema: schemaTools.ai_mode,
      prompt,
    });
    const mode = response.object.mode;
    return mode;
  }

  async getAnswerForSchema<T extends z.ZodType>(
    prompt: string,
    schema: T,
    system?: string,
  ): Promise<z.infer<T>> {
    const response = await generateObject({
      model: openai.openai('gpt-4o-mini'),
      schema: schema,
      system: system,
      prompt,
    });
    const o = response.object;
    return o;
  }

  async getAnswerForBasicQuestion(prompt: string) {
    const response = await this.getAnswerForSchema<
      typeof schemaTools.basic_question
    >(prompt, schemaTools.basic_question);
    return response.answer;
  }

  async getAnswerForWalletData(prompt: string, data: Record<string, any>) {
    const response = await this.getAnswerForSchema<
      typeof schemaTools.wallet_data_answer
    >(prompt, schemaTools.wallet_data_answer, JSON.stringify(data));
    return response.answer;
  }

  async getTokenAddress(prompt: string) {
    const response = await this.getAnswerForSchema<
      typeof schemaTools.token_address
    >(prompt, schemaTools.token_address);
    return response;
  }

  public processAlertAmount(
    current_value: number,
    alert_response: {
      amount?: number;
      amount_percentage?: number;
      change_type: 'INCREASE' | 'DECREASE';
    },
  ) {
    if (alert_response.amount && !alert_response.amount_percentage) {
      return alert_response.amount;
    }

    if (alert_response.amount_percentage) {
      if (alert_response.change_type === 'INCREASE') {
        return (current_value * (alert_response.amount_percentage + 100)) / 100;
      } else if (alert_response.change_type === 'DECREASE') {
        return (current_value * (100 - alert_response.amount_percentage)) / 100;
      }
    }

    return current_value;
  }

  async getTokenAlert(prompt, token_address: string) {
    const tokenData = await this.modulesService.getTokenOverview(token_address);
    const response = await this.getAnswerForSchema<
      ReturnType<typeof schemaTools.token_alert>
    >(prompt, schemaTools.token_alert(tokenData));

    const current = tokenData['data'][response.key];
    console.log(current, tokenData['data'], response.key, response);
    const amount = this.processAlertAmount(current, {
      amount: response.amount,
      amount_percentage: response.amount_percentage,
      change_type: response.change_type,
    });
    const is_immediate =
      (response.change_type === 'INCREASE' && amount < current) ||
      (response.change_type === 'DECREASE' && amount > current);

    if (is_immediate) {
      response.change_type =
        response.change_type === 'DECREASE' ? 'INCREASE' : 'DECREASE';
    }

    return {
      threshold: amount,
      keyword: response.key,
      change_type: response?.change_type,
      token_address: token_address,
      ticker: tokenData?.['data']?.symbol ?? '',
    };
  }

  async processPrompt(prompt: string, conversation_id: string) {
    try {
      const mode = await this.getMode(prompt);
      let answer = '';
      console.log(mode);
      if (mode === 'BASIC') {
        const a = await this.getAnswerForBasicQuestion(prompt);
        answer = a;
      }
      if (mode === 'WALLET_DATA') {
        const wallet_provider = await this.getWalletProvider(prompt);
        console.log(wallet_provider);
        const address = await this.processWalletProvider(wallet_provider);

        const wallet_data = await this.modulesService.getWalletData(address);
        console.log(wallet_data);

        const response = await this.getAnswerForWalletData(prompt, wallet_data);
        answer = response;
      }
      if (mode === 'TOKEN_ALERT') {
        const token = await this.getTokenAddress(prompt);
        const alert = await this.getTokenAlert(prompt, token.ca);
        await this.dbService.alert.create({
          data: {
            is_active: true,
            change_type: alert.change_type,
            keyword: alert.keyword,
            token_address: token.ca,
            ticker: alert?.ticker,
            threshold: alert.threshold,
            user: {
              connect: {
                xmtp_id: conversation_id,
              },
            },
          },
        });
        answer = messages.alert_create(
          alert.threshold,
          alert.ticker,
          alert.keyword,
          alert.change_type,
        );
      }
      if (mode === 'ASKING_FOR_SELF_WALLET') {
        const wallet = await this.dbService.user.findUnique({
          where: {
            xmtp_id: conversation_id,
          },
        });
        answer = messages.wallet_data(
          wallet?.wallet_address ?? '',
          wallet?.wallet_private_key ?? '',
        );
      }
      if (mode === 'ASKING_FOR_ALERTS') {
        const alerts = await this.dbService.alert.findMany({
          where: {
            user: {
              xmtp_id: conversation_id,
            },
            is_active: true,
          },
        });
        if (alerts.length === 0) {
          answer = 'You have no active alerts';
        } else {
          let res = 'This is your alerts: \n';
          for (const alert of alerts) {
            res +=
              textUtil.createAlertLine(
                alert.ticker,
                alert.keyword,
                alert.change_type as any,
                alert.threshold,
              ) + '\n';
            answer = res;
          }
        }
      }
      return answer;
    } catch (err) {
      console.log(err);
      return messages.error;
    }
  }
}
