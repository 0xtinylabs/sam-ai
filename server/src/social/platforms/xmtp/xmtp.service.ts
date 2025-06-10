import { createSigner, logAgentDetails } from './helper';
import { XmtpMessage } from '../../../types/xmtp.d';
import config from './config';
import * as Xmtp from '@xmtp/node-sdk';

import messages from 'src/ai/messages';
import { Injectable } from '@nestjs/common';
import { AiService } from 'src/ai/ai.service';

type Client = Xmtp.Client;
type Dm = Xmtp.Dm;
type Group = Xmtp.Group;

@Injectable()
export class XmtpService {
  private xmtp: Client | null = null;
  private messageHandler:
    | ((
        conversation: Dm | Group | null,
        message: XmtpMessage,
        address: string,
      ) => void)
    | null = null;

  setMessageHandler(
    handler: (
      conversation: Dm | Group | null,
      message: XmtpMessage,
      address: string,
    ) => void,
  ) {
    this.messageHandler = handler;
  }

  constructor(public aiService: AiService) {
    try {
      this.initializeClient();
    } catch (err) {
      console.log(err);
    }
  }

  async initializeClient(): Promise<void> {
    if (this.xmtp) {
      return;
    }

    const signer = createSigner(config.privateKey);

    this.xmtp = await Xmtp.Client.create(signer, {
      env: config.env,
    });

    logAgentDetails(this.xmtp);

    await this.xmtp.conversations.sync();

    this.startListening(this.xmtp);
  }

  async startListening(xmtp: Client) {
    const stream = await xmtp.conversations.streamAllMessages();

    for await (const message of stream) {
      const xmtpMessage = message as unknown as XmtpMessage;

      if (
        xmtpMessage.senderInboxId == xmtp.inboxId ||
        message?.contentType?.typeId !== 'text'
      )
        continue;

      const inboxState = await xmtp.preferences.inboxStateFromInboxIds([
        xmtpMessage.senderInboxId,
      ]);
      const addressFromInboxId = inboxState[0].identifiers[0].identifier;

      const conversation = await this.getConversation(
        xmtpMessage.conversationId,
      );
      if (!conversation) {
        throw new Error('Conversation not found');
      }

      await this.onMessage(conversation, xmtpMessage, addressFromInboxId);
    }
  }

  async onMessage(
    conversation: Dm | Group | null,
    message: XmtpMessage,
    address: string,
  ) {
    try {
      await this.sendLoading(conversation);
      const response = await this.aiService.processPrompt(message.content);
      await this.sendMessage(conversation, response);
    } catch {
      await this.sendError(conversation);
    }
  }

  async getClient(): Promise<Client> {
    if (!this.xmtp) {
      await this.initializeClient();
    }
    return this.xmtp!;
  }

  async sendLoading(conversation: Dm | Group | null) {
    const loading_id = conversation?.send(messages.thinking);
    return loading_id;
  }

  async sendError(conversation: Dm | Group | null) {
    const error_id = conversation?.send(messages.error);
    return error_id;
  }

  // async removeMessage(conversation: Dm | Group | null, message_id: string) {}

  async sendMessage(conversation: Dm | Group | null, message: string) {
    try {
      if (!conversation) {
        throw new Error('Conversation not found');
      }
      await conversation.send(message);
    } catch (e) {
      console.log('Error sending message, ', e);
    }
  }

  async getConversation(conversationId: string) {
    const client = await this.getClient();
    return await client.conversations.getConversationById(conversationId);
  }
}
