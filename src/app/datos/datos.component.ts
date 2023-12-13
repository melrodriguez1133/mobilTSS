import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../data.service';
import { ModalController } from '@ionic/angular';
import { ModalMensajeComponent } from '../modal-mensaje/modal-mensaje.component';
import { Router } from '@angular/router';

// Interfaz para definir la estructura de los valores calculados
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
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  styleUrls: ['./datos.component.scss'],
})


export class DatosComponent  {
  // Formulario Reactivo
  miFormulario: FormGroup;

  // Estado para mostrar/ocultar la tabla de resultados
  mostrarTabla: boolean = false;

  // Almacena los valores calculados
  constructor(private modalController: ModalController,private formBuilder: FormBuilder,private dataService: DataService,private router: Router ) {
    // Inicialización del formulario con validadores
    this.miFormulario = this.formBuilder.group({
      inversionInicial: ['', [Validators.required, Validators.min(0)]],
      desviacionInversionInicial: ['', [Validators.required, Validators.min(0)]],
      flujoNetoInicial: ['', [Validators.required, Validators.min(0)]],
      desviacionFlujoNeto: ['', [Validators.required, Validators.min(0)]],
      tasaTREMA: ['', [Validators.required, Validators.min(1), Validators.max(100)]]
    }, { validators: this.validarDesviacion });
  }
  
  // Validador personalizado para la relación entre la inversión y su desviación
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
  // Limpiar el formulario y ocultar la tabla de resultados
  limpiarFormulario() {
    this.mostrarTabla = false;
    this.miFormulario.reset(); // Restablece los valores del formulario
  }
  // Enviar el formulario y mostrar mensaje modal
  async enviarFormulario() {
    if (this.miFormulario.valid) {
      const datosFormulario = this.miFormulario.value;
      this.dataService.almacenarDatos(datosFormulario); // Almacena los datos
      console.log('Datos enviados:', datosFormulario);
      // Mostrar la tabla de resultados
      this. mostrarTablaClick();
      const datosAlmacenados = this.dataService.obtenerDatosAlmacenados(); // Obtiene los datos almacenados
      console.log('Datos almacenados en DataService:', datosAlmacenados);
      // Mostrar mensaje modal
      const modal = await this.modalController.create({
        component: ModalMensajeComponent,
        componentProps: {
          mensaje: 'Datos correctamente registrados'
        }
      });

      await modal.present();
    } else {
      console.log('Por favor, completa correctamente el formulario.');
    }
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
  resultadosCalculados = false;
  escenariosInversion: any = {};
  escenariosFlujo: any = {};
  
     // Función para simular el cálculo de escenarios
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

  // Mostrar la tabla de resultados
  mostrarTablaClick() {
    this.calcularValores(); // Calcular valores
    this.mostrarTabla = true; // Cambiar el estado para mostrar la tabla
  }
  // Navegar a la página de simulación
  botonsimulacion() {
    this.router.navigate(['/simulacion']);
  }
  // Navegar a la página de conceptos básicos
  botonconceptos() {
    this.router.navigate(['/conceptos-basicos']);
  }
}
