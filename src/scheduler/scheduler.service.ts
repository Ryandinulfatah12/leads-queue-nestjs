import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LeadService } from '../lead/lead.service';
import { QueueService } from '../queue/queue.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly leadService: LeadService,
    private readonly queueService: QueueService,
  ) {}

  @Cron('*/2 * * * *') // Setiap 2 menit
  async handleCron() {
    await this.queueService.requeueLeadsWithNullSalesmanId();
    this.logger.log('Scheduling requeue lead started');
  }
}
