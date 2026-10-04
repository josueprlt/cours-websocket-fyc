import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Fourni : compatible avec l’API WebSocket native du navigateur.
  app.useWebSocketAdapter(new WsAdapter(app));
  app.enableShutdownHooks();
  await app.listen(3000, '127.0.0.1');
  console.log('Backend prêt : http://127.0.0.1:3000/health');
  console.log('Point WebSocket préparé : ws://127.0.0.1:3000/chat');
}
bootstrap().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
