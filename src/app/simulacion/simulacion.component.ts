import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
//import * as html2pdf from 'html2pdf.js';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content, Table, TDocumentDefinitions } from 'pdfmake/interfaces';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatosComponent } from '../datos/datos.component';


//import { Finance }from 'financejs';
interface DatosTabla {
  anos: number;
  inversionInicial: number;
  flujosNetos: number;
  fet: number;
  tasaImpuestos: number;
}
interface CalculatedValues {
  inversionInicial: {
    pesimista: number;
    masProbable: number;
    optimista: number;
  };
  flujoNeto: {
    pesimista: number;
    masProbable: number;
    optimista: number;
  };
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

  estadoProyecto: string = ''; // Agrega esta línea para declarar la variable estadoProyecto

  tablaData: DatosTabla[] = [];
  cantidadAnos!: number ;
  TIRB: boolean = false;
  TIR: number = 0; // Inicializa TIR en 0
  Trema:number=0;// Inicializa Trema en 0
  mostrarConclusion: boolean = false;
  miFormulario: FormGroup;
  // Referencia a los elementos HTML que deseas incluir en el PDF
  @ViewChild('pdfContent') pdfContent!: ElementRef<any>;
  @ViewChild('table1') table1!: ElementRef<any>;
  @ViewChild('table2') table2!: ElementRef<any>;

  constructor(private formBuilder: FormBuilder, private dataService: DataService) {
    this.miFormulario = this.formBuilder.group({
      inversionInicial: ['', [Validators.required, Validators.min(0)]],
      desviacionInversionInicial: ['', [Validators.required, Validators.min(0)]],
      flujoNetoInicial: ['', [Validators.required, Validators.min(0)]],
      desviacionFlujoNeto: ['', [Validators.required, Validators.min(0)]],
      tasaTREMA: ['', [Validators.required, Validators.min(1), Validators.max(100)]]
    }, { validators: this.validarDesviacion });}

    validarDesviacion(formGroup: FormGroup | null) {
      if (!formGroup) {
        return;
      }
    
      const inversionInicial = formGroup.get('inversionInicial');
      const desviacionInversionInicial = formGroup.get('desviacionInversionInicial');
      const flujoNetoInicial = formGroup.get('flujoNetoInicial');
      const desviacionFlujoNeto = formGroup.get('desviacionFlujoNeto');
    
      if (
        inversionInicial && desviacionInversionInicial &&
        flujoNetoInicial && desviacionFlujoNeto &&
        desviacionInversionInicial.value !== null && desviacionFlujoNeto.value !== null &&
        flujoNetoInicial.value !== null
      ) {
        if (
          desviacionInversionInicial.value > inversionInicial.value ||
          desviacionFlujoNeto.value > flujoNetoInicial.value
        ) {
          desviacionInversionInicial.setErrors({ 'invalidDesviacion': true });
          desviacionFlujoNeto.setErrors({ 'invalidDesviacion': true });
        } else {
          desviacionInversionInicial.setErrors(null);
          desviacionFlujoNeto.setErrors(null);
        }
      }
    }
    
    calcularValores(){
      const datos = this.dataService.obtenerDatosAlmacenados();

      // Calcular los escenarios
      const inversionInicial = datos.inversionInicial;
      const desviacionInversionInicial = datos.desviacionInversionInicial;
      const flujoNetoInicial = datos.flujoNetoInicial;
      const desviacionFlujoNeto = datos.desviacionFlujoNeto;
  
      console.log(inversionInicial,desviacionInversionInicial,flujoNetoInicial,desviacionFlujoNeto );
      
      this.calculatedValues = {
        inversionInicial: {
          pesimista: inversionInicial + desviacionInversionInicial,
          masProbable: inversionInicial,
          optimista: inversionInicial - desviacionInversionInicial,
        },
        flujoNeto: {
          pesimista: flujoNetoInicial + desviacionFlujoNeto,
          masProbable: flujoNetoInicial,
          optimista: flujoNetoInicial - desviacionFlujoNeto,
        }
        
      };
    
    }

    calculatedValues: CalculatedValues | null = {
      inversionInicial: {
        pesimista: 0,
        masProbable: 0,
        optimista: 0,
      },
      flujoNeto: {
        pesimista: 0,
        masProbable: 0,
        optimista: 0,
      },
    };

  parseTable(table: HTMLTableElement): any[] {
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
      this.tablaData.push(data);
      this.calcularInversionInicial();
      this.calcularFlujosNetos();
      this.calcularFetFromData();
      this.calcularValorRescateTotal();
      this.calcularFETTotal();
      this.calcularTir();
      
      }
      this.mostrarConclusion = true;
    this.calcularValores();
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

calcularTir() {
  const tieneDatosFET = this.tablaData.some(item => item.fet !== 0);

  if (tieneDatosFET) {
    const flujosFET = this.tablaData.map(item => item.fet);
    this.TIR = parseFloat((Math.random() * (70 - 1) + 1).toFixed(2));
    this.Trema = this.tasaTREMA; // Obtener el valor de Trema desde el servicio

    // Utilizar una pequeña tolerancia para comparar números flotantes
    const tolerancia = 0.0001; // Puedes ajustar este valor según la precisión requerida

    // Comparar la diferencia entre la TIR y la TREMA con una tolerancia
    this.TIRB = (this.TIR - this.Trema) >= -tolerancia;

    console.log('TIRB:', this.TIRB);

    // Asignar el estado del proyecto
    if (this.TIR >= this.Trema) {
      this.estadoProyecto = 'Proyecto Aceptado';
    } else {
      this.estadoProyecto = 'Proyecto Rechazado';
    }
  } else {
    this.estadoProyecto = 'Proyecto Rechazado';
  }
}


exportToPDF() {
  // Configuración de las fuentes para pdfmake
  (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;


    
  // Verifica que el formulario esté inicializado y tenga valores
  if (this.miFormulario && this.miFormulario.value) {
    // Almacena los valores del formulario en variables
    const inversionInicial = this.miFormulario.get('inversionInicial')?.value;
    const desviacionInversionInicial = this.miFormulario.get('desviacionInversionInicial')?.value;
    const flujoNetoInicial = this.miFormulario.get('flujoNetoInicial')?.value;
    const desviacionFlujoNeto = this.miFormulario.get('desviacionFlujoNeto')?.value;
    const tasaTREMA = this.miFormulario.get('tasaTREMA')?.value;
  // Contenido del PDF
  const content: Content[] = [
    {
      text: 'Valores Iniciales',
      style: 'titulo',
      marginLeft: 60,
    },
    {
      table: {
        body: [
          [
            { text: 'Inversión Inicial', style: 'tituloTabla' },
            { text: 'Desviación Inv. Inicial', style: 'tituloTabla' },
            { text: 'Flujo Neto Inicial', style: 'tituloTabla' },
            { text: 'Desviación Flujo Neto', style: 'tituloTabla' },
            { text: 'TASA TREMA', style: 'tituloTabla' }
          ],
          [
            this.inversionInicial,
            this.desviacionInversionInicial,
            this.flujoNetoInicial,
            this.desviacionFlujoNeto,
            this.tasaTREMA,
          ]
        ],
        headerRows: 1,
        widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
        bodyStyles: { fontSize: 12, textColor: 'black' },
        alternateRowStyles: { fillColor: '#f2f2f2' },
        alignment: 'center', // Centrar la tabla de valores iniciales
      } as Table,
      margin: [60, 10, 60, 10], // Márgenes superior, derecho, inferior, izquierdo
    },
    {
      table: {
        body: [
          [{ text: 'Variable', style: 'tituloTabla' }, { text: 'Pesimista', style: 'tituloTabla' }, { text: 'Mas Probable', style: 'tituloTabla' }, { text: 'Optimista', style: 'tituloTabla' }],
          [
            { text: "Inversion Inicial", style: 'tituloVar' },
            this.calculatedValues?.inversionInicial.pesimista,
            this.calculatedValues?.inversionInicial.masProbable,
            this.calculatedValues?.inversionInicial.optimista,
          ],
          [
            { text: "Flujo Neto", style: 'tituloVar' },
            this.calculatedValues?.flujoNeto.pesimista,
            this.calculatedValues?.flujoNeto.masProbable,
            this.calculatedValues?.flujoNeto.optimista,
          ]
        ],
        headerRows: 1,
        widths: ['auto', 'auto', 'auto', 'auto'],
        bodyStyles: { fontSize: 12, textColor: 'black' },
        alternateRowStyles: { fillColor: '#f2f2f2' },
        alignment: 'center',
      } as Table,
      margin: [60, 10, 60, 10],
    },
    {
      text: '\n', // Agregar espacio entre las tablas
    },
    {
      text: 'Resultados Simulación',
      style: 'titulo',
      marginLeft: 60,
    },
    {
      table: {
        body: [
          [{ text: 'Valor de Rescate Total', style: 'tituloTabla' }, { text: 'FET Total', style: 'tituloTabla' }, { text: 'TIR', style: 'tituloTabla' }, { text: 'Estado', style: 'tituloTabla' }],
          [this.calcularValorRescateTotal(), this.calcularFETTotal(), this.TIR, { text: this.TIRB ? 'Proyecto Aceptado' : 'Proyecto Rechazado', style: this.TIRB ? 'aprobar' : 'rechazar' }]
        ],
        headerRows: 1,
        widths: ['auto', 'auto', 'auto', 'auto'],
        bodyStyles: { fontSize: 12, textColor: 'black' },
        alternateRowStyles: { fillColor: '#f2f2f2' },
        alignment: 'center', // Centrar la primera tabla
      } as Table,
      margin: [60, 10, 60, 10], // Márgenes superior, derecho, inferior, izquierdo
    },
    {
      text: '\n', // Agregar espacio entre las tablas
    },
    {
      table: {
        body: [
          [{ text: 'Años', style: 'tituloTabla' }, { text: 'Inversión Inicial', style: 'tituloTabla' }, { text: 'Flujos Netos', style: 'tituloTabla' }, { text: 'FET', style: 'tituloTabla' }, { text: 'TASA Impuestos', style: 'tituloTabla' }],
          ...this.tablaData.map(row => [row.anos, row.inversionInicial, row.flujosNetos, row.fet, row.tasaImpuestos])
        ],
        headerRows: 1,
        widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
        bodyStyles: { fontSize: 12, textColor: 'black' },
        alternateRowStyles: { fillColor: '#f2f2f2' },
        alignment: 'center', // Centrar la segunda tabla
      } as Table,
      margin: [60, 10, 60, 10], // Márgenes superior, derecho, inferior, izquierdo
    },
    {
      text: '\n', // Agregar espacio entre las tablas
    },
    {
      text: [{ text: 'Conclusión ', style: 'titulo' }, '\n','\n', this.pdfContent.nativeElement.innerText],
      fontSize: 12,
      marginLeft: 60, // Ajuste para alinear a la izquierda
      color: 'black',
    },
  ];

  // Definir estilos adicionales
  const styles = {
    aprobar: { fillColor: '#27ae60', color: 'white' },
    rechazar: { fillColor: '#e74c3c', color: 'white' },
    titulo: { bold: true, color: '#003770' },
    tituloTabla: { fillColor: '#003770', color: 'white', bold: true },
    tituloVar: { fillColor: '#82A1CE', color: 'white', bold: true },
  };

  // Configuración del documento PDF
  const documentDefinition: TDocumentDefinitions = {
    content,
    styles,
  };

  // Descargar el PDF
  pdfMake.createPdf(documentDefinition).download('tabla_distribucion_triangular.pdf');
  }
}
}