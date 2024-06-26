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
      return await this.prisma.lead.create({
        data,
      });
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        // Lead with this email already exists, return the existing lead
        return await this.prisma.lead.findUnique({
          where: {
            email: data.email,
          },
        });
      } else {
        throw error;
      }
    }
  }

  async getSalesmanCount(): Promise<number> {
    return await this.prisma.salesman.count();
  }

  async updateLeadSalesmanId(leadId: number, salesmanId: number) {
    return await this.prisma.lead.update({
      where: { id: leadId },
      data: { salesmanId },
    });
  }
  async getLeads(): Promise<{ name: string; email: string }[]> {
    const queue = await this.redisService
      .getClient()
      .lrange('leadQueue', 0, -1);
    return queue.map((item) => JSON.parse(item));
  }
}
