import { Injectable, Logger } from '@nestjs/common';
import { LeadService } from '../lead/lead.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class QueueService {
  private isProcessing = false;
  private readonly logger = new Logger(QueueService.name);

  constructor(
    private readonly redisService: RedisService,
    private readonly leadService: LeadService,
  ) {}

  async addLeadToQueue(lead: { name: string; email: string }) {
    const redis = this.redisService.getClient();
    await redis.lpush('leadQueue', JSON.stringify(lead));
    this.logger.log(`Lead added to queue: ${JSON.stringify(lead)}`);
    this.processQueue();
  }

  private async processQueue() {
    if (this.isProcessing) return;

    this.isProcessing = true;
    const redis = this.redisService.getClient();
    while ((await redis.llen('leadQueue')) > 0) {
      const leadData = await redis.rpop('leadQueue');
      if (leadData) {
        const lead = JSON.parse(leadData);
        const createdLead = await this.leadService.createLead(lead);
        this.logger.log(`Lead created in DB: ${JSON.stringify(createdLead)}`);
        await redis.lpush('updateSalesmanQueue', JSON.stringify(createdLead));
      }
    }
    this.isProcessing = false;
    this.scheduleSalesmanUpdate();
  }

  private async scheduleSalesmanUpdate() {
    this.logger.log('Scheduling salesman update in 2 minutes');
    setTimeout(() => this.processUpdateSalesmanQueue(), 2 * 60 * 1000);
  }

  private async processUpdateSalesmanQueue() {
    const redis = this.redisService.getClient();
    const totalSalesmen = await this.leadService.getSalesmanCount();

    let salesmanIndex = parseInt((await redis.get('salesmanIndex')) || '0', 10);

    while ((await redis.llen('updateSalesmanQueue')) > 0) {
      const leadData = await redis.rpop('updateSalesmanQueue');
      if (leadData) {
        const lead = JSON.parse(leadData);
        const salesmanId = (salesmanIndex % totalSalesmen) + 1;
        await this.leadService.updateLeadSalesmanId(lead.id, salesmanId);
        this.logger.log(
          `Updated Lead ID ${lead.id} with Salesman ID ${salesmanId}`,
        );
        salesmanIndex++;
        await redis.set('salesmanIndex', salesmanIndex.toString());
      }
    }
  }

  async getLeadQueue(): Promise<{ name: string; email: string }[]> {
    const redis = this.redisService.getClient();
    const queue = await redis.lrange('leadQueue', 0, -1);
    return queue.map((item) => JSON.parse(item));
  }

  async requeueLeadsWithNullSalesmanId() {
    const leads = await this.leadService.findLeadsWithNullSalesmanId();
    const redis = this.redisService.getClient();

    for (const lead of leads) {
      await redis.lpush('updateSalesmanQueue', JSON.stringify(lead));
    }

    await this.processUpdateSalesmanQueue();
  }

  async getUpdateSalesmanQueue(): Promise<
    { id: number; name: string; email: string; salesmanId: number | null }[]
  > {
    const redis = this.redisService.getClient();
    const queue = await redis.lrange('updateSalesmanQueue', 0, -1);
    return queue.map((item) => JSON.parse(item));
  }
}
