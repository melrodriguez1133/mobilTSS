import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../data.service';

@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  styleUrls: ['./datos.component.scss'],
})
export class DatosComponent  {

  miFormulario: FormGroup;

  mostrarTabla: boolean = false;

  constructor(private formBuilder: FormBuilder,private dataService: DataService ) {
    this.miFormulario = this.formBuilder.group({
      inversionInicial: ['', [Validators.required, Validators.min(0)]],
      desviacionInversionInicial: ['', [Validators.required, Validators.min(0)]],
      flujoNetoInicial: ['', [Validators.required, Validators.min(0)]],
      desviacionFlujoNeto: ['', [Validators.required, Validators.min(0)]],
      tasaTREMA: ['', [Validators.required, Validators.min(1), Validators.max(100)]]
    }, { validators: this.validarDesviacion });
  }
  

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
  limpiarFormulario() {
    this.miFormulario.reset(); // Restablece los valores del formulario
  }

  enviarFormulario() {
    if (this.miFormulario.valid) {
      const datosFormulario = this.miFormulario.value;
      this.dataService.almacenarDatos(datosFormulario); // Almacena los datos
      console.log('Datos enviados:', datosFormulario);

      const datosAlmacenados = this.dataService.obtenerDatosAlmacenados(); // Obtiene los datos almacenados
      console.log('Datos almacenados en DataService:', datosAlmacenados);
    } else {
      console.log('Por favor, completa correctamente el formulario.');
    }
  }
 /*calcularValores() {
    this.dataService.obtenerDatos().subscribe(
      (datos: any) => {
        // Aquí debes ajustar según la estructura de tus datos
        const inversionInicial = datos.inversionInicial;
        const desviacionInversionInicial = datos.desviacionInversionInicial;
        const flujoNetoInicial = datos.flujoNetoInicial;
        const desviacionFlujoNeto = datos.desviacionFlujoNeto;

        // Verificar si hay datos antes de realizar los cálculos
        if (inversionInicial && desviacionInversionInicial && flujoNetoInicial && desviacionFlujoNeto) {
          const valoresCalculados = {
            inversionInicial: {
              pesimista: inversionInicial + desviacionInversionInicial,
              masProbable: inversionInicial,
              optimista: inversionInicial - desviacionInversionInicial
            },
            flujoNeto: {
              pesimista: flujoNetoInicial + desviacionFlujoNeto,
              masProbable: flujoNetoInicial,
              optimista: flujoNetoInicial - desviacionFlujoNeto
            }
          };

          // Hacer lo que necesites con los valores calculados
          console.log('Valores calculados:', valoresCalculados);
        } else {
          console.error('Faltan datos para calcular valores.');
        }
      },
      error => {
        console.error('Error al obtener los datos:', error);
      }
    );
  }*/
  
  mostrarTablaClick() {
    this.mostrarTabla = true; // Cambiar el estado para mostrar la tabla
  }
}
