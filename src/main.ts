import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT ?? 5000;

  const corsOptions = {
    credentials: true,
    origin: '*',
  };

  app.useGlobalPipes(new ValidationPipe());
  app.use(cors(corsOptions));

  await app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
}
bootstrap();
