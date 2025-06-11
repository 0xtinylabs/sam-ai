import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import messages from 'src/ai/messages';
import { DBService } from 'src/db/db.service';
import { ModulesService } from 'src/modules/modules.service';
import { XmtpService } from 'src/social/platforms/xmtp/xmtp.service';

@Injectable()
export class TasksService {
  constructor(
    public db: DBService,
    public modulesService: ModulesService,
    public xmtpService: XmtpService,
  ) {}

  @Cron('*/5 * * * *')
  async checkForAlerts() {
    const alerts = await this.db.alert.findMany({
      where: {
        is_active: true,
      },
      include: {
        user: {
          select: {
            xmtp_id: true,
          },
        },
      },
    });
    for (const alert of alerts) {
      const data = await this.modulesService.getTokenOverview(
        alert.token_address,
      );
      const current = data?.['data']?.[alert.keyword];
      let trigger = false;
      if (
        (alert.change_type === 'INCREASE' && current > alert.threshold) ||
        (alert.change_type === 'DECREASE' && current < alert.threshold)
      ) {
        trigger = true;
      }
      if (trigger) {
        const conversation = await this.xmtpService.getConversation(
          alert.user.xmtp_id,
        );
        if (conversation) {
          await this.db.alert.update({
            where: {
              id: alert.id,
            },
            data: {
              is_active: false,
            },
          });
          await this.xmtpService.sendMessage(
            conversation,
            messages.alert_triggered(
              alert.threshold,
              alert.ticker,
              alert.keyword,
              alert.change_type as any,
            ),
          );
        }
      } else {
        continue;
      }
    }
  }
}
