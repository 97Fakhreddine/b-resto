import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as helmet from 'helmet';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env') });

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // apply helmet
  app.use(helmet.contentSecurityPolicy());
  app.use(helmet.crossOriginEmbedderPolicy());
  app.use(helmet.crossOriginOpenerPolicy());
  app.use(helmet.crossOriginResourcePolicy());
  app.use(helmet.dnsPrefetchControl());
  app.use(helmet.expectCt());
  app.use(helmet.frameguard());
  app.use(helmet.hidePoweredBy());
  app.use(helmet.hsts());
  app.use(helmet.ieNoOpen());
  app.use(helmet.noSniff());
  app.use(helmet.originAgentCluster());
  app.use(helmet.permittedCrossDomainPolicies());
  app.use(helmet.referrerPolicy());
  app.use(helmet.xssFilter());

  // apply cors
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.setGlobalPrefix('v1/api');
  const config = new DocumentBuilder()
    .setTitle('Resto App API documentations')
    .setDescription('For All developers out there')
    .setVersion('1.0')
    .addTag('v1/api')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'Token',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('v1/docs', app, document);
  // app.register(fastifySwagger, {
  //   routePrefix: '/v1/docs',
  //   swagger: {
  //     info: {
  //       title: 'My API',
  //       description: 'API description',
  //       version: '1.0',
  //     },
  //     tags: [],
  //   },
  //   exposeRoute: true,
  // });
  // Serve static files from the "public" directory
  app.useStaticAssets({
    root: join(__dirname, '..', 'public'),
    prefix: '/public/',
  });
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
