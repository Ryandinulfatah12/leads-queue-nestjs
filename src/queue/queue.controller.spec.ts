import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { QueueService } from './queue.service';

describe('QueueController (e2e)', () => {
  let app: INestApplication;
  const queueService = { getUpdateSalesmanQueue: jest.fn() };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(QueueService)
      .useValue(queueService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/queue/update-salesman-queue (GET)', () => {
    const queueData = [
      { id: 1, name: 'Lead 1', email: 'lead1@example.com', salesmanId: null },
    ];
    queueService.getUpdateSalesmanQueue.mockResolvedValue(queueData);

    return request(app.getHttpServer())
      .get('/queue/update-salesman-queue')
      .expect(200)
      .expect(queueData);
  });

  afterAll(async () => {
    await app.close();
  });
});
