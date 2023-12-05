import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

interface DatosTabla {
  anos: number;
  inversionInicial: number;
  flujosNetos: number;
  fet: number;
  tasaImpuestos: number;
}

@Component({
  selector: 'app-simulacion',
  templateUrl: './simulacion.component.html',
  styleUrls: ['./simulacion.component.scss']
})
export class SimulacionComponent implements OnInit {
  inversionInicial: number = 0;
  desviacionInversionInicial: number = 0;
  flujoNetoInicial: number = 0;
  desviacionFlujoNeto: number = 0;
  tasaTREMA: number = 0;

  tablaData: DatosTabla[] = [];
  cantidadAnos!: number ;
  TIRB: boolean = false;
  TIR: number = 0; // Inicializa TIR en 0
  Trema:number=0;// Inicializa Trema en 0

  constructor(private dataService: DataService) { } // Inyecta el DataService en el constructor

  ngOnInit(): void {
    this.obtenerDatos();
  }

  obtenerDatos() {
    const datosAlmacenados = this.dataService.obtenerDatosAlmacenados();
  
    if (datosAlmacenados) {
      this.inversionInicial = datosAlmacenados.inversionInicial || 0;
      this.desviacionInversionInicial = datosAlmacenados.desviacionInversionInicial || 0;
      this.flujoNetoInicial = datosAlmacenados.flujoNetoInicial || 0;
      this.desviacionFlujoNeto = datosAlmacenados.desviacionFlujoNeto || 0;
      this.tasaTREMA = datosAlmacenados.tasaTREMA || 0;
  
      console.log(
        this.inversionInicial,
        this.desviacionInversionInicial,
        this.flujoNetoInicial,
        this.desviacionFlujoNeto,
        this.tasaTREMA
      );
    } else {
      console.log('Los datos almacenados son nulos o indefinidos.');
      // Aquí puedes manejar la lógica en caso de que los datos sean nulos o indefinidos
    }
  }
  simularDatos(): void {
    this.tablaData = [];
    for (let i = 0; i < this.cantidadAnos; i++) {
      const data: DatosTabla = {
        anos: i + 1,
        inversionInicial: 0,
        flujosNetos: 0,
        fet: 0,
        tasaImpuestos: parseFloat((Math.random() * (0.15 - 0.13) + 0.13).toFixed(2))
      };
      this.calcularInversionInicial();
      this.calcularFlujosNetos();
      this.calcularFetFromData();
      this.calcularValorRescateTotal();
      this.calcularFETTotal();
      this.calcularTIR();
      this.tablaData.push(data);
    }
}
calcularInversionInicial(): void {
  this.tablaData.forEach(item => {
    
    const G18 = this.inversionInicial - this.desviacionInversionInicial ;
    const I18 = this.inversionInicial + this.desviacionInversionInicial ;
    const H18 = this.inversionInicial;

    let resultadoII;

    if (G18 !== H18) {
      if (I18 !== H18) {
        if (Math.random() * (I18 - G18) < (H18 - G18)) {
          resultadoII = G18 + Math.sqrt(Math.random() * (H18 - G18) * (I18 - G18));
        } else {
          resultadoII = I18 - Math.sqrt(Math.random() * (I18 - G18) * (I18 - H18));
        }
      } else {
        resultadoII = H18;
      }
    } else {
      resultadoII = H18;
    }
    item.inversionInicial = parseFloat(resultadoII.toFixed(2)); // Limitar a dos decimales
  });
}
calcularFlujosNetos(): void {
  this.tablaData.forEach(item => {

    const G19 = this.flujoNetoInicial  - this.desviacionFlujoNeto;
    const I19 = this.flujoNetoInicial  + this.desviacionFlujoNeto;
    const H19 = this.flujoNetoInicial ;

    let resultadoFlujosNetos;

    if (G19 !== H19) {
      if (I19 !== H19) {
        if (Math.random() * (I19 - G19) < (H19 - G19)) {
          resultadoFlujosNetos = G19 + Math.sqrt(Math.random() * (H19 - G19) * (I19 - G19));
        } else {
          resultadoFlujosNetos = I19 - Math.sqrt(Math.random() * (I19 - G19) * (I19 - H19));
        }
      } else {
        resultadoFlujosNetos = H19;
      }
    } else {
      resultadoFlujosNetos = H19;
    }
    item.flujosNetos = parseFloat(resultadoFlujosNetos.toFixed(2)); // Limitar a dos decimales
  });
}
calcularFetFromData(): void {
  // Lógica para calcular 'fet' basado en los datos de 'flujosNetos' y 'tasaImpuestos'
  this.tablaData.forEach(item => {
    // Coloca aquí la lógica de cálculo de 'fet' basada en 'flujosNetos' y 'tasaImpuestos'
    const flujosNetos = item.flujosNetos;
    const tasaImpuestos = item.tasaImpuestos;

    // Calcula 'fet' basado en 'flujosNetos' y 'tasaImpuestos'
    let resultadoFet = flujosNetos * (1 - tasaImpuestos) + 0.2 * flujosNetos * (1 - tasaImpuestos);

    // Si quieres que un valor de 'fet' sea negativo, puedes hacerlo aleatoriamente
    if (Math.random() < 0.5) {
      resultadoFet *= -1;
    }

    // Escribe la fórmula correcta
    item.fet = parseFloat(resultadoFet.toFixed(2)); // Limita a dos decimales y actualiza 'fet'
  });
}
calcularValorRescateTotal(): number {
  let sumaVRT = 0;
  this.tablaData.forEach(item => {
    sumaVRT += 0.2 * item.inversionInicial * (1 - item.tasaImpuestos);
  });
  return Number(sumaVRT.toFixed(2)); // Devuelve el resultado redondeado a 2 decimales
}

calcularFETTotal(): number {
  let sumaFET = 0;
  this.tablaData.forEach(item => {
    sumaFET += item.fet;
  });
  return Number(sumaFET.toFixed(2)); // Devuelve el resultado redondeado a 2 decimales
}


calcularTIR(): void {
  const flujosFET = this.tablaData.map(item => item.fet);
  this.TIR = parseFloat((Math.random() * (50 - 1) + 1).toFixed(2));
  this.Trema =this.tasaTREMA; // Obtener el valor de Trema desde el servicio
  this.TIRB = this.TIR >= this.Trema; // Comparar con el valor de Trema
}
}