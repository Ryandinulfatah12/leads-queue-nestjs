import { Test, TestingModule } from '@nestjs/testing';
import { QueueService } from './queue.service';
import { LeadService } from '../lead/lead.service';
import { RedisService } from '../redis/redis.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('QueueService', () => {
  let queueService: QueueService;
  let leadService: LeadService;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueService,
        LeadService,
        RedisService,
        PrismaService,
        {
          provide: RedisService,
          useValue: {
            getClient: jest.fn(() => ({
              lpush: jest.fn(),
              llen: jest.fn(),
              rpop: jest.fn(),
              lrange: jest.fn(),
            })),
          },
        },
      ],
    }).compile();

    queueService = module.get<QueueService>(QueueService);
    leadService = module.get<LeadService>(LeadService);
    redisService = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(queueService).toBeDefined();
  });

  describe('addLeadToQueue', () => {
    it('should add lead to redis queue', async () => {
      const lead = { name: 'John Doe', email: 'john.doe@example.com' };
      const redisClient = redisService.getClient() as any;
      const lpushSpy = jest.spyOn(redisClient, 'lpush');

      await queueService.addLeadToQueue(lead);

      expect(lpushSpy).toHaveBeenCalledWith('leadQueue', JSON.stringify(lead));
    });
  });

  describe('processQueue', () => {
    it('should process and add lead from queue to database', async () => {
      const lead = { name: 'John Doe', email: 'john.doe@example.com' };
      const redisClient = redisService.getClient() as any;

      jest.spyOn(redisClient, 'llen').mockResolvedValue(1);
      jest.spyOn(redisClient, 'rpop').mockResolvedValue(JSON.stringify(lead));
      const createLeadSpy = jest.spyOn(leadService, 'createLead');

      await (queueService as any).processQueue(); // Cast to any to access private method

      expect(createLeadSpy).toHaveBeenCalledWith(lead);
    });
  });
});
