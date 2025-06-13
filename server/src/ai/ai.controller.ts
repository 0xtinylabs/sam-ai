import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';
import { UserService } from 'src/user/user.service';
import messages from './messages';

@Controller('ai')
export class AiController {
  constructor(
    public aiService: AiService,
    public userService: UserService,
  ) {}

  @Post('/send')
  async askToAI(
    @Body('message') message: string,
    @Body('xmtp_id') xmtp_id: string,
  ) {
    try {
      const is_user_exist = await this.userService.existUser(xmtp_id);
      if (!is_user_exist) {
        const data = await this.userService.createXMTPUser(xmtp_id);
        return {
          message: messages.new_user(data.wallet.address),
        };
      }
      const response = await this.aiService.processPrompt(message, xmtp_id);
      return {
        message: response,
      };
    } catch (err) {
      console.log(err);
      return {
        message: messages.error,
      };
    }
  }
}
