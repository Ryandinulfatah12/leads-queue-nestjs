import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { LeadModule } from '../lead/lead.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LeadModule,
    RedisModule,
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
