import { Module } from '@nestjs/common';
import { LeadModule } from './lead/lead.module';
import { PrismaModule } from '../prisma/prisma.module';
import { QueueModule } from './queue/queue.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LeadModule,
    PrismaModule,
    QueueModule,
  ],
})
export class AppModule {}
