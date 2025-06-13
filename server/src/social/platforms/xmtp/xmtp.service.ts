import { XmtpMessage } from '../../../types/xmtp.d';
import * as Xmtp from '@xmtp/node-sdk';

import messages from 'src/ai/messages';
import { Injectable } from '@nestjs/common';
import { AiService } from 'src/ai/ai.service';
import { UserService } from 'src/user/user.service';
import xmtpInitService from './xmtp.init.service';

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

  constructor(
    public aiService: AiService,
    public userService: UserService,
  ) {
    try {
      xmtpInitService.initializeClient().then(async (xmtp) => {
        this.xmtp = xmtp;
        await this.startListening(this.xmtp);
      });
    } catch (err) {
      console.log(err);
    }
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

      const conversation = await this.getConversation(
        xmtpMessage.conversationId,
      );
      if (!conversation) {
        throw new Error('Conversation not found');
      }

      await this.onMessage(conversation, xmtpMessage);
    }
  }

  async onMessage(conversation: Dm | Group | null, message: XmtpMessage) {
    console.log(message);
    if (!conversation) {
      return;
    }
    try {
      const is_user_exist = await this.userService.existUser(conversation?.id);
      if (!is_user_exist) {
        const data = await this.userService.createXMTPUser(conversation.id);
        return this.sendMessage(
          conversation,
          messages.new_user(data.wallet.address),
        );
      }
      await this.sendLoading(conversation);
      const response = await this.aiService.processPrompt(
        message.content,
        conversation.id,
      );
      await this.sendMessage(conversation, response);
    } catch {
      await this.sendError(conversation);
    }
  }

  async getClient(): Promise<Client> {
    if (!this.xmtp) {
      this.xmtp = await xmtpInitService.initializeClient();
      return this.xmtp;
    }
    return this.xmtp;
  }

  async sendLoading(conversation: Dm | Group | null) {
    const loading_id = conversation?.send(messages.thinking);
    return loading_id;
  }

  async sendError(conversation: Dm | Group | null) {
    const error_id = conversation?.send(messages.error);
    return error_id;
  }

  async setMessage() {}

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
