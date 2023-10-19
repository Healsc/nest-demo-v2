import { Controller, Get, Query, Request } from '@nestjs/common';
import { SessionService } from './session.service';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get('set')
  test(@Query('username') username: string, @Request() req) {
    req.session.name = username;
    return username;
  }
  @Get('get')
  testa(@Request() req: any) {
    const uname = req.session.name;
    return {
      name: uname,
    };
  }
}
