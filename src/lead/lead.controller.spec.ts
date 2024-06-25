import { Test, TestingModule } from '@nestjs/testing';
import { LeadController } from './lead.controller';
import { LeadService } from './lead.service';
import { QueueService } from '../queue/queue.service';

describe('LeadController', () => {
  let leadController: LeadController;
  let leadService: LeadService;
  let queueService: QueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeadController],
      providers: [
        {
          provide: LeadService,
          useValue: {
            createLead: jest.fn(),
            getLeads: jest.fn(),
          },
        },
        {
          provide: QueueService,
          useValue: {
            addLeadToQueue: jest.fn(),
            getLeadQueue: jest.fn(),
          },
        },
      ],
    }).compile();

    leadController = module.get<LeadController>(LeadController);
    leadService = module.get<LeadService>(LeadService);
    queueService = module.get<QueueService>(QueueService);
  });

  it('should be defined', () => {
    expect(leadController).toBeDefined();
  });

  describe('createLead', () => {
    it('should add lead to queue', async () => {
      const lead = { name: 'John Doe', email: 'john.doe@example.com' };
      const addLeadToQueueSpy = jest.spyOn(queueService, 'addLeadToQueue');

      await leadController.createLead(lead);

      expect(addLeadToQueueSpy).toHaveBeenCalledWith(lead);
    });
  });

  describe('getLeads', () => {
    it('should return an array of leads', async () => {
      const result = [{ name: 'John Doe', email: 'john.doe@example.com' }];
      jest
        .spyOn(leadService, 'getLeads')
        .mockImplementation(async () => result);

      expect(await leadController.getLeads()).toBe(result);
    });
  });

  describe('getLeadQueue', () => {
    it('should return an array of leads in queue', async () => {
      const result = [{ name: 'John Doe', email: 'john.doe@example.com' }];
      jest
        .spyOn(queueService, 'getLeadQueue')
        .mockImplementation(async () => result);

      expect(await leadController.getLeadQueue()).toBe(result);
    });
  });
});
