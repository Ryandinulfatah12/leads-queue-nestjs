import { Module } from '@nestjs/common';
import { LeadModule } from './lead/lead.module';
import { PrismaModule } from '../prisma/prisma.module';
import { QueueModule } from './queue/queue.module';
import { ConfigModule } from '@nestjs/config';
import { SchedulerModule } from './scheduler/scheduler.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LeadModule,
    PrismaModule,
    QueueModule,
    SchedulerModule,
    CommonModule,
  ],
})
export class AppModule {}
