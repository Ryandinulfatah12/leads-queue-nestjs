import { Injectable } from '@nestjs/common';
import { LeadService } from '../lead/lead.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class QueueService {
  private isProcessing = false;

  constructor(
    private readonly redisService: RedisService,
    private readonly leadService: LeadService,
  ) {}

  async addLeadToQueue(lead: { name: string; email: string }) {
    const redis = this.redisService.getClient();
    await redis.lpush('leadQueue', JSON.stringify(lead));
    this.processQueue();
  }

  async processQueue() {
    if (this.isProcessing) return;

    this.isProcessing = true;
    const redis = this.redisService.getClient();
    while ((await redis.llen('leadQueue')) > 0) {
      const leadData = await redis.rpop('leadQueue');
      if (leadData) {
        const lead = JSON.parse(leadData);
        const salesmanId = await this.getNextSalesmanId(); // Get next available salesmanId
        await this.leadService.createLead({ ...lead, salesmanId });
      }
    }

    this.isProcessing = false;
  }

  private async getNextSalesmanId(): Promise<number> {
    return 1; // Replace with your logic to find the next salesmanId
  }

  async getLeadQueue(): Promise<{ name: string; email: string }[]> {
    const redis = this.redisService.getClient();
    const queue = await redis.lrange('leadQueue', 0, -1);
    return queue.map((item) => JSON.parse(item));
  }
}
