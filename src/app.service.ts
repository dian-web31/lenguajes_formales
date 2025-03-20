import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  generarLenguaje(
    gramatica: {
      simboloInicial: string,
      producciones: {
        [key: string]: Array<string>
      }
    }
  ): Array<string> {
    if (gramatica.simboloInicial in gramatica.producciones) {
      const currentProducciones = gramatica.producciones[gramatica.simboloInicial]
      currentProducciones.forEach(prod => {
        const symbols = prod.split('')
        symbols.forEach(s => {
          if (s in gramatica.producciones) {
            let newProducciones = this.generarLenguaje({
              simboloInicial: s,
              producciones: gramatica.producciones
            })
            newProducciones.forEach(newProd => {
              currentProducciones.push(newProd)
            })
          }
        })
        /* if (prod in gramatica.producciones) {
          let newProducciones = this.generarLenguaje({
            simboloInicial: prod,
            producciones: gramatica.producciones
          })
          newProducciones.forEach(newProd => {
            currentProducciones.push(newProd)
          })
        } */

      })
    }
    
    return [];
  }


}
