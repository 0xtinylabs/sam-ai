import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiService } from './ai/ai.service';
import { SocialService } from './social/social.service';
import { AlertService } from './alert/alert.service';
import { DBService } from './db/db.service';
import { AgentService } from './agent/agent.service';
import { XmtpService } from './social/platforms/xmtp/xmtp.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    DBService,
    AppService,
    AiService,
    SocialService,
    AlertService,
    AgentService,
    XmtpService,
  ],
})
export class AppModule {}
