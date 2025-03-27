import { Controller, Body, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { GramaticaDto } from './gramatica/dto/gramatica.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('generar-lenguaje')
  generarLenguaje(@Body() gramaticaDto: GramaticaDto): { lenguaje: string } {
    const lenguaje = this.appService.generarLenguaje(gramaticaDto);
    return { lenguaje };
  }
}
