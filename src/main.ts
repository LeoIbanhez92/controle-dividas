import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dns from 'dns';

process.env.TZ = 'America/Sao_Paulo';
dns.setDefaultResultOrder('ipv4first');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Controle de Dividas')
    .setDescription('Controle de Dividas')
    .setContact("Leonardo Ibanhez", "https://www.linkedin.com/in/leonardoibanhez/", "Leonardohibanhez@gmail.com")
    .setVersion('1.0')
    .addBearerAuth()
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        in: 'header',
        description: 'Informe o Token JWT **sem** o prefixo Bearer.',
      }
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
