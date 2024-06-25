import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

declare const module: any;

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);

    // Hot Module Replacement (HMR) setup
    if (module.hot) {
      module.hot.accept();
      module.hot.dispose(() => app.close());
    }

    console.log(`Application is running on: http://localhost:3000`);
  } catch (error) {
    console.error('Error starting the application:', error);
    process.exit(1);
  }
}

bootstrap();
