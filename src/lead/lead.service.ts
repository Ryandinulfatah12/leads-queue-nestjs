import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class LeadService {
  constructor(
    private prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async createLead(data: { name: string; email: string }) {
    try {
      const existingLead = await this.prisma.lead.findUnique({
        where: {
          email: data.email,
        },
      });

      if (existingLead) {
        // Lead with this email already exists
        throw new Error('Lead with this email already exists');
      }

      return await this.prisma.lead.create({
        data,
      });
    } catch (error) {
      throw new Error(`Failed to create lead: ${error.message}`);
    }
  }

  async getLeads(): Promise<{ name: string; email: string }[]> {
    const redis = this.redisService.getClient();
    const queue = await redis.lrange('leadQueue', 0, -1);
    return queue.map((item) => JSON.parse(item));
  }
}
