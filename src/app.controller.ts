import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('language')
  generarLenguaje(): Array<string {
    return this.appService.generarLenguaje({});
  }
}
