import { Controller, Post, Body, Get } from '@nestjs/common';
import { LeadService } from './lead.service';
import { QueueService } from '../queue/queue.service';

@Controller('leads')
export class LeadController {
  constructor(
    private readonly leadService: LeadService,
    private readonly queueService: QueueService,
  ) {}

  @Post()
  async createLead(@Body() body: { name: string; email: string }) {
    this.queueService.addLeadToQueue(body);
    return { message: 'Lead added to queue' };
  }

  @Get()
  async getLeads() {
    return this.leadService.getLeads();
  }

  @Get('queue')
  async getLeadQueue() {
    return this.queueService.getLeadQueue();
  }
}
