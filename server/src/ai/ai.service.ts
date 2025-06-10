import * as openai from '@ai-sdk/openai';
import { Injectable } from '@nestjs/common';
import { generateText, ToolSet, generateObject } from 'ai';
import { AgentService } from 'src/agent/agent.service';
import { schemaTools } from './tools';

@Injectable()
export class AiService {
  constructor(public agentService: AgentService) {}

  async sendPrompt(params: {
    prompt: string;
    system?: string;
    tools?: ToolSet;
  }) {
    const aiTools = await this.agentService.createAITools();
    const response = await generateText({
      model: openai.openai('gpt-4o-mini'),
      tools: { ...aiTools, ...params.tools },
      prompt: params.prompt,
      system: params.system,
    });
    console.log(
      response,
      response.text,
      response.response.messages?.map((m) => m.content),
      response.response.messages?.[0].content,
    );
    return response.text;
  }

  async processWalletProvider(
    wallet_provider:   instanceof schemaTools.wallet_provider,
  ) {

    if (wallet_provider)

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

  async processPrompt(prompt: string) {
    const mode = await this.getMode(prompt);
    const response = await this.sendPrompt({
      prompt: prompt,
    });
    return response;
  }
}
