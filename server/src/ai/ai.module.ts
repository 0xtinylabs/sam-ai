import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { AgentService } from 'src/agent/agent.service';
import { UserService } from 'src/user/user.service';
import { ModulesService } from 'src/modules/modules.service';
import { DBService } from 'src/db/db.service';

@Module({
  controllers: [AiController],
  providers: [AiService, AgentService, UserService, ModulesService, DBService],
})
export class AiModule {}
