import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
//import * as html2pdf from 'html2pdf.js';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import { TDocumentDefinitions } from 'pdfmake/interfaces';

//import { Finance }from 'financejs';



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
  // Referencia a los elementos HTML que deseas incluir en el PDF
  @ViewChild('pdfContent') pdfContent!: ElementRef<any>;
  @ViewChild('table1') table1!: ElementRef<any>;
  @ViewChild('table2') table2!: ElementRef<any>;

  constructor(private dataService: DataService) { } // Inyecta el DataService en el constructor

  // Función auxiliar para calcular la TIR
/*private calcularTIRParaFlujos(flujos: number[]): number {
  const finance = new Finance();
  return parseFloat(finance.IRR.apply(null, [0, ...flujos]).toFixed(2));
}*/
  

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

/*calcularTIR(): void {
  const flujosFET = this.tablaData.map(item => item.fet);

  // Verifica que haya al menos un valor positivo y uno negativo
  if (flujosFET.some(valor => valor > 0) && flujosFET.some(valor => valor < 0)) {
    // Agrega un flujo de caja inicial de 0 al array
    const flujosParaTIR = [0, ...flujosFET];

    // Calcula la TIR para toda la columna 'fet' utilizando la función auxiliar
    this.TIR = this.calcularTIRParaFlujos(flujosParaTIR);

    this.Trema = this.tasaTREMA; // Obtener el valor de Trema desde el servicio
    this.TIRB = this.TIR >= this.Trema; // Comparar con el valor de Trema
  } else {
    // Manejar el caso en el que no haya suficientes valores positivos o negativos
    console.error('ERROR: IRR requiere al menos un valor positivo y uno negativo en la columna "fet".');
    // Puedes agregar lógica adicional aquí según tus necesidades
  }
}*/




calcularTIR(): void {
  const flujosFET = this.tablaData.map(item => item.fet);
  this.TIR = parseFloat((Math.random() * (50 - 1) + 1).toFixed(2));
  this.Trema =this.tasaTREMA; // Obtener el valor de Trema desde el servicio
  this.TIRB = this.TIR >= this.Trema; // Comparar con el valor de Trema
}

/*exportToPDF() {
  const content = document.getElementById('pdfContent');

  if (!content) {
    console.error('Error: No se pudo encontrar el elemento con id "pdfContent".');
    return;
  }

  const options = {
    margin: 10,
    filename: 'tabla_distribucion_triangular.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  };

  html2pdf().from(content).set(options).outputPdf().then((pdf: any) => {
    console.log('Generación del PDF completada.');
    console.log(content);

    // Crea un Blob y URL para el PDF generado
    const blob = new Blob([pdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    // Crea un enlace y simula el clic para descargar el archivo
    const link = document.createElement('a');
    link.href = url;
    link.download = options.filename;
    link.click();

    console.log('Descarga completada.');
  }).catch((error: any) => {
    console.error('Error al generar y descargar el PDF:', error);
  });

  console.log('Generando PDF...');
}*/

exportToPDF() {
  // Configuración de las fuentes para pdfmake
  (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;


  const content = [];  


  
  // Tabla 1
  content.push({ table: { body: this.parseTable(this.table1.nativeElement) }, layout: 'headerLineOnly', margin: [0, 0, 0, 10] });

  // Tabla 2
  content.push({ table: { body: this.parseTable(this.table2.nativeElement) }, layout: 'headerLineOnly', margin: [0, 0, 0, 10] });

  // Contenido de texto
  content.push({ text: this.pdfContent.nativeElement.innerText, fontSize: 12, margin: [0, 0, 0, 10] });

 // Configuración del documento PDF
const documentDefinition: TDocumentDefinitions = {
  content: [
    { table: { body: this.parseTable(this.table1.nativeElement) }, layout: 'headerLineOnly', margin: [0, 0, 0, 10] },
    { table: { body: this.parseTable(this.table2.nativeElement) }, layout: 'headerLineOnly', margin: [0, 0, 0, 10] },
    { text: this.pdfContent.nativeElement.innerText, fontSize: 12, margin: [0, 0, 0, 10] }
  ]
};


  // Descargar el PDF
  pdfMake.createPdf(documentDefinition).download('tabla_distribucion_triangular.pdf');
}

// Función para convertir una tabla HTML a una estructura reconocida por pdfmake
parseTable(table: HTMLTableElement) {
  const body = [];
  for (let i = 0; i < table.rows.length; i++) {
    const row = [];
    for (let j = 0; j < table.rows[i].cells.length; j++) {
      row.push(table.rows[i].cells[j].innerText);
    }
    body.push(row);
  }
  return body;
}

}