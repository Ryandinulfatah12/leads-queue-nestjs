import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './scheduler.service';
import { QueueModule } from '../queue/queue.module';
import { LeadModule } from '../lead/lead.module';

@Module({
  imports: [ScheduleModule.forRoot(), QueueModule, LeadModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
