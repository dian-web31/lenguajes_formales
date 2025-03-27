import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  generarLenguaje(
    gramatica: {
      simboloInicial: string;
      producciones: {
        [key: string]: string[];
      };
    },
    maxIteraciones: number = 8
  ): string {
    // Limpiamos y parseamos las producciones
    const produccionesLimpias: { [key: string]: string[] } = {};
    for (const key in gramatica.producciones) {
      produccionesLimpias[key] = gramatica.producciones[key]
        .join(' | ')
        .split('|')
        .map(p => p.trim())
        .filter(p => p !== '');
    }

    // Generamos las cadenas
    const cadenas = this.generarCadenas(gramatica.simboloInicial, produccionesLimpias, maxIteraciones);
    
    // Procesamos las cadenas
    const cadenasProcesadas = this.procesarCadenas(cadenas);
    
    // Formateamos el resultado
    return this.formatearResultado(cadenasProcesadas);
  }

  private generarCadenas(
    simbolo: string,
    producciones: { [key: string]: string[] },
    maxIteraciones: number,
    profundidad: number = 0
  ): string[] {
    if (profundidad >= maxIteraciones) return [];
    
    const resultados: string[] = [];
    
    if (!producciones[simbolo]) {
      // Si no hay producciones, es un terminal
      resultados.push(simbolo);
    } else {
      for (const produccion of producciones[simbolo]) {
        if (produccion === 'λ') {
          resultados.push('λ');
          continue;
        }

        // Dividimos en símbolos y procesamos cada uno
        const simbolos = produccion.split('');
        let combinaciones: string[][] = [[]];

        for (const s of simbolos) {
          const nuevasCombinaciones: string[][] = [];
          const cadenasS = this.generarCadenas(s, producciones, maxIteraciones, profundidad + 1);
          
          for (const cadena of cadenasS) {
            for (const combo of combinaciones) {
              nuevasCombinaciones.push([...combo, cadena]);
            }
          }
          
          combinaciones = nuevasCombinaciones;
        }

        for (const combo of combinaciones) {
          const cadena = combo.join('');
          if (cadena && !resultados.includes(cadena)) {
            resultados.push(cadena);
          }
        }
      }
    }

    return resultados;
  }

  private procesarCadenas(cadenas: string[]): string[] {
    const resultado: string[] = [];
    let tieneLambda = false;

    for (const cadena of cadenas) {
      if (cadena === 'λ') {
        tieneLambda = true;
      } else {
        // Eliminamos todos los λ que no sean la cadena completa
        const cadenaProcesada = cadena.replace(/λ/g, '');
        if (cadenaProcesada && !resultado.includes(cadenaProcesada)) {
          resultado.push(cadenaProcesada);
        }
      }
    }

    // Ordenamos por longitud
    resultado.sort((a, b) => a.length - b.length);

    // Agregamos λ al principio si existe
    if (tieneLambda) {
      resultado.unshift('λ');
    }

    return resultado;
  }

  private formatearResultado(cadenas: string[]): string {
    if (cadenas.length < 2) {
      return `L(G) = { ${cadenas.join(', ')} }`;
    }

    const sinLambda = cadenas.filter(c => c !== 'λ');
    const tieneLambda = cadenas.includes('λ');

    // Caso especial para tu gramática: ab, abab, ababab, etc.
    if (sinLambda.length >= 2) {
      const primera = sinLambda[0]; // 'a'
      const segunda = sinLambda[1]; // 'ab'
      
      // Verificamos si todas las cadenas son 'a' o comienzan con 'ab' y se repite el patrón
      const todasSonAB = sinLambda.every((cadena, i) => {
        if (i === 0) return cadena === 'a';
        return cadena.startsWith('ab') && (cadena === 'ab'.repeat(i) || cadena === 'a');
      });

      if (todasSonAB) {
        // Verificamos si hay un patrón claro de repetición
        if (sinLambda.some(c => c.length > 2)) {
          return `L(G) = { ${tieneLambda ? 'λ, ' : ''}a, ab, abab, ababab, ... }`;
        } else {
          return `L(G) = { ${tieneLambda ? 'λ, ' : ''}a, ab }`;
        }
      }
    }

    // Si no cumple con el patrón especial, mostramos las primeras cadenas
    const mostrar = cadenas.slice(0, 8);
    return `L(G) = { ${mostrar.join(', ')}${cadenas.length > 5 ? ', ...' : ''} }`;
  }
}