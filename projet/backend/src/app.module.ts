import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { ChatGateway } from './chat.gateway';

@Module({ controllers: [HealthController], providers: [ChatGateway] })
export class AppModule {}
