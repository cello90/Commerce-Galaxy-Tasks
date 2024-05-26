import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { createLogger } from './logger/winston.logger';
import { ValidationPipe } from '@nestjs/common';

const logger = createLogger();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(
		WinstonModule.createLogger({
			instance: logger,
		}),
	);

  app.useGlobalPipes(
		new ValidationPipe({
			enableDebugMessages: true,
			forbidUnknownValues: true,
			whitelist: true,
			validationError: {
				target: true,
				value: true,
			},
		}),
	);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('server.port');

  await app.listen(port, () => {
    logger.log(`Task Scheduler is running on port ${port}`, 'main');
  });
}
bootstrap();
