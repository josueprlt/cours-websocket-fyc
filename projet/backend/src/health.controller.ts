import { Controller, Get, Header } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('health')
  @Header('Content-Type', 'text/plain; charset=utf-8')
  health(): string {
    return 'Backend prêt — séquence 1. Point WebSocket : /chat';
  }
}
