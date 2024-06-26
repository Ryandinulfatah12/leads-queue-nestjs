import { Controller, Get, Post } from '@nestjs/common';
import { QueueService } from './queue.service';

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Get('update-salesman-queue')
  async getUpdateSalesmanQueue() {
    return this.queueService.getUpdateSalesmanQueue();
  }
  @Post('requeue-lead')
  async requeueLeadsWithNullSalesmanId() {
    await this.queueService.requeueLeadsWithNullSalesmanId();
    return { message: 'Leads with null salesmanId requeued successfully' };
  }
}
