import { Module } from '@nestjs/common';
import { LeadService } from './lead.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { LeadController } from '../lead/lead.controller';
import { QueueService } from 'src/queue/queue.service';

@Module({
  imports: [PrismaModule, RedisModule],
  providers: [LeadService, QueueService],
  controllers: [LeadController],
  exports: [LeadService],
})
export class LeadModule {}
