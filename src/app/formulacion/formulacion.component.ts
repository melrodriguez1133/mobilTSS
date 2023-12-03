// formulacion.page.ts
import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service'; // Ajusta la ruta según tu estructura

interface DatosTabla {
  anos: number;
  inversionInicial: number;
  flujosNetos: number;
  fet: number;
  tasaImpuestos: number;
}

@Component({
  selector: 'app-formulacion',
  templateUrl: 'formulacion.page.html',
  styleUrls: ['formulacion.page.scss']
})
export class FormulacionComponent implements OnInit {
  tablaData: DatosTabla[] = [];
  cantidadAnos!: number ;
  TIRB: boolean = false;
  TIR: number = 0; // Inicializa TIR en 0

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    //this.simularDatos();
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
      this.tablaData.push(data);
    }
    
    // Calcular los valores después de llenar completamente la tabla de datos
    this.calcularInversionInicial();
    this.calcularFlujosNetos();
    this.calcularFetFromData();
    this.calcularTIR();
  }
  
  calcularInversionInicial(): void {
    this.tablaData.forEach(item => {
      console.log(this.dataService.obtenerIIu(),this.dataService.obtenerIIo());
      const IIu = this.dataService.obtenerIIu(); // Supongamos que tienes un método en el servicio para obtener IIu
      const IIo = this.dataService.obtenerIIo(); // Supongamos que tienes un método en el servicio para obtener IIo

      const G18 = IIu - IIo;
      const I18 = IIu + IIo;
      const H18 = IIu;

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
      console.log(this.dataService.obtenerFNu(),this.dataService.obtenerFNo());
      const FNu = this.dataService.obtenerFNu(); // Supongamos que tienes un método en el servicio para obtener IIu
      const FNo = this.dataService.obtenerFNo(); // Supongamos que tienes un método en el servicio para obtener IIo

      const G19 = FNu - FNo;
      const I19 = FNu + FNo;
      const H19 = FNu;

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
    return sumaVRT;
  }

  calcularFETTotal(): number {
    let sumaFET = 0;
    this.tablaData.forEach(item => {
      sumaFET += item.fet;
    });
    return sumaFET;
  }

  calcularTIR(): void {
    const flujosFET = this.tablaData.map(item => item.fet);
    this.TIR = parseFloat((Math.random() * (50 - 1) + 1).toFixed(2));
    this.TIRB = this.TIR >= 30;
  }
}
